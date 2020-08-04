import React, { Component } from 'react'
import './FirstTimeLogin.css'
import { ResetPasswordLink } from '../Header/ResetLink'

export interface FirstTimeLoginProps {

}
export interface FirstTimeLoginState {}


export class FirstTimeLogin extends Component<FirstTimeLoginProps, FirstTimeLoginState> {
    constructor(props: FirstTimeLoginProps) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="firstTimeLoginContainer">
                <h3 className='firstTimeLoginHeader'>Already joined in Sem 1?</h3>
                <p className='joinedMemberText'>We've created accounts for everyone who signed up in Sem 1 2020 and still has an active membership.
                    All you need to do is <ResetPasswordLink text=' reset your password '></ResetPasswordLink> to confirm your membership for Sem 2!</p>
            </div>
        )
    }
}

