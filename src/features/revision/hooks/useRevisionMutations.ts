import { useMutation } from '@tanstack/react-query'
import type { RequirementAnswer } from '../../requirements/types.ts'
import { mockRevisionQuestions } from '../data/mockRevisionQuestions.ts'
import type { RevisionValidationResult } from '../types.ts'

interface RevisionValidationPreviewRequest {
  requestedChange: string
  target: string
}

interface RevisionAnswersPreviewRequest {
  answers: Record<string, RequirementAnswer>
}

export function useValidateRevision() {
  return useMutation({
    mutationFn: async (payload: RevisionValidationPreviewRequest) => {
      await new Promise((resolve) => window.setTimeout(resolve, 2200))

      return {
        questions: mockRevisionQuestions,
        revisionId: `preview-revision-${Date.now()}`,
        summary: `“${payload.target}” 영역의 수정 방향을 검토했어요. 구현 전에 2가지만 더 확인할게요.`,
      } satisfies RevisionValidationResult
    },
  })
}

export function useSubmitRevisionAnswers() {
  return useMutation({
    mutationFn: async (_payload: RevisionAnswersPreviewRequest) => {
      await new Promise((resolve) => window.setTimeout(resolve, 1500))

      return {
        message: '수정 요청 UI 확인이 완료됐어요.',
      }
    },
  })
}
