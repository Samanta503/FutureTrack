import { NextResponse } from "next/server";
import { checkDbConnection } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const dbStatus = await checkDbConnection();

  return NextResponse.json({
    app: "futuretrack-next",
    status: "ok",
    db: dbStatus,
    timestamp: new Date().toISOString(),
  });
}
