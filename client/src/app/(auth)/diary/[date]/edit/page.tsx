"use client";

import { Loading } from "@/components/Loading/Loading";
import { createDiary, fetchDiaryByDate, updateDiary } from "@/lib/api/diary";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { COLOR_OPTIONS, TAG_OPTIONS } from "../../types";

type ColorType = "red" | "orange" | "yellow" | "green" | "blue";

export default function DiaryEditPage() {
  const { date } = useParams();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [color, setColor] = useState<ColorType>("red");
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date || typeof date !== "string") return;

    fetchDiaryByDate(date)
      .then(({ diary }) => {
        setIsNew(false);
        setContent(diary.recorded_content || "");
        setSelectedTags(diary.tags || []);
        setColor(diary.color || "red");
      })
      .catch((err) => {
        console.error("取得失敗", err);
        setError("日記の取得に失敗しました");
      });
  }, [date]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("内容を入力してください");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        recorded_content: content,
        tags: selectedTags,
        color: color,
      };

      if (isNew) {
        await createDiary(date as string, payload);
      } else {
        await updateDiary(date as string, payload);
      }

      router.push(`/diary/${date}`);
    } catch (err) {
      console.error("送信失敗", err);
      setError("日記の保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">
        {date} の日記を{isNew ? "新規作成" : "編集"}
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <textarea
        className="w-full border rounded p-2"
        rows={8}
        placeholder="今日の出来事や気持ちを書いてみましょう"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="space-y-2">
        <p className="font-semibold">タグを選択：</p>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <label key={tag} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-semibold">感情の色を選択：</p>
        <div className="flex gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c as ColorType)}
              className={`w-8 h-8 rounded-full border-2 ${
                color === c ? "ring-2 ring-black" : ""
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">選択中の色: {color}</p>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        保存する
      </button>

      <Loading visible={loading} />
    </div>
  );
}
