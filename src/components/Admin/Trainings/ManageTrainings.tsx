import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Spin, Modal, Alert, Button, notification, Divider } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import './ManageTrainings.css'
import { AumtWeeklyTraining } from '../../../types'
import db from '../../../services/db'


interface ManageTrainingsProps {
    onTrainingClick: (trainingId: string) => void
    trainings: AumtWeeklyTraining[]
    loadingTrainings: boolean
}

interface ManageTrainingsState {
    errorText: string
    removingTraining: {
        [trainingId: string]: boolean
    }
}

export class ManageTrainings extends Component<ManageTrainingsProps, ManageTrainingsState> {
    constructor(props: ManageTrainingsProps) {
        super(props)
        this.state = {
            errorText: '',
            removingTraining: {}
        }
    }
    componentDidUpdate(prevProps: ManageTrainingsProps, prevState: ManageTrainingsState) {
        if (this.props !== prevProps && this.props.trainings) {
            this.setState({
                ...this.state,
                errorText: ''
            })
        }
    }

    confirmDeleteTraiing = (title: string, trainingId: string) => {
        Modal.confirm({
          title: `Delete ${title}?`,
          icon: <ExclamationCircleOutlined />,
          content: 'This will remove all signup data from the database.',
          okText: 'Delete',
          okType: 'danger',
          cancelText: 'Cancel',
          maskClosable: true,
          onOk: () => this.removeTraining(trainingId),
          onCancel: () => {}
        });
      }
    removeTraining = (trainingId: string) => {
        this.setState({
            ...this.state,
            removingTraining: Object.assign(this.state.removingTraining, {
                [trainingId]: true
            })
        })
        db.removeTraining(trainingId)
            .then(() => {
                this.setState({
                    ...this.state,
                    removingTraining: Object.assign(this.state.removingTraining, {
                        [trainingId]: false
                    })
                })
            })
            .catch((err) => {
                notification.open({
                    message: 'Error removing training: ' + err.toString()
                })
                this.setState({
                    ...this.state,
                    removingTraining: Object.assign(this.state.removingTraining, {
                        [trainingId]: false
                    })
                })
            })
    }
    render() {
        if (this.state.errorText) {
            return (<Alert type='error' message={this.state.errorText}></Alert>)
        } else if (this.props.loadingTrainings) {
            return (<div>Loading Trainings <Spin/></div>)
        } else if (!this.props.trainings.length) {
            return (<p>No Training Forms in DB</p>)
        }
        return (
            <div className='manageTrainingsContainer'>
                {this.props.trainings.map((training) => {
                    return (
                        <div className="eachTrainingManager" key={training.trainingId}>
                            <div className="trainingManageHeader">
                                <h4 className='manageTrainingTitle' onClick={e => this.props.onTrainingClick(training.trainingId)}>
                                    {training.title}
                                </h4>
                                <div className='manageTrainingOptions'>
                                    <Link to={`/admin/edittraining/${training.trainingId}`}>
                                        <Button className='manageTrainingOptionButton'>Edit</Button>
                                    </Link>
                                    <Button className='manageTrainingOptionButton'
                                        loading={this.state.removingTraining[training.trainingId]}
                                        onClick={e => this.confirmDeleteTraiing(training.title, training.trainingId)}
                                        type='danger'
                                        >Remove</Button>
                                </div>
                                <div className="clearBoth"></div>
                            </div>
                            <Divider/>
                        </div>
                    )
                })}
            </div>
        )
    }
}