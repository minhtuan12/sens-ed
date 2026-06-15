import { notFound } from "next/navigation";

import { LessonPlayer } from "@/components/lessons/LessonPlayer";
import { getLessonById } from "@/lib/repositories";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = await getLessonById(lessonId);

  if (!lesson) {
    notFound();
  }

  return <LessonPlayer lesson={lesson} />;
}
