export type ProjectStatus = '기획 보완 중' | 'AI 개발 중' | '실행 준비 완료'

export interface ProjectSummary {
  id: string
  title: string
  description: string
  status: ProjectStatus
  updatedAt: string
  previewVariant: 'demoforge' | 'booking' | 'community'
}
