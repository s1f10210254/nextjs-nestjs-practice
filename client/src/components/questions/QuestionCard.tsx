import { Question } from "@/types/questionType";
import Link from "next/link";

export const QuestionCard = ({ question }: { question: Question }) => {
  return (
    <Link href={`/questions/${question.id}`}>
      <div className="border p-4 rounded hover:bg-gray-50">
        <h2 className="font-semibold">{question.title}</h2>
        <div className="text-sm text-gray-500">
          {question.tags.join(", ")} |{" "}
          {new Date(question.created_at).toLocaleDateString()}
        </div>
        <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
          {question.status.toUpperCase()}
        </span>
      </div>
    </Link>
  );
};
