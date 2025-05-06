"use client";
import { Loading } from "@/components/Loading/Loading";
import { createDiary, fetchDiaryByDate, updateDiary } from "@/lib/api/diary";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DiaryEditPage() {
  const { date } = useParams();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [moodColor, setMoodColor] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date || typeof date !== "string") return;

    fetchDiaryByDate(date)
      .then((data) => {
        if (data) {
          setIsNew(false);
          setContent(data.recorded_content);
          setTags(data.tags || "");
          setMoodColor(data.mood_color || "");
        }
      })
      .catch((err) => {
        console.error("取得失敗", err);
        setError("日記の取得に失敗しました");
      });
  }, [date]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("内容を入力してください");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        recorded_content: content,
        tags,
        moodColor: moodColor,
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

      <input
        type="text"
        className="w-full border rounded p-2"
        placeholder="タグ（カンマ区切り）"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <input
        type="text"
        className="w-full border rounded p-2"
        placeholder="感情の色（例: red, blue, green）"
        value={moodColor}
        onChange={(e) => setMoodColor(e.target.value)}
      />

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
