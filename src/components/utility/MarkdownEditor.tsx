import React, { Component } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Input, Tabs, Popover } from 'antd'
import './MarkdownEditor.css'
import { RenderMarkdown } from './RenderMarkdown'

interface MarkdownEditorProps {
    onChange: (text: string) => void
    value: string
}

interface MarkdownEditorState {
}

const UNDO_AVAILABLE = true
const MAX_HISTORY = 20

export class MarkdownEditor extends Component<MarkdownEditorProps, MarkdownEditorState> {
    private currentText: string = ''
    private textHistory: string[] = []
    private textFuture: string[] = []
    private titleElement = <h4>Markdown Editor 
                <Popover content={
                    <div>
                        <p>Click <a rel='noopener noreferrer' target='_blank' href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"> here </a>
                            for a guide on Markdown.</p>
                        <p>To add images use the following format: </p>
                        <p>![title](url "=widthxheight") e.g.</p>
                        <p>![tom](https://aumt.co.nz/photos/tom.jpg "=100x100")</p>
                    </div>
                }>
                    <QuestionCircleOutlined/>
                </Popover>
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
            if (MAX_HISTORY < this.textHistory.length) {
                this.textHistory.shift()
            }
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
                    <RenderMarkdown source={this.props.value}></RenderMarkdown>
                </Tabs.TabPane>
            </Tabs>
        </div>
    }
}