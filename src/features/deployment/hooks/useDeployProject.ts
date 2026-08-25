import { useMutation } from '@tanstack/react-query'

interface DeploymentPreviewRequest {
  previewUrl: string
  sessionId: string
}

export function useDeployProject() {
  return useMutation({
    mutationFn: async (payload: DeploymentPreviewRequest) => {
      await new Promise((resolve) => window.setTimeout(resolve, 3200))

      return {
        deploymentUrl: new URL(payload.previewUrl, window.location.origin).href,
        message: '배포가 완료됐어요.',
      }
    },
  })
}
