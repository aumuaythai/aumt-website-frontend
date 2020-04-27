import React, {Component} from 'react'
import { Spin, Modal, Alert, Button, notification, Divider } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import './ManageTrainings.css'
import CreateTraining from './CreateTraining'
import { AumtWeeklyTraining } from '../../../types'
import db from '../../../services/db'


interface ManageTrainingsProps {
    onTrainingClick: (trainingId: string) => void
    onEditTrainingRequest: (training: AumtWeeklyTraining) => void
    trainings: AumtWeeklyTraining[]
    loadingTrainings: boolean
}

interface ManageTrainingsState {
    errorText: string
    editingTraining: {
        [trainingId: string]: boolean
    },
    removingTraining: {
        [trainingId: string]: boolean
    }
}

export class ManageTrainings extends Component<ManageTrainingsProps, ManageTrainingsState> {
    constructor(props: ManageTrainingsProps) {
        super(props)
        this.state = {
            errorText: '',
            editingTraining: {},
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
    onTrainingEditClick = (trainingId: string) => {
        const training = this.props.trainings.find(t => t.trainingId === trainingId)
        if (training) {
            this.props.onEditTrainingRequest(training)
        } else {
            notification.error({
                message: 'No training found for id ' + trainingId
            })
        }
    }

    onCreateTrainingSubmit = (trainingData: AumtWeeklyTraining): Promise<void> => {
        return db.submitNewForm(trainingData)
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
            return (<p>Loading Trainings <Spin/></p>)
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
                                    <Button onClick={e => this.onTrainingEditClick(training.trainingId)}>
                                        {this.state.editingTraining[training.trainingId] ? 'Cancel Edit' : 'Edit'}
                                    </Button>
                                    <Button
                                        loading={this.state.removingTraining[training.trainingId]}
                                        onClick={e => this.confirmDeleteTraiing(training.title, training.trainingId)}
                                        type='danger'
                                        >Remove</Button>
                                </div>
                                <div className="clearBoth"></div>
                            </div>
                            {this.state.editingTraining[training.trainingId] ?
                                (
                                    <div className="trainingEditManage">
                                        <CreateTraining
                                            onCreateSubmit={this.onCreateTrainingSubmit}
                                            defaultValues={training}
                                            ></CreateTraining>
                                    </div>
                                ) :
                                ''}
                            <Divider/>
                        </div>
                    )
                })}
            </div>
        )
    }
}