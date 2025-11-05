import { Button, notification } from 'antd'
import { TableRow } from '../../../types'
import './EventSignupDetails.css'

interface EventSignupDetailsProps {
  selectedRow: TableRow
  isWaitlist: boolean
  eventId: string
}

export default function EventSignupDetails(props: EventSignupDetailsProps) {
  function updateConfirmed(row: TableRow | null, newConfirmed: boolean) {
    // if (!row) {
    //   return
    // }
    // confirmMemberEventSignup(
    //   props.eventId,
    //   row.key,
    //   newConfirmed,
    //   props.isWaitlist
    // )
    //   .then(() => {
    //     notification.success({
    //       message: `Updated confirmed for ${row.displayName} to ${
    //         newConfirmed ? 'Yes' : 'No'
    //       }`,
    //     })
    //   })
    //   .catch((err) => {
    //     notification.error({
    //       message: `Error confirming signup: ${err.toString()}`,
    //     })
    //   })
  }

  return (
    <div className="eventSignupDetailsContainer">
      <div className="eventSignupDetailsSection">
        <h3 className="esDetailHeader">Contact</h3>
        <table className="eventSignupDetailTable">
          <tbody>
            <tr>
              <td className="esDetailLabel">
                <span className="esDetailTitle">Name: </span>
              </td>
              <td className="esDetailData">{props.selectedRow.displayName}</td>
            </tr>
            <tr>
              <td className="esDetailLabel">
                <span className="esDetailTitle">Email: </span>
              </td>
              <td className="esDetailData">{props.selectedRow.email}</td>
            </tr>
            <tr>
              <td className="esDetailLabel">
                <span className="esDetailTitle">Phone: </span>
              </td>
              <td className="esDetailData">{props.selectedRow.phoneNumber}</td>
            </tr>
            <tr>
              <td className="esDetailLabel">
                <span className="esDetailTitle">Staying: </span>
              </td>
              <td className="esDetailData">{props.selectedRow.daysStaying}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="eventSignupDetailsSection">
        <h3 className="esDetailHeader">Info</h3>
        <table className="eventSignupDetailTable">
          <tbody>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Paid: </span>
              </td>
              <td className="esDetailData">
                {props.selectedRow.confirmed ? 'Yes' : 'No'}
                <Button
                  type="link"
                  onClick={(e) =>
                    updateConfirmed(
                      props.selectedRow,
                      !props.selectedRow?.confirmed
                    )
                  }
                >
                  Change
                </Button>
              </td>
            </tr>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Dietary Reqs: </span>
              </td>
              <td className="esDetailData">
                {props.selectedRow.dietaryRequirements || 'None'}
              </td>
            </tr>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Medical Info: </span>
              </td>
              <td className="esDetailData">
                {props.selectedRow.medicalInfo || 'None'}
              </td>
            </tr>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Knows First Aid: </span>
              </td>
              <td className="esDetailData">
                {props.selectedRow.medicalInfo ? 'Yes' : 'No'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="eventSignupDetailsSection">
        <h3 className="esDetailHeader">Car</h3>
        <table className="eventSignupDetailTable">
          <tbody>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">License: </span>
              </td>
              <td className="ecDetailData">
                {props.selectedRow.driverLicenseClass || 'None'}
              </td>
            </tr>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Owns Car?, Seats: </span>
              </td>
              <td className="ecDetailData">
                {props.selectedRow.seatsInCar &&
                props.selectedRow.seatsInCar > -1
                  ? `Yes, ${props.selectedRow.seatsInCar}`
                  : 'No'}
              </td>
            </tr>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Model: </span>
              </td>
              <td className="ecDetailData">
                {props.selectedRow.carModel || 'None'}
              </td>
            </tr>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Insurance: </span>
              </td>
              <td className="ecDetailData">
                {props.selectedRow.insuranceDescription || 'None'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="eventSignupDetailsSection">
        <h3 className="esDetailHeader">Emergency Contact</h3>
        <table className="eventSignupDetailTable">
          <tbody>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Name: </span>
              </td>
              <td className="ecDetailData">
                {props.selectedRow.ecName || 'None'}
              </td>
            </tr>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Phone: </span>
              </td>
              <td className="ecDetailData">
                {props.selectedRow.ecPhoneNumber || 'None'}
              </td>
            </tr>
            <tr className="esDetailLine">
              <td className="esDetailLabel">
                <span className="esDetailTitle">Relation: </span>
              </td>
              <td className="ecDetailData">
                {props.selectedRow.ecRelation || 'None'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
