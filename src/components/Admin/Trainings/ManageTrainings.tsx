import React, {Component} from 'react'
import { Modal, Alert, Button, notification, Divider } from 'antd'
import { SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import './ManageTrainings.css'
import { CreateTraining } from './CreateTraining'
import { AumtWeeklyTraining } from '../../../types'
import db from '../../../services/db'


interface ManageTrainingsProps {
}

interface ManageTrainingsState {
    loadingTrainings: boolean
    errorText: string
    trainings: AumtWeeklyTraining[]
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
            loadingTrainings: false,
            errorText: '',
            trainings: [],
            editingTraining: {},
            removingTraining: {}
        }
    }
    componentDidMount() {
        this.getAllTrainings()
    }
    getAllTrainings = () => {
        this.setState({
            ...this.state,
            errorText: '',
            loadingTrainings: true
        })
        db.getAllForms()
            .then((forms: AumtWeeklyTraining[]) => {
                this.setState({
                    ...this.state,
                    loadingTrainings: false,
                    trainings: forms
                })
            })
            .catch((err) => {
                this.setState({
                    ...this.state,
                    loadingTrainings: false,
                    errorText: err.toString()
                })
            })
    }
    onTrainingEditClick = (trainingId: string) => {
        this.setState({
            ...this.state,
            editingTraining: Object.assign(this.state.editingTraining, {[trainingId]: !this.state.editingTraining[trainingId]})
        })
    }

    onEventEditSubmit = (trainingData: AumtWeeklyTraining): Promise<void> => {
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
                this.getAllTrainings()

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
        } else if (this.state.loadingTrainings) {
            return (<p>Loading Trainings <SyncOutlined spin/></p>)
        } else if (!this.state.trainings.length) {
            return (<p>No Training Forms in DB</p>)
        }
        return (
            <div className='manageTrainingsContainer'>
                {this.state.trainings.map((training) => {
                    return (
                        <div className="eachTrainingManager" key={training.trainingId}>
                            <div className="trainingManageHeader">
                                <h4 className='manageTrainingTitle'>
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
                                        edit edit
                                        {/* <CreateTraining
                                            onCreateSubmit={this.onEventEditSubmit}
                                            defaultValues={event}
                                            ></CreateTraining> */}
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