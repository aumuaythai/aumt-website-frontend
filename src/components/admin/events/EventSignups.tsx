// import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
// import { Button, Input, notification, Spin } from 'antd'
// import React, { Component } from 'react'
// import { Link, RouteComponentProps, withRouter } from 'react-router'
// import { signUpToEvent } from '../../../services/db'
// import { AumtCampSignupData, AumtEvent } from '../../../types'
// import { CampSignupForm } from '../../content/events/CampSignupForm'
// import AdminStore from '../AdminStore'
// import './EventSignups.css'
// import { EventSignupTable } from './EventSignupTable'

// interface EventSignupsProps extends RouteComponentProps {
//   events: AumtEvent[]
// }

// interface EventSignupsState {
//   event: AumtEvent | null
//   loadingEvents: boolean
//   addingMember: boolean
//   addingWaitlistMember: boolean
//   submittingMember: boolean
//   submittingWaitlistMember: boolean
// }

// class EventSignups extends Component<EventSignupsProps, EventSignupsState> {
//   constructor(props: EventSignupsProps) {
//     super(props)
//     this.state = {
//       event: null,
//       loadingEvents: false,
//       addingMember: false,
//       addingWaitlistMember: false,
//       submittingMember: false,
//       submittingWaitlistMember: false,
//     }
//   }

//   generateMockUid = () => {
//     const alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm'
//     let uid = 'NONMEMBER'
//     for (let i = 0; i < 10; i++) {
//       uid += alphabet[Math.floor(Math.random() * alphabet.length)]
//     }
//     return uid
//   }

//   componentDidMount = () => {
//     if (!this.props.events.length) {
//       this.setState({ ...this.state, loadingEvents: true })
//       AdminStore.requestEvents()
//     } else {
//       this.handleNewEvents(this.props.events)
//     }
//   }

//   componentDidUpdate = (
//     prevProps: EventSignupsProps,
//     prevState: EventSignupsState
//   ) => {
//     if (this.props.events !== prevProps.events) {
//       this.setState({ ...this.state, loadingEvents: false }, () => {
//         this.handleNewEvents(this.props.events)
//       })
//     }
//   }

//   handleNewEvents = (events: AumtEvent[]) => {
//     const paths = window.location.pathname.split('/')
//     const pathEventIdx = paths.indexOf('events')
//     if (pathEventIdx > -1) {
//       const eventId = paths[pathEventIdx + 1]
//       const foundEvent = events.find((e) => e.id === eventId)
//       if (foundEvent) {
//         this.setState({
//           ...this.state,
//           event: foundEvent,w
//         })
//       } else {
//         notification.error({
//           message:
//             'Error retrieving event for id ' +
//             eventId +
//             ', redirecting to dashboard',
//         })
//         this.props.history.push('/admin/events')
//       }
//     }
//   }

//   addMemberClick = () => {
//     this.setState({ ...this.state, addingMember: true })
//   }

//   onCancelAddMember = () => {
//     this.setState({ ...this.state, addingMember: false })
//   }

//   addWaitlistMemberClick = () => {
//     this.setState({ ...this.state, addingWaitlistMember: true })
//   }

//   onCancelAddWaitlistMember = () => {
//     this.setState({ ...this.state, addingWaitlistMember: false })
//   }

//   signUpNewMember = (signupData: AumtCampSignupData, isWaitlist: boolean) => {
//     if (!signupData.name) {
//       return notification.error({ message: 'Name required' })
//     }
//     if (!signupData.email) {
//       return notification.error({ message: 'Email required' })
//     }
//     if (!this.state.event) {
//       return
//     }
//     if (isWaitlist) {
//       this.setState({ ...this.state, submittingWaitlistMember: true })
//     } else {
//       this.setState({ ...this.state, submittingMember: true })
//     }

//     signUpToEvent(
//       this.state.event?.id,
//       this.generateMockUid(),
//       Object.assign(signupData, {
//         confirmed: false,
//         timeSignedUpMs: new Date().getTime(),
//         displayName: signupData.name,
//         email: signupData.email,
//       }),
//       isWaitlist
//     )
//       .then(() => {
//         notification.success({
//           message: `Successfully signed up ${signupData.name}`,
//         })
//       })
//       .catch((err) => {
//         notification.error({
//           message: `Error signing up to event: ${err.toString()}`,
//         })
//       })
//       .finally(() => {
//         if (isWaitlist) {
//           this.setState({
//             ...this.state,
//             submittingWaitlistMember: false,
//             addingWaitlistMember: false,
//           })
//         } else {
//           this.setState({
//             ...this.state,
//             submittingMember: false,
//             addingMember: false,
//           })
//         }
//       })
//   }

//   render() {
//     if (this.state.loadingEvents) {
//       return (
//         <div className="eventSignupsSpinContainer">
//           <Spin />
//         </div>
//       )
//     }
//     if (!this.state.event || !this.state.event.signups) {
//       return <div>No event with signups found</div>
//     }
//     return (
//       <div className="eventSignupsContainer">
//         <div className="eventSignupsHeaderContainer">
//           <h1 className="eventSignupsHeader">
//             <Link className="mx-1.5" to="/admin/events">
//               <ArrowLeftOutlined />
//             </Link>
//             {this.state.event.title}
//           </h1>
//           <div className="eventSignupsHeaderButtons">
//             <Link to={`/admin/editevent/${this.state.event.id}`}>
//               <Button>Edit Event</Button>
//             </Link>
//           </div>
//         </div>
//         <div className="clearBoth"></div>
//         <div className="eventSignupsMemberDisplaySection">
//           <div className="eventSignupMemberDisplayHeader">
//             <h3 className="eventSignupMemberDisplayTitle">Signups</h3>
//             <Button
//               className="eventSignupMemberDisplayAddButton"
//               type="primary"
//               shape="round"
//               onClick={this.addMemberClick}
//             >
//               <PlusOutlined />
//               Add Member
//             </Button>
//             <p className="eventSignupMemberDisplayTotalText">
//               Total: {Object.keys(this.state.event.signups.members).length} /{' '}
//               {this.state.event.signups.limit}
//             </p>
//             <div className="clearBoth"></div>
//             {this.state.addingMember ? (
//               <div className="eventSignupsAddMemberContainer">
//                 <Button onClick={this.onCancelAddMember}>Cancel</Button>
//                 <CampSignupForm
//                   isCamp={this.state.event.signups.isCamp}
//                   onSubmit={(data) => this.signUpNewMember(data, false)}
//                   isWaitlist={false}
//                   includeNameAndEmail={true}
//                   submitting={this.state.submittingMember}
//                 ></CampSignupForm>
//               </div>
//             ) : null}
//             <EventSignupTable
//               urlPath={this.state.event.urlPath}
//               isWaitlist={false}
//               eventId={this.state.event.id}
//               signupData={this.state.event.signups.members}
//               isCamp={this.state.event.signups.isCamp}
//               limit={this.state.event.signups.limit}
//             ></EventSignupTable>
//           </div>
//         </div>
//         <div className="clearBoth"></div>
//         <div className="eventSignupsMemberDisplaySection">
//           <div className="eventSignupMemberDisplayHeader">
//             <h3 className="eventSignupMemberDisplayTitle">Waitlist</h3>
//             <Button
//               className="eventSignupMemberDisplayAddButton"
//               type="primary"
//               shape="round"
//               onClick={this.addWaitlistMemberClick}
//             >
//               <PlusOutlined />
//               Add Member
//             </Button>
//             <p className="eventSignupMemberDisplayTotalText">
//               Total: {Object.keys(this.state.event.signups.waitlist).length}
//             </p>
//             <div className="clearBoth"></div>
//             {this.state.addingWaitlistMember ? (
//               <div className="eventSignupsAddMemberContainer">
//                 <Button onClick={this.onCancelAddWaitlistMember}>Cancel</Button>
//                 <CampSignupForm
//                   isCamp={this.state.event.signups.isCamp}
//                   onSubmit={(data) => this.signUpNewMember(data, true)}
//                   isWaitlist={true}
//                   includeNameAndEmail={true}
//                   submitting={this.state.submittingWaitlistMember}
//                 ></CampSignupForm>
//               </div>
//             ) : null}
//             <EventSignupTable
//               urlPath={this.state.event.urlPath}
//               isWaitlist={true}
//               eventId={this.state.event.id}
//               signupData={this.state.event.signups.waitlist}
//               isCamp={this.state.event.signups.isCamp}
//               limit={null}
//             ></EventSignupTable>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

// export default withRouter(EventSignups)

import { generateMockUid } from '@/lib/utils'
import {
  useAddMemberToEvent,
  useEvent,
  useRemoveMemberFromEvent,
} from '@/services/events'
import { MailOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Modal, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { ArrowLeft, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { Link, useParams } from 'react-router'
import z from 'zod'

const addMemberSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
})

type AddMemberForm = z.infer<typeof addMemberSchema>

export default function EventSignups() {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)

  const { eventId } = useParams()
  const { data: event, isPending: isLoadingEvent } = useEvent(eventId!)
  const addMember = useAddMemberToEvent()
  const removeMember = useRemoveMemberFromEvent()

  const { control, reset, handleSubmit } = useForm<AddMemberForm>({
    resolver: zodResolver(addMemberSchema),
  })

  if (isLoadingEvent) {
    return (
      <div className="eventSignupsSpinContainer">
        <Spin />
      </div>
    )
  }

  if (!event || !event.signups) {
    return <div>No event with signups found</div>
  }

  const dataSource = Object.entries(event.signups.members).map(
    ([userId, signup]) => ({
      key: userId,
      name: signup.displayName,
      email: signup.email,
      timeSignedUpMs: signup.timeSignedUpMs,
      confirmed: signup.confirmed,
    })
  )

  const columns: ColumnsType = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Paid?',
      dataIndex: 'confirmed',
      key: 'confirmed',
      render: (confirmed: boolean) => {
        return confirmed ? 'Yes' : 'No'
      },
    },
    {
      title: 'Remove',
      render: (_, record) => {
        return (
          <button
            className="size-4 flex w-full justify-center text-gray-400 cursor-pointer hover:text-red-600 transition-colors"
            onClick={() => handleRemoveMember(record.key)}
          >
            {removeMember.isPending ? (
              <LoaderCircle className="size-full animate-spin text-blue-500" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </button>
        )
      },
      width: '80px',
    },
  ]

  async function handleAddMember(data: AddMemberForm) {
    await addMember.mutateAsync({
      eventId: eventId!,
      userId: generateMockUid(),
      signupData: {
        displayName: data.name,
        email: data.email,
        confirmed: false,
        timeSignedUpMs: new Date().getTime(),
      },
    })
    setIsAddMemberModalOpen(false)
    reset()
  }

  async function handleRemoveMember(userId: string) {
    await removeMember.mutateAsync({
      eventId: eventId!,
      userId,
    })
  }

  return (
    <>
      <main className="flex-1 p-4 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Link to={`/admin/events`}>
              <ArrowLeft className="size-5" />
            </Link>
            <h1>{event.title}</h1>
          </div>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            Add Member
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          size="middle"
          bordered
          className="mt-4"
        />
      </main>

      <Modal
        open={isAddMemberModalOpen}
        footer={null}
        onCancel={() => setIsAddMemberModalOpen(false)}
      >
        <Form layout="vertical" onFinish={handleSubmit(handleAddMember)}>
          <FormItem label="Name" name="name" control={control}>
            <Input prefix={<UserOutlined />} />
          </FormItem>
          <FormItem label="Email" name="email" control={control}>
            <Input prefix={<MailOutlined />} />
          </FormItem>
          <Button
            type="primary"
            htmlType="submit"
            loading={addMember.isPending}
          >
            Add Member
          </Button>
        </Form>
      </Modal>
    </>
  )
}
