import React, {Component,lazy, Suspense} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {Button, Checkbox, Popover, Spin} from 'antd'
import './GenerateReportWrapper.css'
import { AumtWeeklyTraining } from '../../../../types'
import type { CheckboxValueType } from 'antd/es/checkbox/Group';


interface GenerateSignupWrapperProps extends RouteComponentProps {
    form: AumtWeeklyTraining
}

interface GenerateSignupWrapperState {
    showDownloadSignup: boolean
    checkedList: CheckboxValueType[]
}

// This class exists because the pdfmake bundle is huge.
// It is loaded lazily only when needed, via code splitting
const GenerateSignupLazyWrapper = (
    lazy(() => (
      import('./GenerateSignup' /* webpackChunkName: "report-wrapper" */)
    ))
  )

class GenerateSignupWrapper extends Component<GenerateSignupWrapperProps, GenerateSignupWrapperState> {
    constructor(props: GenerateSignupWrapperProps) {
        super(props)
        this.state = {
            showDownloadSignup: false,
            checkedList: []
        }
    }

    

    onGenerateClick = () => {
        if (this.state.checkedList.length === 0) {
            return
        }
        this.setState({
            ...this.state,
            showDownloadSignup: true
        })
    }
    

    onChange = (checkedValues: CheckboxValueType[]) => {
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
                    <div>
                        {this.state.showDownloadSignup ?
                            <Suspense fallback={
                                <div className='generateReportWrapperSuspense'>
                                    <Spin className='reportWrapperLoadingSpin'/>
                                </div>
                                }>
                                <GenerateSignupLazyWrapper form={this.props.form} checkedList={this.state.checkedList as string[]}></GenerateSignupLazyWrapper>
                            </Suspense>
                            : 
                            <Button className='downloadSignup' type='primary' shape='round' onClick={this.onGenerateClick}>Generate Signups</Button>
                        }
                    </div>
                    
                    </div>
                }>
                    <Button type='primary'>Generate Signup Sheet &gt; </Button>
                </Popover>
    )}
}

export default withRouter(GenerateSignupWrapper)
