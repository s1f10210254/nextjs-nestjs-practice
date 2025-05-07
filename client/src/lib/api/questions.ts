import { CreateQuestionDto, Question } from "@/types/questionType";

export const fetchQuestions = async (tag?: string): Promise<Question[]> => {
  const query = tag ? `?tag=${encodeURIComponent(tag)}` : "";
  const res = await fetch(`http://localhost:8000/questions${query}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("API Error Response:", text);
    throw new Error("Failed to fetch questions");
  }
  return res.json();
};

export const fetchQuestionById = async (id: number): Promise<Question> => {
  const res = await fetch(`http://localhost:8000/questions/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("API Error Response:", text);
    throw new Error("Failed to fetch question");
  }
  return res.json();
};

export const fetchMyQuestions = async (): Promise<Question[]> => {
  const res = await fetch(`http://localhost:8000/questions/mine`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("API Error Response:", text);
    throw new Error("自分の質問の取得に失敗しました");
  }
  return res.json();
};

export const postQuestion = async (data: CreateQuestionDto): Promise<void> => {
  const res = await fetch("http://localhost:8000/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.text();
    console.error("API Error Response:", error);
    throw new Error("質問の投稿に失敗しました");
  }
};
