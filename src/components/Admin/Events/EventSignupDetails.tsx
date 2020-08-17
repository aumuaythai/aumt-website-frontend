import React, {Component} from 'react'
import { notification } from 'antd'
import './EventSignupDetails.css'
import { TableRow } from '../../../types'
import db from '../../../services/db'



interface EventSignupDetailsProps {
    selectedRow: TableRow
    isWaitlist: boolean
    eventId: string
}

interface EventSignupDetailsState {
}

export class EventSignupDetails extends Component<EventSignupDetailsProps, EventSignupDetailsState> {
    constructor(props: EventSignupDetailsProps) {
        super(props)
        this.state = {}
    }

    updateConfirmed = (row: TableRow | null, newConfirmed: boolean) => {
        if (!row) {
            return
        }
        db.confirmMemberEventSignup(this.props.eventId, row.key, newConfirmed, this.props.isWaitlist)
            .then(() => {
                notification.success({message: `Updated confirmed for ${row.displayName} to ${newConfirmed ? 'Yes' : 'No'}`})
            })
            .catch((err) => {
                notification.error({message: `Error confirming signup: ${err.toString()}`})
            })
    }
    render() {
        console.log(this.props.selectedRow)
        return (
            <div className="eventSignupDetailsContainer">
                <h3 className='esDetailHeader'>Contact</h3>
                <p><span className='esDetailLab'>Name: </span>
                    {this.props.selectedRow.displayName} 
                </p>
                <p><span className='esDetailLab'>Email: </span>
                    {this.props.selectedRow.email} 
                </p>
                <p><span className='esDetailLab'>Phone: </span>
                    {this.props.selectedRow.phoneNumber} 
                </p>
                <h3 className='esDetailHeader'>Info</h3>
                <p><span className='esDetailLab'>Paid: </span>
                    {this.props.selectedRow.confirmed ? 'Yes' : 'No'}
                </p>
                <p><span className='esDetailLab'>Dietary Reqs: </span>
                    {this.props.selectedRow.dietaryRequirements || 'None'}
                </p>
                <p><span className='esDetailLab'>Medical Info: </span>
                    {this.props.selectedRow.medicalInfo || 'None'}
                </p>
                <p><span className='esDetailLab'>License: </span>
                    {this.props.selectedRow.driverLicenseClass || 'None'}
                </p>
                <p><span className='esDetailLab'>Owns a Car?, Seats: </span>
                    {(this.props.selectedRow.seatsInCar && this.props.selectedRow.seatsInCar > -1) ? `Yes, ${this.props.selectedRow.seatsInCar}` : 'No'}
                </p>
                <h3 className='esDetailHeader'>Emergency Contact</h3>
                <p><span className='esDetailLab'>Name: </span>
                    {this.props.selectedRow.ecName || 'None'}
                </p>
                <p><span className='esDetailLab'>Phone: </span>
                    {this.props.selectedRow.ecPhoneNumber || 'None'}
                </p>
                <p><span className='esDetailLab'>Relation: </span>
                    {this.props.selectedRow.ecRelation || 'None'}
                </p>
            </div>
        )
    }
}