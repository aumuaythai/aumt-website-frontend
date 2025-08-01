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

const ConfigContext = createContext<{
  clubConfig: ClubConfig | null
  clubSignupStatus: 'open' | 'closed' | 'loading'
  clubSignupSem: 'S1' | 'S2' | 'loading' | 'SS'
}>({
  clubConfig: null,
  clubSignupStatus: 'loading',
  clubSignupSem: 'loading',
})

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }

  return context
}

export default function ConfigProvider({ children }: { children: ReactNode }) {
  const [clubSignupStatus, setClubSignupStatus] = useState<
    'open' | 'closed' | 'loading'
  >('loading')
  const [clubSignupSem, setClubSignupSem] = useState<
    'S1' | 'S2' | 'loading' | 'SS'
  >('loading')
  const [clubConfig, setClubConfig] = useState<ClubConfig | null>(null)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const config = await getClubConfig()
        setClubConfig(config)
      } catch (err) {
        notification.error({
          message: 'Failed to get website config: ' + err.toString(),
        })
      }
    }

    fetchConfig()
  }, [])

  return (
    <ConfigContext.Provider
      value={{ clubConfig, clubSignupStatus, clubSignupSem }}
    >
      {children}
    </ConfigContext.Provider>
  )
}
