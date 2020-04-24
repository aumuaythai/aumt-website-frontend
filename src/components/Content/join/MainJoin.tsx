import React, {Component} from 'react'
import { JoinForm } from './JoinForm'
import './MainJoin.css'

interface MainJoinProps {}

interface MainJoinState {}

export class MainJoin extends Component<MainJoinProps, MainJoinState> {
    render() {
        return (
            <div>
                <JoinForm></JoinForm>
            </div>
        )
    }
}