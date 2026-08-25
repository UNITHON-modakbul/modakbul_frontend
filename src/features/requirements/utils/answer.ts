import type {
  RequirementAnswer,
  RequirementQuestion,
} from '../types.ts'

export function isRequirementAnswered(
  question: RequirementQuestion,
  answer?: RequirementAnswer,
) {
  if (!answer?.value.trim()) return false

  if (question.type === 'multiple-choice' && answer.value === 'other') {
    return Boolean(answer.otherText?.trim())
  }

  return true
}
