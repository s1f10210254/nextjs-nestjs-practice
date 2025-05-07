export type Question = {
  id: number;
  title: string;
  question_content: string;
  tags: string[];
  created_at: string;
  status: "open" | "solved" | "closed";
};
export type CreateQuestionDto = {
  title: string;
  content: string;
  tags?: string[];
  is_anonymous?: boolean;
  emotion_color?: string;
};
