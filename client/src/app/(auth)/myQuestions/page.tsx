import { QuestionCard } from "@/components/questions/QuestionCard";
import { QuestionForm } from "@/components/questions/QuestionForm";
import { fetchQuestions } from "@/lib/api/questions";

export default async function MyQuestionsPage() {
  const questions = await fetchQuestions(); //SSRで取得

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">あなたの質問一覧</h1>
      <QuestionForm />

      {questions.length === 0 ? (
        <p className="text-gray-500">まだ質問が投稿されていません。</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </main>
  );
}
