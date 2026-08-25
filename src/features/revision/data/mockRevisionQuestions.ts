import type { RequirementQuestion } from '../../requirements/types.ts'

export const mockRevisionQuestions: RequirementQuestion[] = [
  {
    id: 'revision-priority',
    type: 'multiple-choice',
    issueType: 'ambiguous',
    sourcePage: 1,
    title: '이번 수정에서 가장 중요한 기준은 무엇인가요?',
    description:
      '같은 요청도 우선순위에 따라 화면 구조와 구현 범위가 달라질 수 있어요.',
    options: [
      { label: '정보 전달력', value: 'clarity' },
      { label: '시각적 완성도', value: 'visual' },
      { label: '사용 편의성', value: 'usability' },
    ],
    allowOther: true,
  },
  {
    id: 'revision-boundary',
    type: 'yes-no',
    issueType: 'revision',
    sourcePage: 1,
    title: '기존 기능과 데이터 흐름은 그대로 유지할까요?',
    description:
      '현재 요청은 UI 수정으로 이해했어요. 기능 동작까지 달라져야 하는지 마지막으로 확인합니다.',
  },
]
