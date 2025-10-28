import { Input, Tabs } from 'antd'
import React, { useState } from 'react'
import { RenderMarkdown } from './RenderMarkdown'

interface MarkdownEditorProps {
  onChange: (text: string) => void
  value: string
}

export default function MarkdownEditor(props: MarkdownEditorProps) {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    props.onChange(e.target.value)
  }

  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab="Edit" key="1">
          <Input.TextArea
            placeholder="Enter markdown text"
            autoSize={{ minRows: 2, maxRows: 26 }}
            value={props.value}
            onChange={handleChange}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Preview" key="2">
          <RenderMarkdown source={props.value} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}
