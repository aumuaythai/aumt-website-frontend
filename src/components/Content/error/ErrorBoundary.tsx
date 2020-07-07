import React, {Component, ErrorInfo} from 'react'
import { Divider } from 'antd'
import './ErrorBoundary.css'

interface ErrorBoundaryProps {
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        }
    }
    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log({ error, errorInfo });
        this.setState({
            hasError: true,
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        return this.state.hasError ? (
            <div>
                <h1>An error occurred</h1>
                <p>Please check your network connection and refresh.</p>
                <p> If you have a spare moment and would like to help AUMT with their website, send a screenshot to the committee and let them know what happened :) </p>
                <Divider/>
                <div className="errorBoundaryErrorDisplayContainer">
                    {JSON.stringify(this.state.error)}
                    <br/>
                    {JSON.stringify(this.state.errorInfo)}
                </div>
            </div>
        ) : 
        this.props.children
    }
}