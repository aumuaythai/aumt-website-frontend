import React, {Component,lazy, Suspense} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import { Button, Spin } from 'antd'
import './GenerateReportWrapper.css'
import { AumtWeeklyTraining } from '../../../../types'


interface GenerateReportWrapperProps extends RouteComponentProps {
    forms: AumtWeeklyTraining[]
}

interface GenerateReportWrapperState {
    showDownloadReport: boolean
}

// This class exists because the pdfmake bundle is huge.
// It is loaded lazily only when needed, via code splitting

const GenerateReportLazyWrapper = (
    lazy(() => (
      import('./GenerateReport' /* webpackChunkName: "report-wrapper" */)
    ))
  )

class GenerateReportWrapper extends Component<GenerateReportWrapperProps, GenerateReportWrapperState> {
    constructor(props: GenerateReportWrapperProps) {
        super(props)
        this.state = {
            showDownloadReport: false
        }
    }
    onGenerateClick = () => {
        this.setState({
            ...this.state,
            showDownloadReport: true
        })
    }
    
    render() {
        return this.state.showDownloadReport ?
                <Suspense fallback={
                    <div className='generateReportWrapperSuspense'>
                        <Spin className='reportWrapperLoadingSpin'/>
                    </div>
                    }>
                    <GenerateReportLazyWrapper forms={this.props.forms}></GenerateReportLazyWrapper>
                </Suspense>
                : <Button className='exportAllButton' type='link' onClick={this.onGenerateClick}>Generate Report</Button>
    }
}

export default withRouter(GenerateReportWrapper)
