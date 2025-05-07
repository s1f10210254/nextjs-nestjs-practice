import { Answer } from "@/types/answerType";

export const AnswerCard = ({ answer }: { answer: Answer }) => (
  <div className="border p-3 rounded mb-2">
    <p>{answer.content}</p>
    <div className="text-sm text-gray-500 mt-1">
      投稿日: {new Date(answer.created_at).toLocaleDateString()}
    </div>
  </div>
);
