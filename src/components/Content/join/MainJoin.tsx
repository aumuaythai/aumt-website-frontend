import React, {Component} from 'react'
import { JoinForm } from './JoinForm'
import './MainJoin.css'
import { AumtMember } from '../../../types'

interface MainJoinProps {
    authedUser: AumtMember | null
    authedUserId: string
}

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