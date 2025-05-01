"use client";

import { useEffect, useState } from "react";
import { fetchUserDiaries } from "./actions";
import { Diary } from "./types";

export default function DiaryPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const userId = 1; // 仮ユーザー（本来はセッションなどから取得）

  //Postできるようにする
  const handlePostData = async () => {
    const newDiary: Diary = {
      user_id: userId,
      date: new Date().toISOString().split("T")[0], // 今日の日付
      weather: "晴れ",
      mood_color: "青",
      recorded_content: "今日はいい天気でした。",
      ai_advice_content: "もっと外に出て運動しましょう。",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:8000/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDiary),
      });

      if (!response.ok) {
        throw new Error("Failed to create diary");
      }

      const data = await response.json();
      console.log("Diary created:", data);
    } catch (error) {
      console.error("Error creating diary:", error);
    }
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const data = await fetchUserDiaries(userId);
        setDiaries(data);
      } catch (error) {
        console.error("Error fetching diaries:", error);
      }
    };

    fetchDiaries();
  }, [diaries]);

  return (
    <div>
      <h1>Diary Page</h1>
      <pre>{JSON.stringify(diaries, null, 2)}</pre>
      <div>
        <button
          onClick={handlePostData}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Create Diary
        </button>
      </div>
    </div>
  );
}
