import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { QuestionCircleOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import { Input, Tabs, Tooltip } from 'antd'
import './MarkdownEditor.css'

interface MarkdownEditorProps {
    onChange: (text: string) => void
    value: string
}

interface MarkdownEditorState {
}

export class MarkdownEditor extends Component<MarkdownEditorProps, MarkdownEditorState> {
    constructor(props: MarkdownEditorProps) {
        super(props)
    }
    private titleElement = <h4>Markdown Editor 
        <a href='https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet' target='_blank' rel='noopener noreferrer'>
            <Tooltip title="Click for a Guide on How to Use Markdown. Images won't resize for now">
                 <QuestionCircleOutlined/>
            </Tooltip>
        </a>
        </h4>
    render() {
        return <div className='markdownEditorContainer'>
            <Tabs tabBarExtraContent={this.titleElement}>
                <Tabs.TabPane tab='Edit' key='1'>
                    <Input.TextArea
                            placeholder='Enter markdown text'
                            autoSize={{ minRows: 2, maxRows: 26 }}
                            value={this.props.value}
                            onChange={e => this.props.onChange(e.target.value)}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='Preview' key='2'>
                    <ReactMarkdown source={this.props.value} skipHtml={true} linkTarget={'_blank'}></ReactMarkdown>
                </Tabs.TabPane>
            </Tabs>
        </div>
    }
}