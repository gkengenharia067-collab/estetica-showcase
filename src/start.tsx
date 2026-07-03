import { RouterProvider } from '@tanstack/react-router'
import { createStart } from '@tanstack/react-start'
import { StrictMode } from 'react'
import { getRouter } from './router'

const router = getRouter()

const Start = createStart(() => (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
))

export default Start