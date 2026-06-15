import type { Collection } from "mongodb";

import { hashPassword, seedUsers } from "@/lib/auth";
import { getMongoDb, hasMongoConfig } from "@/lib/mongodb";
import { defaultSettings } from "@/lib/settings";
import { lessons } from "@/seed/lessons";
import type { LearnerSettings, Lesson, ProgressRecord, UserAccount } from "@/types/sensed";

async function collection<T extends object>(name: string): Promise<Collection<T>> {
  return (await getMongoDb()).collection<T>(name);
}

export async function findUserByCredentials(username: string, password: string) {
  const normalized = username.trim().toLowerCase();
  const passwordHash = hashPassword(password);

  if (hasMongoConfig()) {
    const users = await collection<UserAccount>("users");
    const user = await users.findOne({ username: normalized, passwordHash });
    return user;
  }

  return seedUsers.find((user) => user.username === normalized && user.passwordHash === passwordHash) ?? null;
}

export async function getLessons(): Promise<Lesson[]> {
  if (hasMongoConfig()) {
    const storedLessons = await collection<Lesson>("lessons");
    const result = await storedLessons.find({}).sort({ number: 1 }).toArray();
    return result.length > 0 ? result : lessons;
  }

  return lessons;
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  const allLessons = await getLessons();
  return allLessons.find((lesson) => lesson.id === lessonId) ?? null;
}

export async function getSettings(userId: string): Promise<LearnerSettings> {
  if (hasMongoConfig()) {
    const settings = await collection<LearnerSettings & { userId: string }>("settings");
    return (await settings.findOne({ userId })) ?? defaultSettings;
  }

  return defaultSettings;
}

export async function saveSettings(userId: string, settingsValue: LearnerSettings) {
  if (!hasMongoConfig()) {
    return settingsValue;
  }

  const settings = await collection<LearnerSettings & { userId: string }>("settings");
  await settings.updateOne({ userId }, { $set: { ...settingsValue, userId } }, { upsert: true });
  return settingsValue;
}

export async function markProgress(userId: string, lessonId: string, stepId: string): Promise<ProgressRecord> {
  const updatedAt = new Date().toISOString();

  if (hasMongoConfig()) {
    const progress = await collection<ProgressRecord>("progress");
    await progress.updateOne(
      { userId, lessonId },
      {
        $addToSet: { completedStepIds: stepId },
        $inc: { attempts: 1 },
        $set: { updatedAt }
      },
      { upsert: true }
    );

    const stored = await progress.findOne({ userId, lessonId });
    if (stored) {
      return stored;
    }
  }

  return {
    userId,
    lessonId,
    completedStepIds: [stepId],
    attempts: 1,
    updatedAt
  };
}
