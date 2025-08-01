import 'firebase/analytics'
import firebase from 'firebase/app'

export const analytics = firebase.analytics()

export const logNotification = (notification: string): void => {
  analytics.logEvent('notification', { notification })
}
