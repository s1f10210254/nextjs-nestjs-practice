import { Diary } from "./types";

const API_BASE = "http://localhost:8000";

export const fetchUserDiaries = async (userId: number): Promise<Diary[]> => {
  const res = await fetch(`${API_BASE}/diary/user/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch diaries");
  return res.json();
};

export const createDiary = async (data: Partial<Diary>): Promise<Diary> => {
  const res = await fetch(`${API_BASE}/diary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("API error:", res.status, text);
    throw new Error("API error: " + res.status);
  }
  return res.json();
};

export const deleteDiary = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/diary/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("API error: " + res.status);
};
