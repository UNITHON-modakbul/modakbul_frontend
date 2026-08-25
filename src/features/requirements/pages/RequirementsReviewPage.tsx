import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Braces,
  Check,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Send,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import { Button } from '../../../components/ui/Button.tsx'
import type { WorkspaceContext } from '../../../routes/workspaceContext.ts'
import { cn } from '../../../utils/cn.ts'
import { QuestionCard } from '../components/QuestionCard.tsx'
import {
  mockFollowUpQuestions,
  mockRequirementQuestions,
} from '../data/mockQuestions.ts'
import type { RequirementAnswer, RequirementQuestion } from '../types.ts'
import { isRequirementAnswered } from '../utils/answer.ts'

type ReviewPhase =
  | 'initial-analyzing'
  | 'answering'
  | 'round-complete'
  | 'analyzing'
  | 'finished'

const initialAnalysisSteps = [
  '업로드한 PDF를 안전하게 전달받았어요.',
  '페이지별 기능과 정책을 분석하고 있어요.',
  '확인이 필요한 1차 질문을 생성하고 있어요.',
]

const followUpAnalysisSteps = [
  '작성한 답변을 AI에게 전달했어요.',
  '기획서와 답변을 함께 비교하고 있어요.',
  '추가로 확인할 질문이 있는지 검토하고 있어요.',
]

interface QuestionProgressRailProps {
  activeIndex: number
  answers: Record<string, RequirementAnswer>
  disabled: boolean
  isRoundComplete: boolean
  onSelect: (index: number) => void
  questions: RequirementQuestion[]
  roundNumber: number
}

function QuestionProgressRail({
  activeIndex,
  answers,
  disabled,
  isRoundComplete,
  onSelect,
  questions,
  roundNumber,
}: QuestionProgressRailProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)
  const lastIndex = Math.max(questions.length - 1, 1)
  const progress = isRoundComplete ? 100 : (activeIndex / lastIndex) * 100

  useEffect(() => {
    const container = scrollContainerRef.current
    const activeButton = activeButtonRef.current

    if (!container || !activeButton || isRoundComplete) return

    const targetTop =
      activeButton.offsetTop -
      container.clientHeight / 2 +
      activeButton.clientHeight / 2

    container.scrollTo({ top: targetTop, behavior: 'smooth' })
  }, [activeIndex, isRoundComplete])

  return (
    <aside
      aria-label={`${roundNumber}차 질문 진행 단계`}
      className="relative flex w-14 shrink-0 flex-col border-r border-[#17332f]/10 py-2 sm:w-36 sm:py-3"
    >
      <div className="shrink-0 pb-2 text-center">
        <span className="inline-flex rounded-full bg-[#17332f] px-2 py-1 font-mono text-[9px] font-black text-white sm:px-2.5">
          R{roundNumber}
        </span>
        <p className="mt-1 hidden text-[9px] font-bold text-[#17332f]/35 sm:block">
          {questions.length} QUESTIONS
        </p>
      </div>

      <div
        className="progress-rail-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-1 py-3"
        ref={scrollContainerRef}
      >
        <div className="relative">
          <div className="absolute bottom-[22px] left-1/2 top-[22px] w-1 -translate-x-1/2 overflow-hidden rounded-full bg-[#17332f]/10">
            <div
              className="w-full rounded-full bg-[#5f8a39] transition-[height] duration-500"
              style={{ height: `${progress}%` }}
            />
          </div>

          <ol className="relative flex flex-col gap-5">
            {questions.map((question, index) => {
              const isActive = !isRoundComplete && index === activeIndex
              const isAnswered = isRequirementAnswered(
                question,
                answers[question.id],
              )
              const isDone = isRoundComplete || (!isActive && isAnswered)

              return (
                <li
                  className="relative flex items-center justify-center"
                  key={question.id}
                >
                  <button
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`${index + 1}번 질문, PDF ${question.sourcePage}페이지${isAnswered ? ', 답변 완료' : ''}`}
                    className="group relative z-10 grid size-11 place-items-center focus-visible:outline-none disabled:cursor-wait"
                    disabled={disabled}
                    onClick={() => onSelect(index)}
                    ref={isActive ? activeButtonRef : undefined}
                    type="button"
                  >
                    <span
                      className={cn(
                        'grid size-9 place-items-center rounded-full border-2 font-mono text-[11px] font-black transition-all duration-300 group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-[#ec6b42]/20 sm:size-11 sm:text-xs',
                        isActive
                          ? 'scale-110 border-[#17332f] bg-[#ec6b42] text-white shadow-[0_5px_0_#17332f]'
                          : isDone
                            ? 'border-[#375226] bg-[#d9ef7d] text-[#17332f] shadow-[0_4px_0_#5f8a39]'
                            : 'border-[#17332f]/15 bg-[#fffdf7] text-[#17332f]/30',
                      )}
                    >
                      {isDone || (isActive && isAnswered) ? (
                        <Check aria-hidden="true" size={17} strokeWidth={3} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span
                      className={cn(
                        'absolute left-[calc(50%+26px)] hidden whitespace-nowrap text-[10px] font-black transition-colors group-hover:text-[#17332f] sm:block',
                        isActive ? 'text-[#ec6b42]' : 'text-[#17332f]/32',
                      )}
                    >
                      Q{String(index + 1).padStart(2, '0')}
                      <span className="ml-1 font-mono font-bold opacity-60">
                        {question.sourcePage}P
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-[#f3f0e7] to-transparent" />
    </aside>
  )
}

interface AnalysisWaitingProps {
  activeStep: number
  mode: 'initial' | 'follow-up'
  roundNumber: number
}

function AnalysisWaiting({
  activeStep,
  mode,
  roundNumber,
}: AnalysisWaitingProps) {
  const isInitialAnalysis = mode === 'initial'
  const steps = isInitialAnalysis
    ? initialAnalysisSteps
    : followUpAnalysisSteps

  return (
    <section className="grid min-h-0 flex-1 place-items-center py-4" aria-live="polite">
      <div className="w-full max-w-2xl rounded-[30px] border border-[#17332f]/15 bg-white/90 p-6 shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-9">
        <div className="flex flex-col items-center text-center">
          <div className="relative grid size-20 place-items-center">
            <span className="absolute inset-0 animate-pulse rounded-full bg-[#d9ef7d]/55" />
            <span className="relative grid size-14 place-items-center rounded-2xl bg-[#17332f] text-white shadow-[4px_4px_0_#ec6b42]">
              <Bot aria-hidden="true" size={27} />
            </span>
            <Sparkles
              aria-hidden="true"
              className="absolute -right-1 top-0 text-[#ec6b42]"
              size={19}
            />
          </div>

          <span className="mt-4 rounded-full bg-[#e9f2cc] px-3 py-1.5 text-[11px] font-black text-[#375226]">
            {isInitialAnalysis
              ? 'REQUIREMENTS PDF 분석 중'
              : `ROUND ${roundNumber} 답변 전달 완료`}
          </span>
          <h1 className="mt-4 text-2xl font-black tracking-[-0.045em] sm:text-4xl">
            {isInitialAnalysis
              ? 'AI가 기획서를 읽고 있어요.'
              : 'AI가 답변을 다시 분석하고 있어요.'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#17332f]/55">
            {isInitialAnalysis
              ? '분석이 끝나면 보완이 필요한 내용을 질문 카드로 정리해드릴게요.'
              : '추가로 확인할 내용이 있으면 새 질문 카드를 바로 이어서 보여드릴게요.'}
          </p>
        </div>

        <div className="mx-auto mt-7 max-w-lg space-y-2.5">
          {steps.map((step, index) => {
            const isDone = index < activeStep
            const isActive = index === activeStep

            return (
              <div
                className={cn(
                  'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition',
                  isDone
                    ? 'border-[#b6cf5b] bg-[#e9f2cc] text-[#375226]'
                    : isActive
                      ? 'border-[#ec6b42]/35 bg-[#fff1ea] text-[#b94727]'
                      : 'border-[#17332f]/8 bg-[#f3f0e7]/55 text-[#17332f]/35',
                )}
                key={step}
              >
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full',
                    isDone
                      ? 'bg-[#5f8a39] text-white'
                      : isActive
                        ? 'bg-[#ec6b42] text-white'
                        : 'bg-[#17332f]/8',
                  )}
                >
                  {isDone ? (
                    <Check aria-hidden="true" size={15} strokeWidth={3} />
                  ) : isActive ? (
                    <LoaderCircle aria-hidden="true" className="animate-spin" size={15} />
                  ) : (
                    index + 1
                  )}
                </span>
                {step}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function RequirementsReviewPage() {
  const { teamName } = useOutletContext<WorkspaceContext>()
  const [questionRounds, setQuestionRounds] = useState<RequirementQuestion[][]>([
    mockRequirementQuestions,
  ])
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, RequirementAnswer>>({})
  const [phase, setPhase] = useState<ReviewPhase>('initial-analyzing')
  const [analysisStep, setAnalysisStep] = useState(0)

  const activeRoundIndex = questionRounds.length - 1
  const roundNumber = activeRoundIndex + 1
  const activeQuestions = questionRounds[activeRoundIndex]
  const activeQuestion = activeQuestions[activeQuestionIndex]
  const pageQuestions = activeQuestions.filter(
    (question) => question.sourcePage === activeQuestion.sourcePage,
  )
  const pageQuestionIndex = pageQuestions.findIndex(
    (question) => question.id === activeQuestion.id,
  )
  const answeredCount = activeQuestions.filter((question) =>
    isRequirementAnswered(question, answers[question.id]),
  ).length
  const isCurrentAnswered = isRequirementAnswered(
    activeQuestion,
    answers[activeQuestion.id],
  )
  const isFirstQuestion = activeQuestionIndex === 0
  const isLastQuestion = activeQuestionIndex === activeQuestions.length - 1
  const isRoundComplete = phase !== 'answering'

  useEffect(() => {
    const isInitialAnalysis = phase === 'initial-analyzing'
    if (!isInitialAnalysis && phase !== 'analyzing') return

    const stepTimer = window.setInterval(() => {
      setAnalysisStep((current) =>
        Math.min(current + 1, initialAnalysisSteps.length - 1),
      )
    }, 900)

    const resultTimer = window.setTimeout(() => {
      window.clearInterval(stepTimer)

      if (isInitialAnalysis) {
        setAnalysisStep(0)
        setPhase('answering')
        return
      }

      if (activeRoundIndex === 0) {
        setQuestionRounds((current) => [...current, mockFollowUpQuestions])
        setActiveQuestionIndex(0)
        setPhase('answering')
        return
      }

      setPhase('finished')
    }, 3200)

    return () => {
      window.clearInterval(stepTimer)
      window.clearTimeout(resultTimer)
    }
  }, [activeRoundIndex, phase])

  const handleNextQuestion = () => {
    if (!isCurrentAnswered) return

    if (isLastQuestion) {
      setPhase('round-complete')
      return
    }

    setActiveQuestionIndex((current) => current + 1)
  }

  const handlePreviousQuestion = () => {
    if (!isFirstQuestion) {
      setActiveQuestionIndex((current) => current - 1)
    }
  }

  const handleSubmitRound = () => {
    setAnalysisStep(0)
    setPhase('analyzing')
  }

  const handleSelectQuestion = (index: number) => {
    if (phase === 'analyzing') return
    setActiveQuestionIndex(index)
    setPhase('answering')
  }

  return (
    <div className="demo-grid relative h-dvh overflow-hidden bg-[#f3f0e7] text-[#17332f]">
      <div className="pointer-events-none absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-[#d9ef7d]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#ff9b75]/30 blur-3xl" />

      <header className="relative z-20 h-16 border-b border-[#17332f]/10 bg-[#f3f0e7]/80 backdrop-blur sm:h-[72px]">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
          <Link className="flex shrink-0 items-center gap-3" to="/" aria-label="DemoForge 홈">
            <span className="grid size-9 place-items-center rounded-xl bg-[#17332f] text-[#fffaf1] shadow-[3px_3px_0_#ec6b42] sm:size-10">
              <Braces aria-hidden="true" size={20} strokeWidth={2.4} />
            </span>
            <span className="hidden text-lg font-black tracking-[-0.04em] sm:block">
              DemoForge
            </span>
          </Link>

          <div className="min-w-0 text-center">
            <p className="font-mono text-[10px] font-black tracking-[0.14em] text-[#ec6b42]">
              {phase === 'initial-analyzing'
                ? 'AI REQUIREMENTS ANALYSIS'
                : `AI REQUIREMENTS REVIEW · ROUND ${roundNumber}`}
            </p>
            <p className="truncate text-xs font-extrabold text-[#17332f]/60 sm:text-sm">
              {phase === 'initial-analyzing'
                ? '기획서 분석 및 질문 생성'
                : roundNumber === 1
                  ? '기획서 보완 질문'
                  : '이전 답변 기반 후속 질문'}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#17332f]/12 bg-white/55 px-3 py-2 text-[11px] font-bold text-[#17332f]/65">
            <UsersRound aria-hidden="true" size={14} />
            <span className="max-w-20 truncate sm:max-w-40">{teamName}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-7xl px-2 pb-3 sm:h-[calc(100dvh-72px)] sm:px-6 sm:pb-5 lg:px-10">
        {phase !== 'initial-analyzing' && (
          <QuestionProgressRail
            activeIndex={activeQuestionIndex}
            answers={answers}
            disabled={phase === 'analyzing'}
            isRoundComplete={isRoundComplete}
            onSelect={handleSelectQuestion}
            questions={activeQuestions}
            roundNumber={roundNumber}
          />
        )}

        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col',
            phase === 'initial-analyzing' ? 'px-2 sm:px-7' : 'pl-3 sm:pl-7',
          )}
        >
          {phase === 'initial-analyzing' ? (
            <AnalysisWaiting
              activeStep={analysisStep}
              mode="initial"
              roundNumber={roundNumber}
            />
          ) : phase === 'analyzing' ? (
            <AnalysisWaiting
              activeStep={analysisStep}
              mode="follow-up"
              roundNumber={roundNumber}
            />
          ) : phase === 'round-complete' ? (
            <section className="grid min-h-0 flex-1 place-items-center py-4">
              <div className="w-full max-w-2xl rounded-[30px] border border-[#17332f]/15 bg-white/90 p-7 text-center shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-10">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e9f2cc] text-[#375226] shadow-[4px_4px_0_#17332f]">
                  <Check aria-hidden="true" size={27} strokeWidth={3} />
                </span>
                <p className="mt-6 text-xs font-black tracking-[0.13em] text-[#ec6b42]">
                  ROUND {roundNumber} COMPLETE
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  {roundNumber === 1
                    ? '첫 번째 답변이 모두 준비됐어요.'
                    : '후속 질문에도 모두 답변했어요.'}
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#17332f]/58">
                  {activeQuestions.length}개의 답변을 AI에게 전달하면 기존 기획서와
                  함께 다시 분석해 추가 질문이 필요한지 확인합니다.
                </p>

                <div className="mx-auto mt-7 flex max-w-md flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setPhase('answering')
                      setActiveQuestionIndex(activeQuestions.length - 1)
                    }}
                    type="button"
                    variant="outline"
                  >
                    <ArrowLeft aria-hidden="true" size={17} />
                    답변 다시 보기
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmitRound}
                    type="button"
                  >
                    <Send aria-hidden="true" size={17} />
                    AI에게 답변 전달
                  </Button>
                </div>
              </div>
            </section>
          ) : phase === 'finished' ? (
            <section className="grid min-h-0 flex-1 place-items-center py-4">
              <div className="w-full max-w-2xl rounded-[30px] border border-[#17332f]/15 bg-white/90 p-7 text-center shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-10">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#17332f] text-white shadow-[4px_4px_0_#d9ef7d]">
                  <Sparkles aria-hidden="true" size={26} />
                </span>
                <p className="mt-6 text-xs font-black tracking-[0.13em] text-[#5f8a39]">
                  REVIEW FINISHED
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  더 확인할 질문이 없어요.
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#17332f]/58">
                  기획서와 {questionRounds.length}차례의 답변을 모두 검토했습니다.
                  확정된 내용으로 ProjectSpec을 생성할 수 있어요.
                </p>
                <div className="mx-auto mt-7 flex max-w-md flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setPhase('answering')
                      setActiveQuestionIndex(activeQuestions.length - 1)
                    }}
                    type="button"
                    variant="outline"
                  >
                    <ArrowLeft aria-hidden="true" size={17} />
                    답변 검토
                  </Button>
                  <Button asChild className="flex-1">
                    <Link to="/">
                      ProjectSpec 준비
                      <ArrowRight aria-hidden="true" size={17} />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          ) : (
            <>
              <section className="flex shrink-0 items-center justify-between gap-4 py-3 sm:py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#17332f] px-3 py-1.5 text-[11px] font-bold text-white">
                    <FileText aria-hidden="true" size={13} />
                    PDF {activeQuestion.sourcePage}P
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">
                      {roundNumber > 1 && '후속 '}질문 {activeQuestionIndex + 1} /{' '}
                      {activeQuestions.length}
                    </p>
                    <p className="hidden text-xs text-[#17332f]/45 sm:block">
                      {roundNumber === 1
                        ? `이 페이지의 질문 ${pageQuestionIndex + 1} / ${pageQuestions.length}`
                        : '이전 답변을 바탕으로 AI가 추가한 질문입니다.'}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-xs font-bold text-[#17332f]/45">
                  <CheckCircle2 aria-hidden="true" size={15} />
                  {answeredCount} / {activeQuestions.length} 완료
                </div>
              </section>

              <section className="relative min-h-0 flex-1 pb-3" aria-live="polite">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-8 bottom-0 top-4 rotate-[0.7deg] rounded-[30px] border border-[#17332f]/12 bg-[#d9ef7d]/55"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-4 bottom-2 top-2 -rotate-[0.35deg] rounded-[30px] border border-[#17332f]/12 bg-[#fff8c7]"
                />
                <div
                  className="flashcard-enter relative h-full"
                  key={activeQuestion.id}
                >
                  <QuestionCard
                    answer={answers[activeQuestion.id]}
                    number={activeQuestionIndex + 1}
                    onChange={(nextAnswer) =>
                      setAnswers((current) => ({
                        ...current,
                        [activeQuestion.id]: nextAnswer,
                      }))
                    }
                    question={activeQuestion}
                  />
                </div>
              </section>

              <section className="flex shrink-0 items-center justify-between gap-3 border-t border-[#17332f]/10 pt-3">
                <p
                  className={cn(
                    'hidden items-center gap-2 text-xs font-bold sm:flex',
                    isCurrentAnswered
                      ? 'text-[#5f8a39]'
                      : 'text-[#17332f]/40',
                  )}
                >
                  {isCurrentAnswered && (
                    <Check aria-hidden="true" size={14} strokeWidth={3} />
                  )}
                  {isCurrentAnswered
                    ? '답변이 저장됐어요.'
                    : '답변 후 다음 카드로 이동할 수 있어요.'}
                </p>

                <div className="ml-auto grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">
                  <Button
                    disabled={isFirstQuestion}
                    onClick={handlePreviousQuestion}
                    type="button"
                    variant="outline"
                  >
                    <ArrowLeft aria-hidden="true" size={17} />
                    이전 질문
                  </Button>
                  <Button
                    disabled={!isCurrentAnswered}
                    onClick={handleNextQuestion}
                    type="button"
                  >
                    {isLastQuestion ? '답변 완료' : '다음 질문'}
                    <ArrowRight aria-hidden="true" size={17} />
                  </Button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
