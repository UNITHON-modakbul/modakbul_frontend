import { Check, FileSearch, HelpCircle, PencilLine, Plus } from 'lucide-react'
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
  { label: string; className: string; icon: typeof FileSearch }
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
  index: number
  onChange: (answer: RequirementAnswer) => void
  question: RequirementQuestion
  total: number
}

export function QuestionCard({
  answer,
  index,
  onChange,
  question,
  total,
}: QuestionCardProps) {
  const meta = issueMeta[question.issueType]
  const IssueIcon = meta.icon

  return (
    <section className="rounded-[28px] border border-[#17332f]/15 bg-white/90 p-5 shadow-[0_24px_70px_rgba(23,51,47,0.12)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold',
              meta.className,
            )}
          >
            <IssueIcon aria-hidden="true" size={14} />
            {meta.label}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#17332f]/10 bg-[#f3f0e7] px-3 py-1.5 text-xs font-bold text-[#17332f]/50">
            <FileSearch aria-hidden="true" size={14} />
            PDF {question.sourcePage}페이지
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-[#17332f]/35">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-7">
        <p className="text-xs font-black tracking-[0.13em] text-[#ec6b42]">
          AI REVIEW QUESTION
        </p>
        <h1 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-[#17332f] sm:text-4xl">
          {question.title}
        </h1>
        <p className="mt-4 rounded-xl border-l-4 border-[#d9ef7d] bg-[#f3f0e7]/75 px-4 py-3 text-sm leading-6 text-[#17332f]/58">
          {question.description}
        </p>
      </div>

      <div className="mt-7">
        {question.type === 'yes-no' && (
          <div className="grid grid-cols-2 gap-3" role="radiogroup">
            {[
              { label: '예', value: 'yes' },
              { label: '아니요', value: 'no' },
            ].map((option) => (
              <label className="cursor-pointer" key={option.value}>
                <input
                  checked={answer?.value === option.value}
                  className="peer sr-only"
                  name={question.id}
                  onChange={() => onChange({ value: option.value })}
                  type="radio"
                  value={option.value}
                />
                <span className="flex min-h-20 items-center justify-center gap-2 rounded-2xl border-2 border-[#17332f]/10 bg-[#fffdf7] text-base font-extrabold text-[#17332f] transition hover:border-[#17332f]/25 peer-checked:border-[#17332f] peer-checked:bg-[#e9f2cc] peer-focus-visible:ring-4 peer-focus-visible:ring-[#ec6b42]/15">
                  <span className="grid size-5 place-items-center rounded-full border border-[#17332f]/20 bg-white peer-checked:bg-[#17332f]">
                    {answer?.value === option.value && (
                      <Check aria-hidden="true" className="text-white" size={13} />
                    )}
                  </span>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'multiple-choice' && (
          <div className="space-y-3" role="radiogroup">
            {question.options.map((option) => (
              <label className="block cursor-pointer" key={option.value}>
                <input
                  checked={answer?.value === option.value}
                  className="peer sr-only"
                  name={question.id}
                  onChange={() => onChange({ value: option.value })}
                  type="radio"
                  value={option.value}
                />
                <span className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-[#17332f]/10 bg-[#fffdf7] px-4 text-sm font-bold text-[#17332f] transition hover:border-[#17332f]/25 peer-checked:border-[#17332f] peer-checked:bg-[#e9f2cc] peer-focus-visible:ring-4 peer-focus-visible:ring-[#ec6b42]/15">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full border border-[#17332f]/20 bg-white">
                    {answer?.value === option.value && (
                      <Check aria-hidden="true" className="text-[#17332f]" size={13} />
                    )}
                  </span>
                  {option.label}
                </span>
              </label>
            ))}

            {question.allowOther && (
              <div
                className={cn(
                  'rounded-2xl border-2 bg-[#fffdf7] p-3 transition',
                  answer?.value === 'other'
                    ? 'border-[#17332f] bg-[#e9f2cc]'
                    : 'border-[#17332f]/10',
                )}
              >
                <label className="flex cursor-pointer items-center gap-3 px-1 py-1 text-sm font-bold">
                  <input
                    checked={answer?.value === 'other'}
                    className="size-4 accent-[#17332f]"
                    name={question.id}
                    onChange={() =>
                      onChange({ value: 'other', otherText: answer?.otherText ?? '' })
                    }
                    type="radio"
                    value="other"
                  />
                  기타
                </label>
                {answer?.value === 'other' && (
                  <Input
                    aria-label="기타 답변"
                    className="mt-2 h-12 bg-white"
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
    </section>
  )
}
