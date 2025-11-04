import { Member } from '@/types'
import { notification } from 'antd'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    notification.success({ message: 'Copied' })
  } catch (err: any) {
    notification.error({ message: 'Text not copied: ' + err.toString() })
  }
}

export function getDisplayName(user: Member) {
  return (
    user.firstName +
    (user.preferredName ? ` "${user.preferredName}" ` : ' ') +
    user.lastName
  )
}

export function generateMockUid() {
  const alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm'
  let uid = 'NONMEMBER'
  for (let i = 0; i < 10; i++) {
    uid += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return uid
}
