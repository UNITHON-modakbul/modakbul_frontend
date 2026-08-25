import {
  Check,
  HelpCircle,
  PencilLine,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import { Input } from '../../../components/ui/Input.tsx'
import { Textarea } from '../../../components/ui/Textarea.tsx'
import { cn } from '../../../utils/cn.ts'
import type {
  RequirementAnswer,
  RequirementIssueType,
  RequirementQuestion,
} from '../types.ts'

const issueMeta: Record<
  RequirementIssueType,
  { label: string; className: string; icon: LucideIcon }
> = {
  missing: {
    label: '부족한 부분',
    className: 'bg-[#fff1ea] text-[#b94727]',
    icon: Plus,
  },
  revision: {
    label: '수정 필요',
    className: 'bg-[#fff8c7] text-[#765f0c]',
    icon: PencilLine,
  },
  ambiguous: {
    label: '애매한 부분',
    className: 'bg-[#e9f2cc] text-[#375226]',
    icon: HelpCircle,
  },
}

interface QuestionCardProps {
  answer?: RequirementAnswer
  index?: number
  number?: number
  onChange: (answer: RequirementAnswer) => void
  question: RequirementQuestion
  total?: number
}

export function QuestionCard({
  answer,
  index,
  number,
  onChange,
  question,
}: QuestionCardProps) {
  const meta = issueMeta[question.issueType]
  const IssueIcon = meta.icon
  const displayNumber = number ?? (index ?? 0) + 1

  return (
    <article className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden rounded-[30px] border border-[#17332f]/15 bg-[#fffdf7] p-4 shadow-[0_24px_60px_rgba(23,51,47,0.1)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold',
            meta.className,
          )}
        >
          <IssueIcon aria-hidden="true" size={14} />
          {meta.label}
        </span>
        <span className="font-mono text-xs font-black text-[#17332f]/35">
          Q{String(displayNumber).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-3 sm:mt-4">
        <p className="text-xs font-black tracking-[0.13em] text-[#ec6b42]">
          AI REVIEW QUESTION
        </p>
        <h2 className="mt-2 text-xl font-black leading-snug tracking-[-0.04em] text-[#17332f] sm:text-3xl">
          {question.title}
        </h2>
        <p className="mt-3 rounded-2xl border-l-4 border-[#d9ef7d] bg-[#f3f0e7]/75 px-4 py-3 text-xs leading-5 text-[#17332f]/58 sm:text-sm sm:leading-6">
          {question.description}
        </p>
      </div>

      <div className="mt-4 min-h-0 flex-1 sm:mt-5">
        {question.type === 'yes-no' && (
          <div className="grid grid-cols-2 gap-3" role="radiogroup">
            {[
              { label: '예', value: 'yes' },
              { label: '아니요', value: 'no' },
            ].map((option) => {
              const isSelected = answer?.value === option.value

              return (
                <label className="cursor-pointer" key={option.value}>
                  <input
                    checked={isSelected}
                    className="peer sr-only"
                    name={question.id}
                    onChange={() => onChange({ value: option.value })}
                    type="radio"
                    value={option.value}
                  />
                  <span
                    className={cn(
                      'flex min-h-20 items-center justify-center gap-3 rounded-2xl border-2 bg-[#fffdf7] text-base font-extrabold text-[#17332f] transition hover:border-[#17332f]/25 peer-focus-visible:ring-4 peer-focus-visible:ring-[#ec6b42]/15 sm:min-h-24 sm:text-lg',
                      isSelected
                        ? 'border-[#17332f] bg-[#e9f2cc] shadow-[0_6px_0_rgba(23,51,47,0.12)]'
                        : 'border-[#17332f]/10',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-6 place-items-center rounded-full border transition',
                        isSelected
                          ? 'border-[#17332f] bg-[#17332f]'
                          : 'border-[#17332f]/20 bg-white',
                      )}
                    >
                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="text-white"
                          size={15}
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    {option.label}
                  </span>
                </label>
              )
            })}
          </div>
        )}

        {question.type === 'multiple-choice' && (
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {question.options.map((option) => {
              const isSelected = answer?.value === option.value

              return (
                <label className="block cursor-pointer" key={option.value}>
                  <input
                    checked={isSelected}
                    className="peer sr-only"
                    name={question.id}
                    onChange={() => onChange({ value: option.value })}
                    type="radio"
                    value={option.value}
                  />
                  <span
                    className={cn(
                      'flex min-h-14 items-center gap-3 rounded-2xl border-2 bg-[#fffdf7] px-4 text-sm font-bold text-[#17332f] transition hover:border-[#17332f]/25 peer-focus-visible:ring-4 peer-focus-visible:ring-[#ec6b42]/15',
                      isSelected
                        ? 'border-[#17332f] bg-[#e9f2cc]'
                        : 'border-[#17332f]/10',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-6 shrink-0 place-items-center rounded-full border transition',
                        isSelected
                          ? 'border-[#17332f] bg-[#17332f]'
                          : 'border-[#17332f]/20 bg-white',
                      )}
                    >
                      {isSelected && (
                        <Check
                          aria-hidden="true"
                          className="text-white"
                          size={15}
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    {option.label}
                  </span>
                </label>
              )
            })}

            {question.allowOther && (
              <div
                className={cn(
                  'rounded-2xl border-2 bg-[#fffdf7] p-2.5 transition',
                  answer?.value === 'other'
                    ? 'border-[#17332f] bg-[#e9f2cc]'
                    : 'border-[#17332f]/10',
                )}
              >
                <label className="flex cursor-pointer items-center gap-3 px-1 py-1 text-sm font-bold">
                  <input
                    checked={answer?.value === 'other'}
                    className="peer sr-only"
                    name={question.id}
                    onChange={() =>
                      onChange({ value: 'other', otherText: answer?.otherText ?? '' })
                    }
                    type="radio"
                    value="other"
                  />
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full border transition peer-focus-visible:ring-4 peer-focus-visible:ring-[#ec6b42]/15',
                      answer?.value === 'other'
                        ? 'border-[#17332f] bg-[#17332f]'
                        : 'border-[#17332f]/20 bg-white',
                    )}
                  >
                    {answer?.value === 'other' && (
                      <Check
                        aria-hidden="true"
                        className="text-white"
                        size={15}
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  기타
                </label>
                {answer?.value === 'other' && (
                  <Input
                    aria-label="기타 답변"
                    className="mt-2 h-10 bg-white"
                    onChange={(event) =>
                      onChange({ value: 'other', otherText: event.target.value })
                    }
                    placeholder="직접 입력해주세요"
                    value={answer.otherText ?? ''}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {question.type === 'text' && (
          <div>
            <label className="sr-only" htmlFor={`${question.id}-answer`}>
              답변
            </label>
            <Textarea
              className="h-[clamp(7rem,20vh,10rem)] min-h-0"
              id={`${question.id}-answer`}
              maxLength={question.maxLength}
              onChange={(event) => onChange({ value: event.target.value })}
              placeholder={question.placeholder}
              value={answer?.value ?? ''}
            />
            <p className="mt-2 text-right font-mono text-xs text-[#17332f]/35">
              {answer?.value.length ?? 0}/{question.maxLength}
            </p>
          </div>
        )}
      </div>
    </article>
  )
}
