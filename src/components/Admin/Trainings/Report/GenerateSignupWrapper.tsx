import React, {Component} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {Button, Checkbox, Popover } from 'antd'
import './GenerateReportWrapper.css'
import { AumtWeeklyTraining } from '../../../../types'
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import pdfUtil from '../../../../services/pdf.util'


interface GenerateSignupWrapperProps extends RouteComponentProps {
    form: AumtWeeklyTraining
}

interface GenerateSignupWrapperState {
    showDownloadSignup: boolean
    checkedList: CheckboxValueType[]
}

// This class exists because the pdfmake bundle is huge.
// It is loaded lazily only when needed, via code splitting


class GenerateSignupWrapper extends Component<GenerateSignupWrapperProps, GenerateSignupWrapperState> {
    constructor(props: GenerateSignupWrapperProps) {
        super(props)
        this.state = {
            showDownloadSignup: false,
            checkedList: []
        }
        console.log('props', this.props)
    }

    onDownloadClick = () => {
        pdfUtil.createSignupPdf(this.props.form,this.state.checkedList as string[])
    }

    onChange = (checkedValues: CheckboxValueType[]) => {
        console.log('checked = ', checkedValues);
        this.setState({
            ...this.state,
            checkedList: checkedValues,
        })
    };
    
    render() {
        return(
                <Popover placement = "leftTop" trigger='click' content={
                    <div>
                        <h2>{this.props.form.title}</h2>
                        <Checkbox.Group 
                            options={
                                Object.values(this.props.form.sessions)
                                .sort((a, b) => a.position - b.position)
                                .slice()
                                .map((session)=> {
                                    const x = {label: session.title, value: session.sessionId}
                                    return x})}
                            onChange={this.onChange}
                        />
                        <Button className='downloadSignup' type='primary' shape='round' onClick={this.onDownloadClick}>Download</Button>
                    </div>
                }>
                    <Button type='link'>Generate Signup Sheet</Button>
                </Popover>
    )}
}

export default withRouter(GenerateSignupWrapper)
