import { AnswerCard } from "@/components/answers/AnswerCard";
import { AnswerForm } from "@/components/answers/AnswerForm";
import { QuestionDetail } from "@/components/questions/QuestionDetail";
import { fetchAnswers } from "@/lib/api/answers";
import { fetchQuestionById } from "@/lib/api/questions";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};
export default async function QuestionDetailPage({ params }: Props) {
  const id = Number(params.id);

  try {
    const question = await fetchQuestionById(id);
    const answers = await fetchAnswers(id);
    return (
      <main className="p-6 space-y-8">
        <QuestionDetail question={question} />

        <section>
          <h2 className="text-lg font-bold mb-2">回答</h2>
          {answers.length === 0 ? (
            <p className="text-gray-500">まだ回答がありません</p>
          ) : (
            answers.map((ans) => <AnswerCard key={ans.id} answer={ans} />)
          )}
        </section>

        <AnswerForm questionId={id} />
      </main>
    );
  } catch (err) {
    console.error(err);
    return notFound();
  }
}
