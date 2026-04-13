import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";

interface JobDetailRow extends RowDataPacket {
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
    // fallback
  }

  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const db = getDbPool();

  if (!db) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 503 },
    );
  }

  try {
    const [rows] = await db.query<JobDetailRow[]>(
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
      WHERE j.id = ?
      GROUP BY j.id
      LIMIT 1`,
      [id],
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const row = rows[0];

    return NextResponse.json({
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
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch job" },
      { status: 500 },
    );
  }
}
