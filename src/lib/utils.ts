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
