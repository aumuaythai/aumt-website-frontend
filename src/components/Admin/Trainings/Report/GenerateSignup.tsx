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
                <Button className='exportAllButton' type='link' onClick={this.onExportClick}>Download Signup</Button>
        )
    }
}

export default withRouter(GenerateSignup)
