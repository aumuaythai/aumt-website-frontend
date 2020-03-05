import React, {Component} from 'react'
import { User } from 'firebase/app'
import * as firebase from 'firebase/app'
import { Menu, Dropdown } from 'antd';


interface SignupProps {
    authedUser: User
}

interface SignupData {
    
}

export default class Signups extends Component<SignupProps, object> {
    componentDidMount() {
        
    }
    render() {
        return (
            <div className='signupsContainer'>
                <div className="trainingContainer">
                    <p>There are no signups currently open</p>
                </div>
            </div>
        )
    }
}