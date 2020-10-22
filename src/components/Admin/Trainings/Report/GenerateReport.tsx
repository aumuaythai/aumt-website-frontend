import React, {Component} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import { Button } from 'antd'
import { AumtWeeklyTraining } from '../../../../types'
import pdfUtil from '../../../../services/pdf.util'


interface GenerateReportProps extends RouteComponentProps {
    forms: AumtWeeklyTraining[]
}

interface GenerateReportState {}

class GenerateReport extends Component<GenerateReportProps, GenerateReportState> {
    onExportClick = () => {
        pdfUtil.createTrainingPdf(this.props.forms)
    }
    render() {
        return (
            <Button className='exportAllButton' type='link' onClick={this.onExportClick}>Download Report</Button>
        )
    }
}

export default withRouter(GenerateReport)
