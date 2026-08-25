import type { ProjectSummary } from '../types.ts'

export const mockProjects: ProjectSummary[] = [
  {
    id: 'demoforge-pipeline',
    title: 'DemoForge AI 개발 파이프라인',
    description: '기능명세서를 분석해 작동하는 데모를 만드는 서비스',
    status: '실행 준비 완료',
    updatedAt: '방금 전 수정',
    previewVariant: 'demoforge',
  },
  {
    id: 'campus-booking',
    title: '교내 공간 예약 서비스',
    description: '스터디룸과 공용 공간을 간편하게 예약하는 서비스',
    status: 'AI 개발 중',
    updatedAt: '18분 전 수정',
    previewVariant: 'booking',
  },
  {
    id: 'talent-community',
    title: '재능 공유 커뮤니티',
    description: '팀원끼리 필요한 재능을 나누고 연결하는 커뮤니티',
    status: '기획 보완 중',
    updatedAt: '어제 수정',
    previewVariant: 'community',
  },
]
