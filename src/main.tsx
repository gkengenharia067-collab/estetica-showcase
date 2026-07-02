import { createRouter, RouterProvider } from '@tanstack/react-router'
import { createStart } from '@tanstack/react-start'
import { StrictMode } from 'react'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

const Start = createStart(() => (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
))

export default Start