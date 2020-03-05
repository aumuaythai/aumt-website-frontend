import React, {Component} from 'react'
import { Divider } from 'antd'
import './Faq.css'

export default class Faq extends Component {
    private  questions = [
        {
            q: 'When and where are trainings?',
            a: 'There is a 6:30 Beginners training and a 7:30 Advanced training every Thursday and Friday. Trainigs are held at the Hawk\'s Nest Gym, located at Level 3/492 Queen Street, Auckland CBD, Auckland 1010'
        },
        {
            q: 'blah blah?',
            a: 'bleh bleh bleh.'
        }
    ]
    render() {
        return (
            <div className='faqContainer'>
                {(() => {
                    return this.questions.map((question) => {
                        return (<div className="questionContainer">
                            <p className="question">Q: {question.q}</p>
                            <p className="answer">A: {question.a}</p>
                            <Divider/>
                        </div>)
                    })
                })()}
            </div>
        )
    }
}