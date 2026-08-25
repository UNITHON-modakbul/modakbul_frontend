import { createBrowserRouter } from 'react-router'
import App from '../App.tsx'
import { ProjectStartPage } from '../features/project/pages/ProjectStartPage.tsx'
import { RequirementsReviewPage } from '../features/requirements/pages/RequirementsReviewPage.tsx'
import { NotFoundPage } from './NotFoundPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <ProjectStartPage />,
      },
      {
        path: 'requirements/review',
        element: <RequirementsReviewPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
