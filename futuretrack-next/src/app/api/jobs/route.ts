import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";

interface JobRow extends RowDataPacket {
  id: number;
  title: string;
  company_name: string;
  location: string;
  domain: string;
  experience_level: "Entry" | "Mid" | "Senior";
  salary_min: number | null;
  salary_max: number | null;
  description: string | null;
  responsibilities: string | null;
  benefits: string | null;
  required_skills: string | null;
}

function parseList(value: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fallback to comma-separated values if invalid JSON
  }

  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export async function GET(request: Request) {
  const db = getDbPool();

  if (!db) {
    return NextResponse.json({
      data: [],
      meta: { dbConnected: false, message: "Database is not configured." },
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim();
    const domain = searchParams.get("domain")?.trim();
    const level = searchParams.get("level")?.trim();
    const location = searchParams.get("location")?.trim();

    const conditions: string[] = [];
    const values: Array<string> = [];

    if (query) {
      conditions.push("(j.title LIKE ? OR j.company_name LIKE ? OR s.name LIKE ?)");
      values.push(`%${query}%`, `%${query}%`, `%${query}%`);
    }

    if (domain) {
      conditions.push("j.domain = ?");
      values.push(domain);
    }

    if (level) {
      conditions.push("j.experience_level = ?");
      values.push(level);
    }

    if (location) {
      conditions.push("j.location LIKE ?");
      values.push(`%${location}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.query<JobRow[]>(
      `SELECT
        j.id,
        j.title,
        j.company_name,
        j.location,
        j.domain,
        j.experience_level,
        j.salary_min,
        j.salary_max,
        j.description,
        j.responsibilities,
        j.benefits,
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR '||') AS required_skills
      FROM jobs j
      LEFT JOIN job_skills js ON js.job_id = j.id
      LEFT JOIN skills s ON s.id = js.skill_id
      ${whereClause}
      GROUP BY j.id
      ORDER BY j.created_at DESC`,
      values,
    );

    const data = rows.map((row) => ({
      id: row.id,
      title: row.title,
      company: row.company_name,
      location: row.location,
      domain: row.domain,
      experienceLevel: row.experience_level,
      requiredSkills: row.required_skills ? row.required_skills.split("||") : [],
      salaryRange:
        row.salary_min && row.salary_max
          ? `INR ${(row.salary_min / 100000).toFixed(1)}L - ${(row.salary_max / 100000).toFixed(1)}L`
          : "Not disclosed",
      summary: row.description ?? "",
      responsibilities: parseList(row.responsibilities),
      benefits: parseList(row.benefits),
    }));

    return NextResponse.json({ data, meta: { dbConnected: true } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const db = getDbPool();

  if (!db) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();

    if (!body.title || !body.company || !body.location || !body.domain || !body.experienceLevel) {
      return NextResponse.json(
        { error: "title, company, location, domain and experienceLevel are required." },
        { status: 400 },
      );
    }

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO jobs (
         title, company_name, location, domain, experience_level,
         salary_min, salary_max, description, responsibilities, benefits
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        body.company,
        body.location,
        body.domain,
        body.experienceLevel,
        body.salaryMin ?? null,
        body.salaryMax ?? null,
        body.summary ?? null,
        JSON.stringify(body.responsibilities ?? []),
        JSON.stringify(body.benefits ?? []),
      ],
    );

    return NextResponse.json({ id: result.insertId, message: "Job created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create job" },
      { status: 500 },
    );
  }
}
