import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/developers/')({
  beforeLoad: () => {
    throw redirect({
      to: '/developers/api',
      replace: true
    })
  }
})
