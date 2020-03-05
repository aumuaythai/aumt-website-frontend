import React, {Component} from 'react'
import { User } from 'firebase/app'
import * as firebase from 'firebase/app'
import { Menu, Dropdown } from 'antd';

interface SignupOption {
    id: string
    title: string
    occupied?: number
    limit?: number
}
interface SignupForm {
    title: string
    closes: number // UTC time
    options: SignupOption[]
}

interface SignupProps {
    authedUser: User
}

interface SignupState {
    forms: SignupForm[]
}

export default class Signups extends Component<SignupProps, object> {
    componentDidMount() {
        // fetch(activeForms)
    }
    render() {
        return (
            <div className='signupsContainer'>
                
            </div>
        )
    }
}