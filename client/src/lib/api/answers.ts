import { Answer } from "@/types/answerType";

export const fetchAnswers = async (questionId: number): Promise<Answer[]> => {
  const res = await fetch(
    `http://localhost:8000/answers?questionId=${questionId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ /answers fetch failed:", res.status, errorText);
    throw new Error("回答の取得に失敗しました");
  }

  return res.json();
};

export const postAnswer = async (
  questionId: number,
  content: string
): Promise<void> => {
  const res = await fetch("http://localhost:8000/answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      questionId,
      content, // ← ✅ これが "content" であるか、値が空でないかを確認
      is_anonymous: true,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to post answer: ${error}`);
  }
};
