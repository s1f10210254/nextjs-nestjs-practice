export interface Diary {
  id: number;
  user_id: number;
  date: string;
  weather: string | null;
  color: "red" | "orange" | "yellow" | "green" | "blue";
  recorded_content: string;
  ai_advice_content?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export const TAG_OPTIONS = ["仕事", "勉強", "将来", "恋愛", "友人", "家族"];
export const COLOR_OPTIONS = ["red", "orange", "yellow", "green", "blue"];
