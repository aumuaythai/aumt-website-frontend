import { Spin } from 'antd'

export default function LoadingPage({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 px-6 py-16 text-center">
      <p className="text-gray-800 text-xl font-medium">{text}</p>
      <Spin />
    </div>
  )
}
