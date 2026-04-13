import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDbPool } from "@/lib/db";

export const runtime = "nodejs";

interface RecommendationRow extends RowDataPacket {
  id: number;
  user_id: number;
  recommendation_type: "job" | "course" | "tip";
  reference_id: number | null;
  title: string;
  reason: string | null;
  score: number | null;
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
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");

    const conditions: string[] = [];
    const values: Array<number | string> = [];

    if (userId) {
      conditions.push("user_id = ?");
      values.push(Number(userId));
    }

    if (type) {
      conditions.push("recommendation_type = ?");
      values.push(type);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.query<RecommendationRow[]>(
      `SELECT id, user_id, recommendation_type, reference_id, title, reason, score
       FROM recommendations
       ${whereClause}
       ORDER BY created_at DESC`,
      values,
    );

    const data = rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      type: row.recommendation_type,
      referenceId: row.reference_id,
      title: row.title,
      reason: row.reason,
      score: row.score,
    }));

    return NextResponse.json({ data, meta: { dbConnected: true } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch recommendations" },
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

    if (!body.userId || !body.type || !body.title) {
      return NextResponse.json(
        { error: "userId, type and title are required." },
        { status: 400 },
      );
    }

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO recommendations (
         user_id, recommendation_type, reference_id, title, reason, score
       ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        body.userId,
        body.type,
        body.referenceId ?? null,
        body.title,
        body.reason ?? null,
        body.score ?? null,
      ],
    );

    return NextResponse.json(
      { id: result.insertId, message: "Recommendation created." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create recommendation" },
      { status: 500 },
    );
  }
}
