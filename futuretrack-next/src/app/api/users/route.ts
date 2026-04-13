import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";

interface UserRow extends RowDataPacket {
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
}

export async function GET() {
  const db = getDbPool();

  if (!db) {
    return NextResponse.json({
      data: [],
      meta: { dbConnected: false, message: "Database is not configured." },
    });
  }

  try {
    const [rows] = await db.query<UserRow[]>(`
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.role,
        p.headline,
        p.location,
        p.education_summary,
        p.experience_years,
        p.career_interests,
        p.about
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      ORDER BY u.id DESC
    `);

    const data = rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      profile: {
        headline: row.headline,
        location: row.location,
        educationSummary: row.education_summary,
        experienceYears: row.experience_years,
        careerInterests: row.career_interests ? JSON.parse(row.career_interests) : [],
        about: row.about,
      },
    }));

    return NextResponse.json({ data, meta: { dbConnected: true } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch users" },
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

    if (!body.fullName || !body.email || !body.passwordHash) {
      return NextResponse.json(
        { error: "fullName, email and passwordHash are required." },
        { status: 400 },
      );
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [userResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO users (full_name, email, password_hash, role)
         VALUES (?, ?, ?, ?)`,
        [
          body.fullName,
          body.email,
          body.passwordHash,
          body.role ?? "student",
        ],
      );

      await connection.execute(
        `INSERT INTO profiles (
            user_id, headline, location, education_summary, experience_years, career_interests, about
         ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userResult.insertId,
          body.profile?.headline ?? null,
          body.profile?.location ?? null,
          body.profile?.educationSummary ?? null,
          body.profile?.experienceYears ?? 0,
          JSON.stringify(body.profile?.careerInterests ?? []),
          body.profile?.about ?? null,
        ],
      );

      await connection.commit();

      return NextResponse.json(
        { id: userResult.insertId, message: "User created successfully." },
        { status: 201 },
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user" },
      { status: 500 },
    );
  }
}
