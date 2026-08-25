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
    sourcePage: 4,
    title: 'MVP에서 사용할 로그인 방식을 선택해주세요.',
    description:
      '“간편 로그인”이 어떤 인증 방식을 의미하는지 명확하지 않아 구현 범위를 정하기 어려워요.',
    options: [
      { label: '이메일과 비밀번호', value: 'email' },
      { label: '소셜 로그인', value: 'social' },
      { label: '역할만 선택하는 데모 로그인', value: 'demo' },
    ],
    allowOther: true,
  },
  {
    id: 'cancel-policy',
    type: 'text',
    issueType: 'missing',
    sourcePage: 6,
    title: '예약 취소가 가능한 조건을 알려주세요.',
    description:
      '예약 생성 규칙은 있지만 취소 시점, 재고 복구 여부, 취소 불가 조건이 정의되지 않았어요.',
    placeholder:
      '예) 수령 마감 1시간 전까지 고객이 취소할 수 있고, 취소 즉시 재고가 복구됩니다.',
    maxLength: 300,
  },
  {
    id: 'location-range',
    type: 'multiple-choice',
    issueType: 'revision',
    sourcePage: 3,
    title: '“주변 매장”의 탐색 범위를 선택해주세요.',
    description:
      '거리 기준이 없으면 검색 결과와 테스트 조건이 달라질 수 있어 범위를 확정해야 해요.',
    options: [
      { label: '현재 위치 반경 1km', value: '1km' },
      { label: '현재 위치 반경 3km', value: '3km' },
      { label: '같은 행정동 전체', value: 'district' },
    ],
    allowOther: true,
  },
  {
    id: 'reservation-approval',
    type: 'yes-no',
    issueType: 'ambiguous',
    sourcePage: 7,
    title: '고객의 예약을 점주가 별도로 승인해야 하나요?',
    description:
      '예약 이후 상태 흐름이 자동 확정인지 점주 승인 방식인지 두 가지로 해석될 수 있어요.',
  },
  {
    id: 'demo-success',
    type: 'text',
    issueType: 'missing',
    sourcePage: 9,
    title: '이 데모가 완성됐다고 판단할 핵심 시나리오는 무엇인가요?',
    description:
      '최종 검증과 스모크 테스트에 사용할 대표 사용자 흐름이 필요해요.',
    placeholder:
      '예) 점주가 상품을 등록하고 고객이 예약한 뒤 점주가 수령 완료까지 처리할 수 있어야 합니다.',
    maxLength: 400,
  },
]
