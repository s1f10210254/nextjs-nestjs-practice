import { QuestionCard } from "@/components/questions/QuestionCard";
import { fetchQuestions } from "@/lib/api/questions";

export default async function QuestionsPage() {
  const questions = await fetchQuestions(); //SSRで取得

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">みんなの質問</h1>
      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
    </main>
  );
}
