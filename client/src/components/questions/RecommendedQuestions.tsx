"use client";

import { useEffect, useState } from "react";
import {
  fetchRecommendedQuestions,
  regenerateRecommendedQuestions,
} from "@/lib/api/recommendedQuestions";
import { Question } from "@/types/questionType";
import { QuestionCard } from "./QuestionCard";

export const RecommendedQuestions = () => {
  const [recommended, setRecommended] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecommended = async () => {
    setError("");
    try {
      const data = await fetchRecommendedQuestions();
      setRecommended(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const regenerate = async () => {
    setLoading(true);
    try {
      await regenerateRecommendedQuestions();
      await fetchRecommended();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommended();
  }, []);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">あなたへのおすすめ</h2>
        <button
          onClick={regenerate}
          disabled={loading}
          className="text-sm text-blue-600 underline disabled:text-gray-400"
        >
          {loading ? "再生成中..." : "おすすめを再生成"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {recommended.length === 0 && <p>おすすめの質問はまだありません。</p>}

      <div className="space-y-4">
        {recommended.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
};
