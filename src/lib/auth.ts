import { createHash } from "node:crypto";

import type { AuthSession, UserAccount } from "@/types/sensed";

const seedPassword = "learn123";

export const seedUsers: UserAccount[] = [
  {
    id: "learner-anna",
    username: "anna",
    displayName: "Anna",
    role: "learner",
    passwordHash: hashPassword(seedPassword)
  },
  {
    id: "learner-minh",
    username: "minh",
    displayName: "Minh",
    role: "learner",
    passwordHash: hashPassword(seedPassword)
  }
];

export function hashPassword(password: string) {
  return createHash("sha256").update(`sensed:${password}`).digest("hex");
}

export function validateSeedLogin(username: string, password: string): AuthSession | null {
  const normalized = username.trim().toLowerCase();
  const user = seedUsers.find((item) => item.username === normalized);

  if (!user || user.passwordHash !== hashPassword(password)) {
    return null;
  }

  return {
    userId: user.id,
    username: user.username,
    displayName: user.displayName
  };
}
