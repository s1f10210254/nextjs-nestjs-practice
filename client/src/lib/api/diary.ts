import { Diary } from "@/app/(auth)/diary/types";
import apiClient from "../apiClient";

export const fetchDiaryByDate = async (date: string): Promise<Diary | null> => {
  try {
    const res = await apiClient.get(`/diary/${date}`);
    return res.data;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error as { response?: { status: number } }).response?.status === 404
    ) {
      throw error;
    }
    return null;
  }
};

export const createDiary = async (
  date: string,
  data: Partial<Diary>
): Promise<Diary> => {
  const res = await apiClient.post(`/diary/${date}`, data);
  return res.data;
};

export const updateDiary = async (
  date: string,
  data: Partial<Diary>
): Promise<Diary> => {
  const res = await apiClient.put(`/diary/${date}`, data);
  return res.data;
};
