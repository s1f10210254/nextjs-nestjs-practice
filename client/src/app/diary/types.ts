export interface Diary {
  user_id: number;
  date: string;
  weather: string | null;
  mood_color: string | null;
  recorded_content: string;
  ai_advice_content?: string;
  created_at: string;
  updated_at: string;
}
