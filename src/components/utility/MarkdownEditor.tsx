import { Input, Tabs } from 'antd'
import { TextAreaProps } from 'antd/lib/input'
import { RenderMarkdown } from './RenderMarkdown'

export default function MarkdownEditor(props: TextAreaProps) {
  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab="Edit" key="1">
          <Input.TextArea
            {...props}
            placeholder="Enter markdown text"
            autoSize={{ minRows: 2, maxRows: 26 }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Preview" key="2">
          <RenderMarkdown source={props.value?.toString() || ''} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}
