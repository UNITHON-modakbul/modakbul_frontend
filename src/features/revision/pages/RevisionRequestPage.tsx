import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Braces,
  Check,
  CheckCircle2,
  LayoutDashboard,
  LoaderCircle,
  MessageSquareText,
  PencilRuler,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../../../components/ui/Button.tsx";
import { Input } from "../../../components/ui/Input.tsx";
import { Textarea } from "../../../components/ui/Textarea.tsx";
import { cn } from "../../../utils/cn.ts";
import { QuestionCard } from "../../requirements/components/QuestionCard.tsx";
import type {
  RequirementAnswer,
  RequirementQuestion,
} from "../../requirements/types.ts";
import { isRequirementAnswered } from "../../requirements/utils/answer.ts";
import {
  useSubmitRevisionAnswers,
  useValidateRevision,
} from "../hooks/useRevisionMutations.ts";
import type { RevisionValidationResult } from "../types.ts";

type RevisionPhase = "form" | "questions" | "complete";

const validationSteps = [
  "수정 대상과 요청 의도를 파악하고 있어요.",
  "기존 기획과 충돌하는 부분을 확인하고 있어요.",
  "구현 전에 필요한 후속 질문을 만들고 있어요.",
];

function RevisionValidationWaiting() {
  return (
    <section className="grid min-h-0 flex-1 place-items-center py-6">
      <div className="w-full max-w-2xl rounded-[30px] border border-[#17332f]/15 bg-white/92 p-7 text-center shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#17332f] text-white shadow-[5px_5px_0_#d9ef7d]">
          <Bot aria-hidden="true" size={30} />
        </span>
        <p className="mt-7 text-xs font-black tracking-[0.14em] text-[#ec6b42]">
          AI REVISION REVIEW
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
          수정 방향을 검토하고 있어요.
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#17332f]/55">
          바로 수정하기 전에 기존 서비스와 요청 내용을 비교해 빠진 결정이 없는지
          확인합니다.
        </p>

        <div className="mt-8 grid gap-2 text-left sm:grid-cols-3">
          {validationSteps.map((step, index) => (
            <div
              className="flex min-h-24 flex-col justify-between rounded-2xl border border-[#17332f]/10 bg-[#f3f0e7]/70 p-4"
              key={step}
            >
              <span className="grid size-7 place-items-center rounded-full bg-[#ec6b42] font-mono text-[10px] font-black text-white">
                {index + 1}
              </span>
              <p className="mt-3 text-xs font-bold leading-5 text-[#17332f]/65">
                {step}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#5f8a39]">
          <LoaderCircle aria-hidden="true" className="animate-spin" size={15} />
          AI가 수정 범위를 검증하는 중
        </p>
      </div>
    </section>
  );
}

interface RevisionQuestionFlowProps {
  answers: Record<string, RequirementAnswer>;
  index: number;
  isSubmitting: boolean;
  onAnswer: (questionId: string, answer: RequirementAnswer) => void;
  onBack: () => void;
  onNext: () => void;
  questions: RequirementQuestion[];
  summary: string;
}

function RevisionQuestionFlow({
  answers,
  index,
  isSubmitting,
  onAnswer,
  onBack,
  onNext,
  questions,
  summary,
}: RevisionQuestionFlowProps) {
  const question = questions[index];
  const isAnswered = isRequirementAnswered(question, answers[question.id]);
  const isFirst = index === 0;
  const isLast = index === questions.length - 1;

  return (
    <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col py-4">
      <div className="flex shrink-0 items-center justify-between gap-4 pb-3">
        <div className="min-w-0">
          <p className="text-xs font-black text-[#5f8a39]">AI 검증 완료</p>
          <p className="truncate text-xs text-[#17332f]/48">{summary}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {questions.map((item, itemIndex) => {
            const isDone = isRequirementAnswered(item, answers[item.id]);

            return (
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full border text-[11px] font-black transition",
                  itemIndex === index
                    ? "border-[#17332f] bg-[#17332f] text-white"
                    : isDone
                      ? "border-[#b6cf5b] bg-[#e9f2cc] text-[#375226]"
                      : "border-[#17332f]/12 bg-white/65 text-[#17332f]/35",
                )}
                key={item.id}
              >
                {isDone && itemIndex !== index ? (
                  <Check aria-hidden="true" size={14} strokeWidth={3} />
                ) : (
                  itemIndex + 1
                )}
              </span>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 pb-3">
        <div
          aria-hidden="true"
          className="absolute inset-x-6 bottom-0 top-4 rotate-[0.6deg] rounded-[30px] border border-[#17332f]/12 bg-[#d9ef7d]/55"
        />
        <div className="relative h-full" key={question.id}>
          <QuestionCard
            answer={answers[question.id]}
            number={index + 1}
            onChange={(answer) => onAnswer(question.id, answer)}
            question={question}
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#17332f]/10 pt-3">
        <p className="hidden text-xs font-bold text-[#17332f]/42 sm:block">
          후속 질문 {index + 1} / {questions.length}
        </p>
        <div className="ml-auto grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">
          <Button
            disabled={isFirst || isSubmitting}
            onClick={onBack}
            type="button"
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            이전 질문
          </Button>
          <Button
            disabled={!isAnswered || isSubmitting}
            onClick={onNext}
            type="button"
          >
            {isSubmitting ? (
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin"
                size={17}
              />
            ) : isLast ? (
              <Send aria-hidden="true" size={17} />
            ) : null}
            {isSubmitting
              ? "답변 전달 중"
              : isLast
                ? "수정 요청 확정"
                : "다음 질문"}
            {!isLast && !isSubmitting && (
              <ArrowRight aria-hidden="true" size={17} />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function RevisionRequestPage() {
  const navigate = useNavigate();
  const { projectId = "mvpilot-pipeline" } = useParams();
  const [phase, setPhase] = useState<RevisionPhase>("form");
  const [target, setTarget] = useState("");
  const [requestedChange, setRequestedChange] = useState("");
  const [revision, setRevision] = useState<RevisionValidationResult>();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, RequirementAnswer>>({});
  const validateRevision = useValidateRevision();
  const submitAnswers = useSubmitRevisionAnswers();
  const previewPath = `/projects/${projectId}/preview`;
  const canSubmit =
    target.trim().length >= 2 && requestedChange.trim().length >= 10;

  const handleValidate = async () => {
    if (!canSubmit) return;

    try {
      const result = await validateRevision.mutateAsync({
        requestedChange: requestedChange.trim(),
        target: target.trim(),
      });
      setRevision(result);
      setActiveQuestionIndex(0);
      setPhase("questions");
    } catch {
      // 오류 상태는 입력 폼 하단에 표시합니다.
    }
  };

  const handleNextQuestion = async () => {
    if (!revision) return;
    const activeQuestion = revision.questions[activeQuestionIndex];
    if (!isRequirementAnswered(activeQuestion, answers[activeQuestion.id]))
      return;

    if (activeQuestionIndex < revision.questions.length - 1) {
      setActiveQuestionIndex((current) => current + 1);
      return;
    }

    try {
      await submitAnswers.mutateAsync({ answers });
      setPhase("complete");
    } catch {
      // 오류 상태는 질문 화면의 버튼 상태로 유지하고 다시 시도할 수 있습니다.
    }
  };

  return (
    <div className="demo-grid relative h-dvh overflow-hidden bg-[#f3f0e7] text-[#17332f]">
      <div className="pointer-events-none absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-[#d9ef7d]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#ff9b75]/30 blur-3xl" />

      <header className="relative z-20 h-16 border-b border-[#17332f]/10 bg-[#f3f0e7]/80 backdrop-blur sm:h-[72px]">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
          <Link
            className="flex shrink-0 items-center gap-3"
            to="/"
            aria-label="mvpilot 홈"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#17332f] text-[#fffaf1] shadow-[3px_3px_0_#ec6b42] sm:size-10">
              <Braces aria-hidden="true" size={20} strokeWidth={2.4} />
            </span>
            <span className="hidden text-lg font-black tracking-[-0.04em] sm:block">
              mvpilot
            </span>
          </Link>

          <div className="min-w-0 text-center">
            <p className="font-mono text-[10px] font-black tracking-[0.14em] text-[#ec6b42]">
              AI REVISION FLOW
            </p>
            <p className="truncate text-xs font-extrabold text-[#17332f]/60 sm:text-sm">
              수정 요청 검증 및 후속 질문
            </p>
          </div>

          <Link
            className="flex shrink-0 items-center gap-2 rounded-full border border-[#17332f]/12 bg-white/55 px-3 py-2 text-[11px] font-bold text-[#17332f]/65 transition hover:bg-white"
            to="/"
          >
            <LayoutDashboard aria-hidden="true" size={14} />
            <span className="hidden sm:inline">프로젝트</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-7xl px-4 pb-4 sm:h-[calc(100dvh-72px)] sm:px-8 sm:pb-6 lg:px-10">
        {validateRevision.isPending ? (
          <RevisionValidationWaiting />
        ) : phase === "questions" && revision ? (
          <RevisionQuestionFlow
            answers={answers}
            index={activeQuestionIndex}
            isSubmitting={submitAnswers.isPending}
            onAnswer={(questionId, answer) =>
              setAnswers((current) => ({ ...current, [questionId]: answer }))
            }
            onBack={() =>
              setActiveQuestionIndex((current) => Math.max(0, current - 1))
            }
            onNext={handleNextQuestion}
            questions={revision.questions}
            summary={revision.summary}
          />
        ) : phase === "complete" ? (
          <section className="grid min-h-0 flex-1 place-items-center py-6">
            <div className="w-full max-w-2xl rounded-[30px] border border-[#17332f]/15 bg-white/92 p-8 text-center shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-11">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#17332f] text-white shadow-[5px_5px_0_#d9ef7d]">
                <Sparkles aria-hidden="true" size={29} />
              </span>
              <p className="mt-7 text-xs font-black tracking-[0.14em] text-[#5f8a39]">
                REVISION READY
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                수정 방향이 확정됐어요.
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#17332f]/55">
                입력한 요청과 후속 답변을 AI 개발 작업으로 전달했습니다. 수정이
                완료되면 새로운 미리보기를 확인할 수 있어요.
              </p>
              <div className="mx-auto mt-7 flex max-w-md flex-col-reverse gap-3 sm:flex-row">
                <Button
                  className="flex-1"
                  onClick={() => navigate("/")}
                  type="button"
                  variant="outline"
                >
                  <LayoutDashboard aria-hidden="true" size={16} />
                  대시보드
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => navigate(previewPath)}
                  type="button"
                >
                  미리보기로 돌아가기
                  <ArrowRight aria-hidden="true" size={16} />
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <section className="grid min-h-0 flex-1 items-center gap-5 py-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="hidden px-4 lg:block">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#17332f] text-white shadow-[4px_4px_0_#d9ef7d]">
                <PencilRuler aria-hidden="true" size={26} />
              </span>
              <p className="mt-6 text-xs font-black tracking-[0.14em] text-[#ec6b42]">
                REQUEST A REVISION
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-0.055em]">
                어디를 어떻게
                <br />
                바꾸고 싶나요?
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#17332f]/55">
                AI가 현재 결과와 수정 요청을 비교한 뒤, 모호하거나 충돌하는
                부분만 후속 질문으로 확인해요.
              </p>
              <div className="mt-6 space-y-3">
                {["수정 대상 지정", "AI 방향 검증", "후속 질문 후 재개발"].map(
                  (item, index) => (
                    <p
                      className="flex items-center gap-3 text-xs font-bold text-[#375226]"
                      key={item}
                    >
                      <span className="grid size-6 place-items-center rounded-full bg-[#e9f2cc] font-mono text-[10px] font-black">
                        {index + 1}
                      </span>
                      {item}
                    </p>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-[30px] border border-[#17332f]/15 bg-white/92 p-6 shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-8">
              <div className="flex items-center gap-3 border-b border-[#17332f]/10 pb-5">
                <span className="grid size-11 place-items-center rounded-xl bg-[#e9f2cc] text-[#375226]">
                  <MessageSquareText aria-hidden="true" size={21} />
                </span>
                <div>
                  <h2 className="text-lg font-black tracking-[-0.035em]">
                    수정 요청 작성
                  </h2>
                  <p className="text-xs text-[#17332f]/45">
                    기능 변경이 아니라 원하는 결과를 자연어로 알려주세요.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-black" htmlFor="revision-target">
                  수정할 화면 또는 영역
                </label>
                <Input
                  className="mt-2"
                  id="revision-target"
                  maxLength={80}
                  onChange={(event) => setTarget(event.target.value)}
                  placeholder="예) 홈 화면의 메인 배너와 시작하기 버튼"
                  value={target}
                />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    className="text-sm font-black"
                    htmlFor="revision-request"
                  >
                    원하는 수정 방향
                  </label>
                  <span className="font-mono text-[10px] text-[#17332f]/35">
                    {requestedChange.length}/500
                  </span>
                </div>
                <Textarea
                  className="mt-2 h-36"
                  id="revision-request"
                  maxLength={500}
                  onChange={(event) => setRequestedChange(event.target.value)}
                  placeholder="예) 메인 문구를 더 짧고 강하게 바꾸고, 시작하기 버튼이 첫 화면에서 더 눈에 띄었으면 좋겠어요."
                  value={requestedChange}
                />
              </div>

              {validateRevision.isError && (
                <p
                  className="mt-3 text-xs font-bold text-[#b94727]"
                  role="alert"
                >
                  수정 방향 검증에 실패했어요. 잠시 후 다시 시도해주세요.
                </p>
              )}

              <div className="mt-6 grid grid-cols-[auto_1fr] gap-3">
                <Button
                  onClick={() => navigate(previewPath)}
                  type="button"
                  variant="outline"
                >
                  <ArrowLeft aria-hidden="true" size={17} />
                  미리보기
                </Button>
                <Button
                  disabled={!canSubmit}
                  onClick={handleValidate}
                  type="button"
                >
                  <Bot aria-hidden="true" size={17} />
                  AI에게 수정 방향 검증받기
                  <ArrowRight aria-hidden="true" size={17} />
                </Button>
              </div>

              <p className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#17332f]/38">
                <CheckCircle2 aria-hidden="true" size={13} />
                검증이 끝나면 필요한 후속 질문만 이어서 보여드려요.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
