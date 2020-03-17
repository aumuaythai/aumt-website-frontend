import React, {Component} from 'react'
import { Button, Input, DatePicker } from 'antd'
import './CreateTraining.css'


interface CreateTrainingProps {
}

interface CreateTrainingState {
    currentTitle: string
    currentOpens: Date
    currentCloses: Date
}

export class CreateTraining extends Component<CreateTrainingProps, CreateTrainingState> {
    onOpenDateChange = (d: Date | undefined) => {
        if (d) {
            this.setState({
                ...this.state,
                currentOpens: d
            })
        }
    }
    onClosesDateChange = (e: any) => {
        console.log(e, typeof(e))
    }
    onTrainingTitleChange = (e: any) => {
        console.log(e)
    }
    render() {
        return (
            <div className='createTrainingContainer'>
                <p className="formItemTitle">Title</p>
                <Input onChange={e => this.onTrainingTitleChange(e.target.value)}></Input>
                <p className="formItemTitle">Opens</p>
                <DatePicker showTime onChange={d => this.onOpenDateChange(d?.toDate())} />
                <p className="formItemTitle">Closes</p>
                <DatePicker showTime onChange={d => this.onClosesDateChange(d?.toDate())} />
            </div>
        )
    }
}