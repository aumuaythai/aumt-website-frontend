import React, {Component} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import { Button } from 'antd'
import { AumtWeeklyTraining } from '../../../../types'
import pdfUtil from '../../../../services/pdf.util'


interface GenerateSignupProps extends RouteComponentProps {
    form: AumtWeeklyTraining
    checkedList: string[]
}

interface GenerateSignupState {}

class GenerateSignup extends Component<GenerateSignupProps, GenerateSignupState> {
    onExportClick = () => {
        pdfUtil.createSignupPdf(this.props.form,this.props.checkedList)
    }
    render() {
        return (
                <Button className='downloadSignup' type='primary' shape='round' onClick={this.onExportClick}>Download Signups</Button>
        )
    }
}

export default withRouter(GenerateSignup)
