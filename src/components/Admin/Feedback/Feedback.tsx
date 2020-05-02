import React, {Component} from 'react'
import { notification, List, Spin } from 'antd'
import './Feedback.css'
import { AumtWeeklyTraining } from '../../../types'
import db from '../../../services/db'


interface FeedbackProps {
}

interface FeedbackState {
    forms: AumtWeeklyTraining[]
    loadingForms: boolean
}

export class Feedback extends Component<FeedbackProps, FeedbackState> {
    constructor(props: FeedbackProps) {
        super(props)
        this.state = {
            forms: [],
            loadingForms: false
        }
    }
    componentDidMount() {
        this.setState({
            ...this.state,
            loadingForms: true
        })
        db.getAllForms()
            .then((forms) => {
                forms.sort((a, b) => {
                    return a.closes < b.closes ? 1 : -1
                })
                this.setState({
                    ...this.state, 
                    forms: forms,
                    loadingForms: false
                })
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    forms: [],
                    loadingForms: false
                })
                notification.error({message: 'Error loading feedback: ' + err.toString()})
            })
    }
    render() {
        if (this.state.loadingForms) {
            return (<div className='retrievingFeedbackText'>Retrieving feedback <Spin/></div>)
        }
        return (
            <div className='allFeedbackContainer'>
                {this.state.forms.map((form) => {
                    const feedback = form.feedback.reverse()
                    return (
                        <List
                            key={form.trainingId}
                            className='feedbackListObject'
                            bordered
                            header={<h4 className='feedbackListTitle'>{form.title}</h4>}
                            dataSource={feedback}
                            renderItem={item => {
                                return <List.Item>{item}</List.Item>
                            }}
                        />
                    )
                })}
                <div className="clearBoth"></div>
            </div>
        )
    }
}