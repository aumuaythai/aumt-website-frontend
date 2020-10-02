import React, {Component, ReactNode} from 'react'
import './Marquee.css'

interface MarqueeProps {
    text: string | ReactNode
    scroll: boolean
}

export class Marquee extends Component<MarqueeProps> {
    render() {
        return (
            <span className="marqueeWrapper">
                <span className={`marqueeText ${this.props.scroll ? '' : 'noMarqueeScroll'}`}>{this.props.text}</span>
            </span>
        )
    }
}