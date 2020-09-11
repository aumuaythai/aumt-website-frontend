import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './RenderMarkdown.css'
/*
This class exists because ReactMarkdown has HTML support and other things that are unnecessary for this app
Installing ReactMarkdown installs 40 new packages, better to not have that bloat

Also as of writing this images don't render properly
https://github.com/rexxars/react-markdown/issues/265
*/

interface RenderMarkdownProps {
    source: string
}

interface RenderMarkdownState {
}

export class RenderMarkdown extends Component<RenderMarkdownProps, RenderMarkdownState> {
    constructor(props: RenderMarkdownProps) {
        super(props)
        this.state = {}
    }

    render() {
        const lines = this.props.source?.split('\n')
        if (!lines || !lines.length) {
            return ''
        }
        return (<div>
        </div>)
    }
}