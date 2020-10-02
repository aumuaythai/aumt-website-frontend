import React, { Component } from 'react'
import marked from 'marked'

import './RenderMarkdown.css'
/*
This class exists because react-markdown has things that are unnecessary for this app
Installing ReactMarkdown installs 40 new packages, better to not have that bloat

Also as of writing this images aren't quite up to markdown spec, a polyfill was implemented above the class, see issue below
https://github.com/markedjs/marked/issues/339
*/

const renderer = new marked.Renderer();

const sanitize = (str: string) => {
  return str.replace(/&<"/g, (m) => {
    if (m === "&") return "&amp;"
    if (m === "<") return "&lt;"
    return "&quot;"
  })
}

renderer.image = (src, title, alt) => {
  const exec = /=\s*(\d*)\s*x\s*(\d*)\s*$/.exec(title || '')
  let res = '<img src="' + sanitize(src || '') + '" alt="' + sanitize(alt)
  if (exec && exec[1]) res += '" height="' + exec[1]
  if (exec && exec[2]) res += '" width="' + exec[2]
  return res + '">'
}

marked.setOptions({
    renderer: renderer
})

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

    getHtml = () => {
        return {__html: marked(this.props.source)}
    }

    render() {
        // const lines = this.props.source?.split('\n')
        // if (!lines || !lines.length) {
        //     return ''
        // }
        return <div dangerouslySetInnerHTML={this.getHtml()}></div>
    }
}