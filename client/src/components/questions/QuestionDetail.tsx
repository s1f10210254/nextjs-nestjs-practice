import { Question } from "@/types/questionType";

export const QuestionDetail = ({ question }: { question: Question }) => (
  <div className="border p-4 rounded shadow">
    <h1 className="text-2xl font-bold">{question.title}</h1>
    <p className="mt-2">{question.question_content}</p>
    <div className="text-sm text-gray-600 mt-2">
      {question.tags.join(", ")} ・{" "}
      {new Date(question.created_at).toLocaleDateString()}
    </div>
    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block mt-2">
      {question.status}
    </span>
  </div>
);
