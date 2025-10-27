import { Input, Tabs } from 'antd'
import React, { useState } from 'react'
import { RenderMarkdown } from './RenderMarkdown'

interface MarkdownEditorProps {
  onChange: (text: string) => void
  value: string
}

export default function MarkdownEditor(props: MarkdownEditorProps) {
  const [text, setText] = useState(props.value)

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value)
  }

  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab="Edit" key="1">
          <Input.TextArea
            placeholder="Enter markdown text"
            autoSize={{ minRows: 2, maxRows: 26 }}
            value={text}
            onChange={handleChange}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Preview" key="2">
          <RenderMarkdown source={text} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}
