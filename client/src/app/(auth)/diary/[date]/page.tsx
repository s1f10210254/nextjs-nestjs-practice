"use client";

import { useEffect, useState } from "react";
import { Diary } from "../types";
import { useParams, useRouter } from "next/navigation";
import { fetchDiaryByDate, regenerateAdviceByDiaryId } from "@/lib/api/diary";
import { Loading } from "@/components/Loading/Loading";
import Link from "next/link";

type SimplifiedDiary = {
  id: number;
  date: string;
  content: string;
  tags: string[];
};
export default function DiaryPage() {
  const { date } = useParams();
  const router = useRouter();
  const [diary, setDiary] = useState<Diary | null>(null);
  const [similarDiaries, setSimilarDiaries] = useState<SimplifiedDiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("date", date);
    if (!date || typeof date !== "string") return;
    setLoading(true);

    fetchDiaryByDate(date)
      .then((data) => {
        setDiary(data.diary);
        setSimilarDiaries(data.similarDiaries);
      })
      .catch(() => {
        setDiary(null);
      })
      .finally(() => setLoading(false));
  }, [date]);

  //アドバイスの再生性
  const handlePostAdvice = () => {
    if (!diary) return;
    setLoading(true);
    regenerateAdviceByDiaryId(diary?.id)
      .then((data) => {
        setDiary((prev) => {
          if (!prev) return null;
          return { ...prev, ai_advice_content: data.advice };
        });
      })
      .catch((error) => {
        console.error("Error regenerating advice:", error);
      })
      .finally(() => setLoading(false));
  };

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
            <strong>色:</strong> {diary.color || "未設定"}
          </p>
          <div>
            <div>
              <strong>アドバイス:</strong>
              <button
                onClick={handlePostAdvice}
                className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded"
              >
                再生成
              </button>
            </div>
            <strong>AIアドバイス:</strong> {diary.ai_advice_content || "なし"}
            <div>
              {similarDiaries.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h2 className="font-bold text-lg mb-2">
                    参考にされた過去の日記
                  </h2>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {similarDiaries.map((d) => (
                      <li key={d.id} className="border p-2 rounded bg-gray-50">
                        <Link
                          href={`/diary/${d.date}`}
                          className="block hover:underline"
                        >
                          <div className="text-xs text-gray-500">
                            日付: {d.date}
                          </div>
                          <div>{d.content}</div>
                          <div className="text-xs mt-1">
                            タグ: {d.tags?.join(", ") || "なし"}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
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
