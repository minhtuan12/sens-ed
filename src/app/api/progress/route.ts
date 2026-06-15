import { NextResponse } from "next/server";

import { markProgress } from "@/lib/repositories";

export async function POST(request: Request) {
  const body = (await request.json()) as { userId?: string; lessonId?: string; stepId?: string };

  if (!body.userId || !body.lessonId || !body.stepId) {
    return NextResponse.json({ message: "Missing progress fields." }, { status: 400 });
  }

  const progress = await markProgress(body.userId, body.lessonId, body.stepId);
  return NextResponse.json(progress);
}
