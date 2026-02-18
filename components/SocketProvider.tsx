import useGlobalSocketListeners from '@/hooks/useGlobalSocketListeners'
import { SocketContext } from '@/util/SocketContext'
import React from 'react'

interface propType{
  children:React.ReactNode
}

export default function SocketProvider({children}:propType) {
  const socketState = useGlobalSocketListeners()

  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  )
}
