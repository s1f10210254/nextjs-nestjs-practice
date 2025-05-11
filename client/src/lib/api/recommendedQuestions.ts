import { Question } from "@/types/questionType";

// おすすめ質問取得（GET /questions/recommend）
export const fetchRecommendedQuestions = async (): Promise<Question[]> => {
  const res = await fetch(`http://localhost:8000/questions/recommend`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Recommended API Error:", text);
    throw new Error("おすすめ質問の取得に失敗しました");
  }

  return res.json();
};

// おすすめ質問の再生成
export const regenerateRecommendedQuestions = async (): Promise<void> => {
  const res = await fetch(
    `http://localhost:8000/questions/recommend/regenerate`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Regenerate API Error:", text);
    throw new Error("おすすめ質問の再生成に失敗しました");
  }
};
