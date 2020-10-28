import React, {Component} from 'react'
import { notification, Button } from 'antd'
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
        return (
            <div className="eventSignupDetailsContainer">
                <div className="eventSignupDetailsSection">
                    <h3 className='esDetailHeader'>Contact</h3>
                    <table className="eventSignupDetailTable">
                        <tbody>
                            <tr>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Name: </span>
                                </td>
                                <td className='esDetailData'>
                                    {this.props.selectedRow.displayName} 
                                </td>
                            </tr>
                            <tr>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Email: </span>
                                </td>
                                <td className='esDetailData'>
                                    {this.props.selectedRow.email} 
                                </td>
                            </tr>
                            <tr>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Phone: </span>
                                </td>
                                <td className='esDetailData'>
                                    {this.props.selectedRow.phoneNumber} 
                                </td>
                            </tr>
                            <tr>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Staying: </span>
                                </td>
                                <td className='esDetailData'>
                                    {this.props.selectedRow.daysStaying} 
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="eventSignupDetailsSection">
                    <h3 className='esDetailHeader'>Info</h3>
                    <table className="eventSignupDetailTable">
                        <tbody>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Paid: </span>
                                </td>
                                <td className='esDetailData'>
                                {this.props.selectedRow.confirmed ? 'Yes' : 'No'}
                                    <Button 
                                        type='link'
                                        onClick={e => this.updateConfirmed(this.props.selectedRow, !this.props.selectedRow?.confirmed)}>Change</Button>
                                    </td>
                            </tr>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Dietary Reqs: </span>
                                </td>
                                <td className='esDetailData'>
                                    {this.props.selectedRow.dietaryRequirements || 'None'}
                                </td>
                            </tr>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Medical Info: </span>
                                </td>
                                <td className='esDetailData'>
                                    {this.props.selectedRow.medicalInfo || 'None'}
                                </td>
                            </tr>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Knows First Aid: </span>
                                </td>
                                <td className='esDetailData'>
                                    {this.props.selectedRow.medicalInfo ? 'Yes' : 'No'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="eventSignupDetailsSection">
                    <h3 className='esDetailHeader'>Car</h3>
                    <table className="eventSignupDetailTable">
                        <tbody>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>License: </span>
                                </td>
                                <td className="ecDetailData">
                                    {this.props.selectedRow.driverLicenseClass || 'None'}
                                </td>
                            </tr>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Owns Car?, Seats: </span>
                                </td>
                                <td className="ecDetailData">
                                    {(this.props.selectedRow.seatsInCar && this.props.selectedRow.seatsInCar > -1) ? `Yes, ${this.props.selectedRow.seatsInCar}` : 'No'}
                                </td>
                            </tr>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Model: </span>
                                </td>
                                <td className="ecDetailData">
                                    {this.props.selectedRow.carModel || 'None'}
                                </td>
                            </tr>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Insurance: </span>
                                </td>
                                <td className="ecDetailData">
                                    {this.props.selectedRow.insuranceDescription || 'None'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="eventSignupDetailsSection">
                    <h3 className='esDetailHeader'>Emergency Contact</h3>
                    <table className="eventSignupDetailTable">
                        <tbody>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Name: </span>
                                </td>
                                <td className="ecDetailData">
                                    {this.props.selectedRow.ecName || 'None'}
                                </td>
                            </tr>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Phone: </span>
                                </td>
                                <td className="ecDetailData">
                                    {this.props.selectedRow.ecPhoneNumber || 'None'}
                                </td>
                            </tr>
                            <tr className='esDetailLine'>
                                <td className='esDetailLabel'>
                                    <span className='esDetailTitle'>Relation: </span>
                                </td>
                                <td className="ecDetailData">
                                    {this.props.selectedRow.ecRelation || 'None'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}