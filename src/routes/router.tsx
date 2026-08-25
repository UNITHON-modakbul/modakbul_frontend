import { createBrowserRouter } from 'react-router'
import App from '../App.tsx'
import { NotFoundPage } from './NotFoundPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
