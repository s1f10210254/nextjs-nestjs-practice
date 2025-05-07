"use client";

import { useState } from "react";
import { postQuestion } from "@/lib/api/questions";
import { useRouter } from "next/navigation";

const TAG_OPTIONS = [
  "仕事",
  "人間関係",
  "家族",
  "健康",
  "恋愛",
  "将来",
  "お金",
];

export const QuestionForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const router = useRouter();
  const [error, setError] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await postQuestion({
        title,
        content,
        tags: selectedTags,
        is_anonymous: true,
      });
      setTitle("");
      setContent("");
      setSelectedTags([]);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <h2 className="text-lg font-bold">質問を投稿する</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        className="w-full border px-3 py-2 rounded"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="質問の内容"
        className="w-full border px-3 py-2 rounded"
        rows={4}
        required
      />
      <div>
        <p className="text-sm font-semibold mb-1">タグを選択:</p>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded border ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        投稿する
      </button>
    </form>
  );
};
