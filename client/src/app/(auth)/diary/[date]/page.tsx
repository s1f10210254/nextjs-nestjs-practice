"use client";

import { useEffect, useState } from "react";
import { Diary } from "../types";
import { useParams, useRouter } from "next/navigation";
import { fetchDiaryByDate } from "@/lib/api/diary";
import { Loading } from "@/components/Loading/Loading";

export default function DiaryPage() {
  const { date } = useParams();
  const router = useRouter();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date || typeof date !== "string") return;
    setLoading(true);

    fetchDiaryByDate(date)
      .then((data) => {
        setDiary(data);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [date]);

  if (loading) return <Loading visible={loading}></Loading>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{date} の日記</h1>

      {diary ? (
        <div className="space-y-4">
          <p>
            <strong>内容:</strong> {diary.recorded_content}
          </p>
          <p>
            <strong>タグ:</strong> {diary.tags || "なし"}
          </p>
          <p>
            <strong>感情:</strong> {diary.mood_color || "未設定"}
          </p>
          <button
            onClick={() => router.push(`/diary/${date}/edit`)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            編集する
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p>まだ日記が投稿されていません。</p>
          <button
            onClick={() => router.push(`/diary/${date}/edit`)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            新しく投稿する
          </button>
        </div>
      )}
    </div>
  );
}
