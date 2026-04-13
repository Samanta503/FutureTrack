import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";

interface CourseRow extends RowDataPacket {
  id: number;
  title: string;
  provider: string;
  domain: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration_hours: number | null;
  description: string | null;
  covered_skills: string | null;
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
    const category = searchParams.get("category")?.trim();
    const level = searchParams.get("level")?.trim();
    const domain = searchParams.get("domain")?.trim();

    const conditions: string[] = [];
    const values: string[] = [];

    if (query) {
      conditions.push("(c.title LIKE ? OR c.provider LIKE ? OR s.name LIKE ?)");
      values.push(`%${query}%`, `%${query}%`, `%${query}%`);
    }

    if (category) {
      conditions.push("c.category = ?");
      values.push(category);
    }

    if (level) {
      conditions.push("c.level = ?");
      values.push(level);
    }

    if (domain) {
      conditions.push("c.domain = ?");
      values.push(domain);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.query<CourseRow[]>(
      `SELECT
        c.id,
        c.title,
        c.provider,
        c.domain,
        c.category,
        c.level,
        c.duration_hours,
        c.description,
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR '||') AS covered_skills
      FROM courses c
      LEFT JOIN course_skills cs ON cs.course_id = c.id
      LEFT JOIN skills s ON s.id = cs.skill_id
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.created_at DESC`,
      values,
    );

    const data = rows.map((row) => ({
      id: row.id,
      title: row.title,
      provider: row.provider,
      domain: row.domain,
      category: row.category,
      level: row.level,
      duration: row.duration_hours ? `${row.duration_hours} hours` : "Self-paced",
      skillsCovered: row.covered_skills ? row.covered_skills.split("||") : [],
      rating: 4.6,
      description: row.description,
    }));

    return NextResponse.json({ data, meta: { dbConnected: true } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch courses" },
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

    if (!body.title || !body.provider || !body.domain || !body.category || !body.level) {
      return NextResponse.json(
        { error: "title, provider, domain, category and level are required." },
        { status: 400 },
      );
    }

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO courses (
         title, provider, domain, category, level, duration_hours, course_url, description
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        body.provider,
        body.domain,
        body.category,
        body.level,
        body.durationHours ?? null,
        body.courseUrl ?? null,
        body.description ?? null,
      ],
    );

    return NextResponse.json(
      { id: result.insertId, message: "Course created." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create course" },
      { status: 500 },
    );
  }
}
