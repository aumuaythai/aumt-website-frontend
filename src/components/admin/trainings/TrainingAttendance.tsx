// import { Button } from 'antd'
// import React, { Component } from 'react'
// import { Link, RouteComponentProps, withRouter } from 'react-router'
// import {
//   getTrainingAttendance,
//   getTrainingData,
//   setMemberTrainingAttendance,
// } from '../../../services/db'
// import { AumtTrainingSession, AumtWeeklyTraining } from '../../../types'

// interface TrainingAttendanceProps extends RouteComponentProps<{ id: string }> {}

// interface TrainingAttendanceState {
//   training: AumtWeeklyTraining | null
//   trainingSession: AumtTrainingSession | null
//   currentMembers: string[]
//   showList: boolean
// }

// class TrainingAttendance extends Component<
//   TrainingAttendanceProps,
//   TrainingAttendanceState
// > {
//   constructor(props: TrainingAttendanceProps) {
//     super(props)
//     this.state = {
//       training: null,
//       trainingSession: null,
//       currentMembers: [],
//       showList: false,
//     }
//   }
//   componentDidMount() {
//     const { match } = this.props // Access the match object from props
//     getTrainingData(match.params.id).then((training) => {
//       this.setState({ training })
//       const sessions = Object.values(training.sessions)
//       const sortedSessions = sessions.sort((a, b) => a.position - b.position)
//       this.onSessionClick(sortedSessions[0].sessionId)
//     })
//   }

//   onSessionClick = (sessionId: string) => {
//     const session = this.state.training?.sessions[sessionId]
//     this.setState({ trainingSession: session })
//     this.setState({ showList: false })
//     getTrainingAttendance(
//       this.state.training.trainingId,
//       session.sessionId
//     ).then((attendance) => {
//       this.setState({ currentMembers: attendance })
//       this.setState({ showList: true })
//     })
//   }

//   onMemberClick = (memberId: string) => {
//     const updatedMembers = [...this.state.currentMembers]
//     if (this.state.currentMembers.includes(memberId)) {
//       updatedMembers.splice(updatedMembers.indexOf(memberId), 1)
//     } else {
//       updatedMembers.push(memberId)
//     }

//     this.setState({
//       currentMembers: updatedMembers,
//     })

//     setMemberTrainingAttendance(
//       this.state.training.trainingId,
//       this.state.trainingSession.sessionId,
//       memberId,
//       updatedMembers
//     )
//   }

//   render() {
//     const { training, trainingSession } = this.state

//     let sessions: AumtTrainingSession[] = []

//     if (training) {
//       sessions = Object.values(training.sessions)
//     }

//     return (
//       <div className="flex-1 pt-[30px]">
//         <Link to={`/admin`}>
//           <Button className="backButton">Back</Button>
//         </Link>
//         {training && (
//           <div>
//             <h2>{training.title} Attendance</h2>
//             {/* <p>Training Date: {training}</p> */}
//             <select
//               className="w-full p-2.5 my-2.5 border border-gray-300 rounded-sm text-base bg-gray-100 text-black font-medium"
//               onChange={(event) => this.onSessionClick(event.target.value)}
//             >
//               {sessions
//                 .sort((a, b) => a.position - b.position)
//                 .map((session) => (
//                   <option key={session.sessionId} value={session.sessionId}>
//                     {session.title}
//                   </option>
//                 ))}
//             </select>

//             <div className="memberCheckboxContainer">
//               {trainingSession &&
//                 this.state.showList &&
//                 Object.keys(trainingSession.members)
//                   .sort((a, b) =>
//                     trainingSession.members[a].name
//                       .split(' ')
//                       .pop()
//                       .toLowerCase()
//                       .localeCompare(
//                         trainingSession.members[b].name
//                           .split(' ')
//                           .pop()
//                           .toLowerCase()
//                       )
//                   )
//                   .map((key, index) => {
//                     const checked =
//                       this.state.currentMembers &&
//                       this.state.currentMembers.includes(key)
//                     return (
//                       <div
//                         key={index}
//                         className="grow shrink-0 basis-1/2 box-border p-[5px]"
//                       >
//                         <input
//                           type="checkbox"
//                           id={trainingSession.members[key].name}
//                           onChange={() => {
//                             this.onMemberClick(key)
//                           }}
//                           checked={checked}
//                           className="scale-200"
//                         />
//                         <label
//                           htmlFor={trainingSession.members[key].name}
//                           className="text-xl pl-5"
//                         >
//                           {trainingSession.members[key].name}
//                         </label>
//                       </div>
//                     )
//                   })}
//             </div>

//             <div className="pt-2.5 text-xl">
//               {trainingSession && this.state.showList && (
//                 <p>
//                   {this.state.currentMembers.length} /{' '}
//                   {Object.keys(trainingSession.members).length}{' '}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }
// }

// export default withRouter(TrainingAttendance)

import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import React, { Component, useState } from 'react'
import { Link, RouteComponentProps, useParams, withRouter } from 'react-router'
import {
  getTrainingAttendance,
  getTrainingData,
  setMemberTrainingAttendance,
} from '../../../services/db'
import { AumtTrainingSession, AumtWeeklyTraining } from '../../../types'

interface TrainingAttendanceProps extends RouteComponentProps<{ id: string }> {}

interface TrainingAttendanceState {
  training: AumtWeeklyTraining | null
  trainingSession: AumtTrainingSession | null
  currentMembers: string[]
  showList: boolean
}

export default function TrainingAttendance(props: TrainingAttendanceProps) {
  const [training, setTraining] = useState<AumtWeeklyTraining | null>(null)
  const [trainingSession, setTrainingSession] =
    useState<AumtTrainingSession | null>(null)
  const [currentMembers, setCurrentMembers] = useState<string[]>([])
  const [showList, setShowList] = useState(false)

  const { trainingId } = useParams()

  const { data: trainingData } = useQuery({
    queryKey: ['training', trainingId],
    queryFn: () => getTrainingData(trainingId!),
    enabled: !!trainingId,
  })

  if (!trainingData) {
    return null
  }

  const sessions = Object.values(trainingData.sessions)
  const sortedSessions = sessions.sort((a, b) => a.position - b.position)

  // componentDidMount() {
  //   const { match } = this.props // Access the match object from props
  //   getTrainingData(match.params.id).then((training) => {
  //     this.setState({ training })
  //     const sessions = Object.values(training.sessions)
  //     const sortedSessions = sessions.sort((a, b) => a.position - b.position)
  //     this.onSessionClick(sortedSessions[0].sessionId)
  //   })
  // }

  // onSessionClick = (sessionId: string) => {
  //   const session = this.state.training?.sessions[sessionId]
  //   this.setState({ trainingSession: session })
  //   this.setState({ showList: false })
  //   getTrainingAttendance(
  //     this.state.training.trainingId,
  //     session.sessionId
  //   ).then((attendance) => {
  //     this.setState({ currentMembers: attendance })
  //     this.setState({ showList: true })
  //   })
  // }

  // onMemberClick = (memberId: string) => {
  //   const updatedMembers = [...this.state.currentMembers]
  //   if (this.state.currentMembers.includes(memberId)) {
  //     updatedMembers.splice(updatedMembers.indexOf(memberId), 1)
  //   } else {
  //     updatedMembers.push(memberId)
  //   }

  //   this.setState({
  //     currentMembers: updatedMembers,
  //   })

  //   setMemberTrainingAttendance(
  //     this.state.training.trainingId,
  //     this.state.trainingSession.sessionId,
  //     memberId,
  //     updatedMembers
  //   )
  // }

  console.log(trainingData)

  // const { training, trainingSession } = this.state

  // let sessions: AumtTrainingSession[] = []

  // if (training) {
  //   sessions = Object.values(training.sessions)
  // }

  return (
    <div className="flex-1 pt-[30px]">
      <Link to={`/admin`}>
        <Button className="backButton">Back</Button>
      </Link>
      {training && (
        <div>
          <h2>{training.title} Attendance</h2>
          {/* <p>Training Date: {training}</p> */}
          <select
            className="w-full p-2.5 my-2.5 border border-gray-300 rounded-sm text-base bg-gray-100 text-black font-medium"
            onChange={(event) => this.onSessionClick(event.target.value)}
          >
            {sessions
              .sort((a, b) => a.position - b.position)
              .map((session) => (
                <option key={session.sessionId} value={session.sessionId}>
                  {session.title}
                </option>
              ))}
          </select>

          <div className="memberCheckboxContainer">
            {trainingSession &&
              this.state.showList &&
              Object.keys(trainingSession.members)
                .sort((a, b) =>
                  trainingSession.members[a].name
                    .split(' ')
                    .pop()
                    .toLowerCase()
                    .localeCompare(
                      trainingSession.members[b].name
                        .split(' ')
                        .pop()
                        .toLowerCase()
                    )
                )
                .map((key, index) => {
                  const checked =
                    this.state.currentMembers &&
                    this.state.currentMembers.includes(key)
                  return (
                    <div
                      key={index}
                      className="grow shrink-0 basis-1/2 box-border p-[5px]"
                    >
                      <input
                        type="checkbox"
                        id={trainingSession.members[key].name}
                        onChange={() => {
                          this.onMemberClick(key)
                        }}
                        checked={checked}
                        className="scale-200"
                      />
                      <label
                        htmlFor={trainingSession.members[key].name}
                        className="text-xl pl-5"
                      >
                        {trainingSession.members[key].name}
                      </label>
                    </div>
                  )
                })}
          </div>

          <div className="pt-2.5 text-xl">
            {trainingSession && this.state.showList && (
              <p>
                {this.state.currentMembers.length} /{' '}
                {Object.keys(trainingSession.members).length}{' '}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
