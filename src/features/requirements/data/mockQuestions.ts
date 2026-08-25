import type { RequirementQuestion } from '../types.ts'

export const mockRequirementQuestions: RequirementQuestion[] = [
  {
    id: 'guest-browse',
    type: 'yes-no',
    issueType: 'missing',
    sourcePage: 2,
    title: '로그인하지 않은 사용자도 상품을 볼 수 있나요?',
    description:
      '기획서에 회원 역할은 정의되어 있지만, 비회원의 서비스 접근 범위가 빠져 있어요.',
  },
  {
    id: 'auth-method',
    type: 'multiple-choice',
    issueType: 'ambiguous',
    sourcePage: 2,
    title: 'MVP에서 사용할 로그인 방식을 선택해주세요.',
    description:
      '“간편 로그인”이 어떤 인증 방식을 의미하는지 명확하지 않아 구현 범위를 정하기 어려워요.',
    options: [
      { label: '이메일과 비밀번호', value: 'email' },
      { label: '소셜 로그인', value: 'social' },
      { label: '역할 선택형 데모 로그인', value: 'demo' },
    ],
    allowOther: true,
  },
  {
    id: 'cancel-policy',
    type: 'text',
    issueType: 'missing',
    sourcePage: 4,
    title: '예약 취소가 가능한 조건을 알려주세요.',
    description:
      '예약 생성 규칙은 있지만 취소 시점, 재고 복구 여부, 취소 불가 조건이 정의되지 않았어요.',
    placeholder:
      '예) 수령 마감 1시간 전까지 취소할 수 있고, 취소 즉시 재고가 복구됩니다.',
    maxLength: 300,
  },
]

export const mockFollowUpQuestions: RequirementQuestion[] = [
  {
    id: 'followup-guest-reservation',
    type: 'yes-no',
    issueType: 'ambiguous',
    sourcePage: 2,
    title: '비회원도 상품 조회뿐 아니라 예약까지 할 수 있나요?',
    description:
      '1차 답변으로 비회원의 조회 권한은 확인했지만 예약 단계의 로그인 필요 여부가 남아 있어요.',
  },
  {
    id: 'followup-auth-provider',
    type: 'multiple-choice',
    issueType: 'revision',
    sourcePage: 2,
    title: '소셜 로그인을 사용한다면 우선 지원할 서비스를 선택해주세요.',
    description:
      '1차 인증 방식 답변을 실제 구현 범위로 바꾸기 위해 첫 번째 로그인 제공자를 정해야 해요.',
    options: [
      { label: '카카오', value: 'kakao' },
      { label: '네이버', value: 'naver' },
      { label: 'Google', value: 'google' },
    ],
    allowOther: true,
  },
  {
    id: 'followup-cancel-boundary',
    type: 'text',
    issueType: 'missing',
    sourcePage: 4,
    title: '취소 가능 시간이 지난 예약의 예외 처리 방식을 알려주세요.',
    description:
      '고객의 취소 마감은 확인했지만, 점주 또는 관리자가 처리할 수 있는 예외 규칙이 필요해요.',
    placeholder:
      '예) 마감 이후에는 점주만 취소할 수 있고 고객에게 사유를 알림으로 전달합니다.',
    maxLength: 300,
  },
]
