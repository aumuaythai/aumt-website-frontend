import { analytics } from './firebase'

export const logNotification = (notification: string): void => {
  analytics.logEvent('notification', { notification })
}
