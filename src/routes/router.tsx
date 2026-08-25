import { createBrowserRouter } from 'react-router'
import App from '../App.tsx'
import { ProjectDashboardPage } from '../features/project/pages/ProjectDashboardPage.tsx'
import { ProjectPreviewPage } from '../features/project/pages/ProjectPreviewPage.tsx'
import { ProjectStartPage } from '../features/project/pages/ProjectStartPage.tsx'
import { RequirementsReviewPage } from '../features/requirements/pages/RequirementsReviewPage.tsx'
import { RevisionRequestPage } from '../features/revision/pages/RevisionRequestPage.tsx'
import { NotFoundPage } from './NotFoundPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <ProjectDashboardPage />,
      },
      {
        path: 'projects/new',
        element: <ProjectStartPage />,
      },
      {
        path: 'requirements/review',
        element: <RequirementsReviewPage />,
      },
      {
        path: 'projects/:projectId/requirements/review',
        element: <RequirementsReviewPage />,
      },
      {
        path: 'projects/:projectId/preview',
        element: <ProjectPreviewPage />,
      },
      {
        path: 'projects/:projectId/revisions/new',
        element: <RevisionRequestPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
