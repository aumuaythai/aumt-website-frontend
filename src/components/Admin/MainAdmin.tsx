import React, {Component} from 'react'
import { CreateTraining } from './CreateTraining'
import './MainAdmin.css'


interface MainAdminProps {
}

interface MainAdminState {
    creatingTraining: boolean;
}

export class MainAdmin extends Component<MainAdminProps, MainAdminState> {
    constructor(props: MainAdminProps) {
        super(props)
        this.state = {
            creatingTraining: false
        }
    }
    toggleCreatingTraining = () => {this.setState({...this.state, creatingTraining: !this.state.creatingTraining})}

    render() {
        return (
            <div className='adminContainer'>
                <h3>Signup Forms</h3>
                <CreateTraining></CreateTraining>
                
                <h3>Events</h3>
            </div>
        )
    }
}