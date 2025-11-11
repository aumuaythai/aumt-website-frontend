import { User } from '@/types'
import { createContext, useContext } from 'react'

export const AuthContext = createContext<{
  user: User | null
  isLoading: boolean
}>({
  user: null,
  isLoading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}
