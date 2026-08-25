import { api } from '../../../lib/api.ts'
import type {
  SaveEditorChangesRequest,
  SaveEditorChangesResponse,
} from './types.ts'

const useMockEditorApi = import.meta.env.VITE_USE_MOCK_EDITOR_API !== 'false'

export async function saveEditorChanges(
  payload: SaveEditorChangesRequest,
): Promise<SaveEditorChangesResponse> {
  if (useMockEditorApi) {
    await new Promise((resolve) => window.setTimeout(resolve, 900))

    return {
      jobId: `mock-${Date.now()}`,
      status: 'applied',
      message: `${payload.changes.length}개 변경사항을 소스 수정 요청으로 변환했습니다.`,
    }
  }

  const response = await api.post<SaveEditorChangesResponse>(
    `/development-sessions/${payload.sessionId}/editor-changes`,
    payload,
  )

  return response.data
}
