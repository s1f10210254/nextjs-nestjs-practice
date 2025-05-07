"use client";

import { useState } from "react";
import { postAnswer } from "@/lib/api/answers";
import { useRouter } from "next/navigation";

export const AnswerForm = ({ questionId }: { questionId: number }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await postAnswer(questionId, content);
      setContent("");
      router.refresh(); // 再読み込みして回答一覧に反映
    } catch {
      setError("回答の投稿に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <h3 className="font-bold text-lg">回答を投稿する</h3>
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="あなたの経験やアドバイスを共有しましょう"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
};
