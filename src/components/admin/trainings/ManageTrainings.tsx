import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Divider, Modal, notification, Spin } from 'antd'
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { removeTraining } from '../../../services/db'
import { AumtWeeklyTraining } from '../../../types'

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

export class ManageTrainings extends Component<
  ManageTrainingsProps,
  ManageTrainingsState
> {
  constructor(props: ManageTrainingsProps) {
    super(props)
    this.state = {
      errorText: '',
      removingTraining: {},
    }
  }
  componentDidUpdate(
    prevProps: ManageTrainingsProps,
    prevState: ManageTrainingsState
  ) {
    if (this.props !== prevProps && this.props.trainings) {
      this.setState({
        ...this.state,
        errorText: '',
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
      onCancel: () => {},
    })
  }
  removeTraining = (trainingId: string) => {
    this.setState({
      ...this.state,
      removingTraining: Object.assign(this.state.removingTraining, {
        [trainingId]: true,
      }),
    })
    removeTraining(trainingId)
      .then(() => {
        this.setState({
          ...this.state,
          removingTraining: Object.assign(this.state.removingTraining, {
            [trainingId]: false,
          }),
        })
      })
      .catch((err) => {
        notification.open({
          message: 'Error removing training: ' + err.toString(),
        })
        this.setState({
          ...this.state,
          removingTraining: Object.assign(this.state.removingTraining, {
            [trainingId]: false,
          }),
        })
      })
  }
  render() {
    if (this.state.errorText) {
      return <Alert type="error" message={this.state.errorText}></Alert>
    } else if (this.props.loadingTrainings) {
      return (
        <div>
          Loading Trainings <Spin />
        </div>
      )
    } else if (!this.props.trainings.length) {
      return <p>No Training Forms in DB</p>
    }
    return (
      <ul className="mt-6 overflow-y-auto max-h-96 md:max-h-none">
        {this.props.trainings.map((training) => (
          <li key={training.trainingId}>
            <div className="flex flex-1 justify-between">
              <h4
                onClick={(e) => this.props.onTrainingClick(training.trainingId)}
              >
                {training.title}
              </h4>
              <div>
                <Link
                  to={`/admin/edittraining/${training.trainingId}`}
                  className="mr-2"
                >
                  <Button className="manageTrainingOptionButton">Edit</Button>
                </Link>
                <Button
                  loading={this.state.removingTraining[training.trainingId]}
                  onClick={(e) =>
                    this.confirmDeleteTraiing(
                      training.title,
                      training.trainingId
                    )
                  }
                  type="primary"
                  danger
                >
                  Remove
                </Button>
              </div>
            </div>
            <Divider />
          </li>
        ))}
      </ul>
    )
  }
}
