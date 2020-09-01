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

const UNDO_AVAILABLE = false

export class MarkdownEditor extends Component<MarkdownEditorProps, MarkdownEditorState> {
    private currentText: string = ''
    private textHistory: string[] = []
    private textFuture: string[] = []
    private titleElement = <h4>Markdown Editor 
            <a href='https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet' target='_blank' rel='noopener noreferrer'>
                <Tooltip title="Click for a Guide on How to Use Markdown. Images won't resize for now">
                    <QuestionCircleOutlined/>
                </Tooltip>
            </a>
        </h4>

    constructor(props: MarkdownEditorProps) {
        super(props)
        this.currentText = this.props.value
    }

    componentWillUnmount = () => {
        if (UNDO_AVAILABLE) {
            document.removeEventListener('keydown', this.keydownListener)
        }
    }
    
    onInputFocus = () => {
        if (UNDO_AVAILABLE) {
            document.addEventListener('keydown', this.keydownListener)
        }
    }
    onInputBlur = () => {
        if (UNDO_AVAILABLE) {
            document.removeEventListener('keydown', this.keydownListener)
        }
    }
    keydownListener = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'z') {
            this.undo()
        } else if (event.ctrlKey && event.key === 'Z') {
            this.redo()
        }
    }
    undo = () => {
        const prevText = this.textHistory.pop()
        if (prevText !== undefined) {
            this.textFuture.unshift(this.currentText)
            this.currentText = prevText
            this.props.onChange(prevText)
        }
    }
    redo = () => {
        const futureText = this.textFuture.shift()
        if (futureText) {
            this.textHistory.push(this.currentText)
            this.currentText = futureText
            this.props.onChange(futureText)
        }
    }
    onChange = (text: string) => {
        if (UNDO_AVAILABLE) {
            this.textFuture = []
            this.textHistory.push(this.currentText)
            this.currentText = text
        }
        this.props.onChange(text)
    }
    render() {
        return <div className='markdownEditorContainer'>
            <Tabs tabBarExtraContent={this.titleElement}>
                <Tabs.TabPane tab='Edit' key='1'>
                    <Input.TextArea
                            onFocus={this.onInputFocus}
                            onBlur={this.onInputBlur}
                            placeholder='Enter markdown text'
                            autoSize={{ minRows: 2, maxRows: 26 }}
                            value={this.props.value}
                            onChange={e => this.onChange(e.target.value)}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab='Preview' key='2'>
                    <ReactMarkdown source={this.props.value} skipHtml={true} linkTarget={'_blank'}></ReactMarkdown>
                </Tabs.TabPane>
            </Tabs>
        </div>
    }
}