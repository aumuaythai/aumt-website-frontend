import { useConfig as useConfigService } from '@/services/config'
import { createContext, ReactNode, useContext } from 'react'
import { ClubConfig } from '../types'

const ConfigContext = createContext<ClubConfig | undefined>(undefined)

export function useConfig() {
  const context = useContext(ConfigContext)
  return context
}

export default function ClubConfigProvider({
  children,
}: {
  children: ReactNode
}) {
  const { data: clubConfig } = useConfigService()

  return (
    <ConfigContext.Provider value={clubConfig}>
      {children}
    </ConfigContext.Provider>
  )
}
