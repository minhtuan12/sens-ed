import { NextResponse } from "next/server";

import { findUserByCredentials } from "@/lib/repositories";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const user = await findUserByCredentials(body.username ?? "", body.password ?? "");

  if (!user) {
    return NextResponse.json({ message: "Invalid learner name or password." }, { status: 401 });
  }

  return NextResponse.json({
    userId: user.id,
    username: user.username,
    displayName: user.displayName
  });
}
