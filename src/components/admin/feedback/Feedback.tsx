import React, {Component} from 'react'
import { Divider, Spin } from 'antd'
import './Feedback.css'
import { AumtWeeklyTraining } from '../../../types'
import AdminStore from '../AdminStore'


interface FeedbackProps {
    forms: AumtWeeklyTraining[]
}

interface FeedbackState {
    feedbackForms: AumtWeeklyTraining[]
    loadingForms: boolean
}

export class Feedback extends Component<FeedbackProps, FeedbackState> {
    constructor(props: FeedbackProps) {
        super(props)
        this.state = {
            feedbackForms: [],
            loadingForms: false
        }
    }
    componentDidMount() {
        if (!this.props.forms.length) {
            this.setState({...this.state, loadingForms: true})
            AdminStore.requestTrainings()
        } else {
            this.handleNewForms(this.props.forms)
        }
    }
    componentDidUpdate = (prevProps: FeedbackProps, prevState: FeedbackState) => {
        if (this.props.forms !== prevProps.forms) {
            this.setState({...this.state, loadingForms: false}, () => {
                this.handleNewForms(this.props.forms)
            })
        }
    }
    handleNewForms = (forms: AumtWeeklyTraining[]) => {
        const newForms = forms.slice().sort((a, b) => {
            return a.closes < b.closes ? 1 : -1
        })
        this.setState({
            ...this.state, 
            feedbackForms: newForms
        })
    }
    render() {
        if (this.state.loadingForms) {
            return (<div className='retrievingFeedbackText'>Retrieving feedback <Spin/></div>)
        }
        return (
            <div className='allFeedbackContainer'>
                {this.state.feedbackForms.map((form) => {
                    const feedback = form.feedback.reverse()
                    return (
                        <div key={form.trainingId}>
                            <h3>{form.title}</h3>
                            {feedback.length ? feedback.map((line, index) => {
                                return <p key={index}>{line}</p>
                            }) : <p>No Feedback</p>}
                            <Divider/>
                        </div>
                    )
                })}
                <div className="clearBoth"></div>
            </div>
        )
    }
}