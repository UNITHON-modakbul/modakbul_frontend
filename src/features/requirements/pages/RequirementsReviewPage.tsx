import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  CircleAlert,
  HelpCircle,
  PencilLine,
  UsersRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import { Button } from '../../../components/ui/Button.tsx'
import type { WorkspaceContext } from '../../../routes/workspaceContext.ts'
import { QuestionCard } from '../components/QuestionCard.tsx'
import { mockRequirementQuestions } from '../data/mockQuestions.ts'
import type { RequirementAnswer } from '../types.ts'
import { isRequirementAnswered } from '../utils/answer.ts'

const issueSummary = [
  {
    label: '부족한 부분',
    count: 3,
    icon: CircleAlert,
    className: 'bg-[#fff1ea] text-[#b94727]',
  },
  {
    label: '수정 필요',
    count: 1,
    icon: PencilLine,
    className: 'bg-[#fff8c7] text-[#765f0c]',
  },
  {
    label: '애매한 부분',
    count: 2,
    icon: HelpCircle,
    className: 'bg-[#e9f2cc] text-[#375226]',
  },
]

export function RequirementsReviewPage() {
  const { teamName } = useOutletContext<WorkspaceContext>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, RequirementAnswer>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const question = mockRequirementQuestions[currentIndex]
  const answer = answers[question.id]
  const answeredCount = useMemo(
    () =>
      mockRequirementQuestions.filter((item) =>
        isRequirementAnswered(item, answers[item.id]),
      ).length,
    [answers],
  )
  const progress = isComplete
    ? 100
    : ((currentIndex + 1) / mockRequirementQuestions.length) * 100

  const handleNext = () => {
    if (!isRequirementAnswered(question, answer)) return

    if (currentIndex === mockRequirementQuestions.length - 1) {
      setIsComplete(true)
      return
    }

    setCurrentIndex((index) => index + 1)
  }

  const handlePrevious = () => {
    if (isComplete) {
      setIsComplete(false)
      setCurrentIndex(mockRequirementQuestions.length - 1)
      return
    }

    setCurrentIndex((index) => Math.max(0, index - 1))
  }

  return (
    <div className="demo-grid relative min-h-screen overflow-hidden bg-[#f3f0e7] text-[#17332f]">
      <div className="pointer-events-none absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-[#d9ef7d]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#ff9b75]/30 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <Link className="flex items-center gap-3" to="/" aria-label="DemoForge 홈">
          <span className="grid size-10 place-items-center rounded-xl bg-[#17332f] text-[#fffaf1] shadow-[4px_4px_0_#ec6b42]">
            <Braces aria-hidden="true" size={21} strokeWidth={2.4} />
          </span>
          <span className="text-lg font-black tracking-[-0.04em]">
            DemoForge
          </span>
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-[#17332f]/12 bg-white/55 px-3 py-2 text-[11px] font-bold text-[#17332f]/65 backdrop-blur">
          <UsersRound aria-hidden="true" size={14} />
          <span className="max-w-28 truncate sm:max-w-52">{teamName}</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-4 sm:px-8 sm:pt-8 lg:px-10">
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#17332f] px-3 py-1.5 text-xs font-bold text-white">
                <CheckCircle2 aria-hidden="true" size={14} />
                PDF 분석 완료
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-5xl">
                확인이 필요한 내용이
                <br className="hidden sm:block" /> 총 6개 있어요.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#17332f]/55 sm:text-base">
                답변을 바탕으로 기능 범위와 비즈니스 규칙을 확정합니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {issueSummary.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    className={`rounded-2xl px-3 py-3 sm:min-w-32 sm:px-4 ${item.className}`}
                    key={item.label}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Icon aria-hidden="true" size={16} />
                      <strong className="font-mono text-lg">{item.count}</strong>
                    </div>
                    <p className="mt-2 text-[11px] font-extrabold sm:text-xs">
                      {item.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex justify-between text-xs font-bold text-[#17332f]/45">
              <span>{answeredCount}개 답변 완료</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#17332f]/10">
              <div
                className="h-full rounded-full bg-[#ec6b42] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {isComplete ? (
          <section className="rounded-[28px] border border-[#17332f]/15 bg-white/90 p-7 text-center shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-12">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#e9f2cc] text-[#375226] shadow-[5px_5px_0_#17332f]">
              <Check aria-hidden="true" size={30} strokeWidth={3} />
            </span>
            <p className="mt-7 text-xs font-black tracking-[0.13em] text-[#ec6b42]">
              REVIEW COMPLETE
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              필요한 답변을 모두 받았어요.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#17332f]/58">
              총 {mockRequirementQuestions.length}개의 답변을 ProjectSpec에
              반영하고, 확정된 범위로 개발 파이프라인을 시작할 수 있습니다.
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col-reverse gap-3 sm:flex-row">
              <Button
                className="flex-1"
                onClick={handlePrevious}
                type="button"
                variant="outline"
              >
                <ArrowLeft aria-hidden="true" size={17} />
                답변 다시 보기
              </Button>
              <Button
                className="flex-1"
                onClick={() => setIsSubmitted(true)}
                type="button"
              >
                {isSubmitted ? (
                  <>
                    <Check aria-hidden="true" size={17} />
                    제출 준비 완료
                  </>
                ) : (
                  <>
                    답변 제출하기
                    <ArrowRight aria-hidden="true" size={17} />
                  </>
                )}
              </Button>
            </div>
            {isSubmitted && (
              <p className="mt-4 text-xs font-semibold text-[#5f8a39]" role="status">
                API 연결 후 이 위치에서 최종 답변을 전송합니다.
              </p>
            )}
          </section>
        ) : (
          <>
            <QuestionCard
              answer={answer}
              index={currentIndex}
              onChange={(nextAnswer) =>
                setAnswers((current) => ({
                  ...current,
                  [question.id]: nextAnswer,
                }))
              }
              question={question}
              total={mockRequirementQuestions.length}
            />

            <div className="mt-5 flex items-center justify-between gap-3">
              <Button
                disabled={currentIndex === 0}
                onClick={handlePrevious}
                type="button"
                variant="outline"
              >
                <ArrowLeft aria-hidden="true" size={17} />
                이전
              </Button>
              <Button
                disabled={!isRequirementAnswered(question, answer)}
                onClick={handleNext}
                type="button"
              >
                {currentIndex === mockRequirementQuestions.length - 1
                  ? '답변 완료'
                  : '다음 질문'}
                <ArrowRight aria-hidden="true" size={17} />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
