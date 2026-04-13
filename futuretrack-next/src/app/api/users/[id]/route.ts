import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";

interface UserDetailRow extends RowDataPacket {
  id: number;
  full_name: string;
  email: string;
  role: string;
  headline: string | null;
  location: string | null;
  education_summary: string | null;
  experience_years: number | null;
  career_interests: string | null;
  about: string | null;
  skill_names: string | null;
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
    const [rows] = await db.query<UserDetailRow[]>(
      `SELECT
        u.id,
        u.full_name,
        u.email,
        u.role,
        p.headline,
        p.location,
        p.education_summary,
        p.experience_years,
        p.career_interests,
        p.about,
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR '||') AS skill_names
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      LEFT JOIN profile_skills ps ON ps.profile_id = p.id
      LEFT JOIN skills s ON s.id = ps.skill_id
      WHERE u.id = ?
      GROUP BY u.id, p.id
      LIMIT 1`,
      [id],
    );

    if (!rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const row = rows[0];

    return NextResponse.json({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      location: row.location,
      education: row.education_summary,
      experienceYears: Number(row.experience_years ?? 0),
      careerInterests: row.career_interests ? JSON.parse(row.career_interests) : [],
      skills: row.skill_names ? row.skill_names.split("||") : [],
      bio: row.about ?? "",
      title: row.headline ?? "",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch user" },
      { status: 500 },
    );
  }
}
