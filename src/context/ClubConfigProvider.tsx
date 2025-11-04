import { useConfig as useConfigService } from '@/services/config'

import { useQuery } from '@tanstack/react-query'
import { notification } from 'antd'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { getClubConfig } from '../services/db'
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
