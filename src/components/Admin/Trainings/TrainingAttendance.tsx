import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import React, { Component } from "react";
import { AumtTrainingSession, AumtWeeklyTraining } from "../../../types";
import db from '../../../services/db'
import './TrainingAttendance.css'
import { Button } from "antd";





interface TrainingAttendanceProps extends RouteComponentProps<{ id: string }> { }

interface TrainingAttendanceState {
    training: AumtWeeklyTraining | null
    trainingSession: AumtTrainingSession | null
    currentMembers: string[]
    showList: boolean
}

class TrainingAttendance extends Component<TrainingAttendanceProps, TrainingAttendanceState> {
    constructor(props: TrainingAttendanceProps) {
        super(props)
        this.state = {
            training: null,
            trainingSession: null,
            currentMembers: [],
            showList: false
        }
    }
    componentDidMount() {
        const { match } = this.props; // Access the match object from props
        db.getTrainingData(match.params.id).then((training) => {
            this.setState({ training });
            const sessions = Object.values(training.sessions);
            const sortedSessions = sessions.sort((a, b) => a.position - b.position);
            this.onSessionClick(sortedSessions[0].sessionId);
        });
    }


    onSessionClick = (sessionId: string) => {
        const session = this.state.training?.sessions[sessionId];
        this.setState({ trainingSession: session });
        this.setState({ showList: false });
        db.getTrainingAttendance(this.state.training.trainingId, session.sessionId).then((attendance) => {
            this.setState({ currentMembers: attendance });
            this.setState({ showList: true });
        })
    }

    onMemberClick = (memberId: string) => {
        const updatedMembers = [...this.state.currentMembers]
        if (this.state.currentMembers.includes(memberId)) {
            updatedMembers.splice(updatedMembers.indexOf(memberId), 1)
        } else {
            updatedMembers.push(memberId);
        }

        this.setState({
            currentMembers: updatedMembers
        });

        db.setMemberTrainingAttendance(this.state.training.trainingId, this.state.trainingSession.sessionId, memberId, updatedMembers);
    }

    render() {
        const { training, trainingSession } = this.state;

        let sessions: AumtTrainingSession[] = []


        if (training) {
            sessions = Object.values(training.sessions);
        }



        return (
            <div>
                <Link to={`/admin`}>
                    <Button className='backButton'>Back</Button>
                </Link>
                {training && (
                    <div>
                        <h2>{training.title} Attendance</h2>
                        {/* <p>Training Date: {training}</p> */}
                        <select onChange={(event) => this.onSessionClick(event.target.value)}>
                            {sessions.sort((a, b) => a.position - b.position).map(session => (
                                <option key={session.sessionId} value={session.sessionId}>
                                    {session.title}
                                </option>
                            ))}
                        </select>

                        <div className="memberCheckboxContainer">
                            {trainingSession && this.state.showList &&
                                Object.keys(trainingSession.members)
                                    .sort((a, b) =>
                                        trainingSession.members[a].name.split(" ").pop().toLowerCase()
                                            .localeCompare(trainingSession.members[b].name.split(" ").pop().toLowerCase()))
                                    .map((key, index) => {
                                        let checked = this.state.currentMembers && this.state.currentMembers.includes(key);
                                        return (
                                            <div key={index} className="memberCheckboxColumn">
                                                <input type="checkbox" id={trainingSession.members[key].name} onChange={() => {
                                                    this.onMemberClick(key)
                                                }}
                                                    checked={checked}
                                                />
                                                <label htmlFor={trainingSession.members[key].name}>{trainingSession.members[key].name}</label>
                                            </div>
                                        )
                                    })}
                        </div>

                        <div className="attendanceCount">
                            {trainingSession && this.state.showList && (
                                <p>{this.state.currentMembers.length} / {Object.keys(trainingSession.members).length} </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

export default withRouter(TrainingAttendance);

