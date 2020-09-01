import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { QuestionCircleOutlined } from '@ant-design/icons'
/*
TODO: write own markdown parser for headings, text styling, links and images
ReactMarkdown has HTML support and other things that are unnecessary for this app
Installing ReactMarkdown installs 40 new packages, better to not have that bloat

Also see here
https://github.com/rexxars/react-markdown/issues/265
*/
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
    // TODO: add history for ctrl Z functionality
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