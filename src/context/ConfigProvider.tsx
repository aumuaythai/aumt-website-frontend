import { notification } from 'antd'
import { createContext, ReactNode, useEffect, useState } from 'react'
import DB from '../services/db'
import { ClubConfig } from '../types'

const ConfigContext = createContext<{
  clubConfig: ClubConfig | null
}>({
  clubConfig: null,
})

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
        const config = await DB.getClubConfig()
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
    <ConfigContext.Provider value={{ clubConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}
