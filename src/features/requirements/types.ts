export type RequirementIssueType = 'missing' | 'revision' | 'ambiguous'
export type RequirementQuestionType =
  | 'yes-no'
  | 'multiple-choice'
  | 'text'

interface BaseRequirementQuestion {
  id: string
  issueType: RequirementIssueType
  sourcePage: number
  title: string
  description: string
}

export interface YesNoQuestion extends BaseRequirementQuestion {
  type: 'yes-no'
}

export interface MultipleChoiceQuestion extends BaseRequirementQuestion {
  type: 'multiple-choice'
  options: Array<{
    label: string
    value: string
  }>
  allowOther: boolean
}

export interface TextQuestion extends BaseRequirementQuestion {
  type: 'text'
  placeholder: string
  maxLength: number
}

export type RequirementQuestion =
  | YesNoQuestion
  | MultipleChoiceQuestion
  | TextQuestion

export interface RequirementAnswer {
  value: string
  otherText?: string
}
