import type { RequirementQuestion } from '../requirements/types.ts'

export interface RevisionValidationResult {
  questions: RequirementQuestion[]
  revisionId: string
  summary: string
}
