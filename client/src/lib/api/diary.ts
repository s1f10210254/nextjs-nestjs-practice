import { Diary, DiaryResponse } from "@/app/(auth)/diary/types";
import apiClient from "../apiClient";

export const fetchDiaryByDate = async (
  date: string
): Promise<DiaryResponse> => {
  try {
    const res = await apiClient.get<DiaryResponse>(`/diary/${date}`);
    console.log("res", res);
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { status: number } };
    if (err.response?.status === 404) {
      throw new Error("指定された日の日記は存在しません。");
    }
    throw new Error("日記の取得に失敗しました。");
  }
};

// アドバイス再生成（POST /rag/advice/:diaryId）
export const regenerateAdviceByDiaryId = async (
  diaryId: number
): Promise<{ advice: string; diaryId: number }> => {
  const res = await apiClient.post(`/rag/advice/${diaryId}`);
  console.log("res", res);
  return res.data;
};

// 日記作成（POST /diary/:date）
export const createDiary = async (
  date: string,
  data: Partial<Diary>
): Promise<DiaryResponse> => {
  const res = await apiClient.post<DiaryResponse>(`/diary/${date}`, data);
  console.log("res", res);
  return res.data;
};

// 日記更新（PUT /diary/:date）
export const updateDiary = async (
  date: string,
  data: Partial<Diary>
): Promise<DiaryResponse> => {
  const res = await apiClient.put<DiaryResponse>(`/diary/${date}`, data);
  console.log("res", res);
  return res.data;
};
