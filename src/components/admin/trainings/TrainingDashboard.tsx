import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, notification, Popover, Spin } from 'antd'
import React, { Component, Key } from 'react'
import { Link } from 'react-router-dom'
import dataUtil from '../../../services/data.util'
import { formatMembers } from '../../../services/db'
import { AumtWeeklyTraining } from '../../../types'
import AdminStore from '../AdminStore'
import { EditSignups } from './EditSignups'
import { ManageTrainings } from './ManageTrainings'
import './TrainingDashboard.css'
import { YearStats } from './YearStats'

interface TrainingDashboardProps {
  forms: AumtWeeklyTraining[]
}

interface TrainingDashboardState {
  currentForm: AumtWeeklyTraining | null
  loadingForms: boolean
  allForms: AumtWeeklyTraining[]
}

export class TrainingDashboard extends Component<
  TrainingDashboardProps,
  TrainingDashboardState
> {
  private isFirstListen = true

  constructor(props: TrainingDashboardProps) {
    super(props)
    this.state = {
      currentForm: null,
      allForms: [],
      loadingForms: false,
    }
  }
  signMockData = () => {
    formatMembers().then(() => {
      console.log('DONE')
    })
  }
  componentDidUpdate = (
    prevProps: TrainingDashboardProps,
    prevState: TrainingDashboardState
  ) => {
    if (this.props.forms !== prevProps.forms) {
      this.setState({ ...this.state, loadingForms: false }, () => {
        this.handleNewForms(this.props.forms)
      })
    }
  }
  componentDidMount = () => {
    if (!this.props.forms.length) {
      this.setState({ ...this.state, loadingForms: true })
      AdminStore.requestTrainings()
    } else {
      this.handleNewForms(this.props.forms)
    }
  }
  handleNewForms = (forms: AumtWeeklyTraining[]) => {
    const sortedForms = forms
      .sort((a, b) => {
        return a.closes < b.closes ? 1 : -1
      })
      .slice()
    const currentTime = new Date()
    let currentForm = sortedForms[sortedForms.length - 1]
    for (let i = 0; i < sortedForms.length; i++) {
      if (sortedForms[i].opens < currentTime) {
        currentForm = sortedForms[i]
        break
      }
    }
    this.setState(
      {
        ...this.state,
        allForms: sortedForms,
      },
      () => {
        const currentFormInNewForms = forms.find(
          (f) => f.trainingId === this.state.currentForm?.trainingId
        )
        if (!currentFormInNewForms) {
          this.onFormSelect({ key: currentForm.trainingId })
        } else if (currentFormInNewForms) {
          this.onFormSelect({ key: currentFormInNewForms.trainingId })
        }
      }
    )
  }
  onClickTraining = (trainingId: string) => {
    this.onFormSelect({ key: trainingId })
  }
  onFormSelect = (event: { key: Key }) => {
    const selectedForm = this.state.allForms.find(
      (f) => f.trainingId === event.key
    )
    if (selectedForm) {
      this.setState({
        ...this.state,
        currentForm: selectedForm,
      })
    } else {
      notification.error({
        message: 'No form found for selection...',
      })
    }
  }

  downloadTrainingCsv = () => {
    const csvHeader =
      'trainingId,formTitle,opensMs,closesMs,notes,openToPublic,feedback,sessionId,sessionTitle,sessionLimit,sessionPosition'
    const lines: string[] = [csvHeader]
    this.props.forms.forEach((form) => {
      Object.keys(form.sessions).forEach((sessionId) => {
        const session = form.sessions[sessionId]
        lines.push(
          [
            form.trainingId,
            `"${form.title}"`,
            form.opens.getTime(),
            form.closes.getTime(),
            `"${form.notes}"`,
            form.openToPublic ? 'Yes' : 'No',
            `"${form.feedback.join('%%')}"`,
            `${sessionId}`,
            `"${session.title}"`,
            session.limit,
            session.position,
          ].join(',')
        )
      })
    })
    dataUtil.downloadCsv('trainings', lines.join('\n'))
  }
  downloadSignupsCsv = () => {
    const csvHeader = 'uid,name,timeAddedMs,sessionId,trainingId'
    let lines: string[] = [csvHeader]
    this.props.forms.forEach((form) => {
      Object.values(form.sessions).forEach((session) => {
        lines = lines.concat(
          Object.keys(session.members).map((uid) => {
            const member = session.members[uid]
            return [
              uid,
              member.name,
              member.timeAdded.getTime(),
              session.sessionId,
              form.trainingId,
            ].join(',')
          })
        )
      })
    })
    dataUtil.downloadCsv('signups', lines.join('\n'))
  }
  getFormsDropdown = () => {
    return (
      <Menu onClick={this.onFormSelect}>
        {this.state.allForms.map((form) => {
          return (
            <Menu.Item key={form.trainingId}>
              {form.title.length > 50 && window.innerWidth < 600
                ? form.title.slice(0, 47) + '...'
                : form.title}
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }
  render() {
    return (
      <div className="p-3.5 h-full flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Dropdown trigger={['click']} overlay={this.getFormsDropdown}>
              <Button size="large">
                {this.state.currentForm && this.state.currentForm.title
                  ? this.state.currentForm.title.length > 40 &&
                    window.innerWidth < 600
                    ? this.state.currentForm.title.slice(0, 37) + '...'
                    : this.state.currentForm.title
                  : ''}{' '}
                <DownOutlined />
              </Button>
            </Dropdown>
            {this.state.currentForm && (
              <Link
                to={`/admin/attendance/${
                  this.state.currentForm
                    ? this.state.currentForm.trainingId
                    : null
                }`}
                className="ml-2"
              >
                <Button type="primary" size="large">
                  Attendance
                </Button>
              </Link>
            )}
          </div>

          <Link to="/admin/createtraining">
            <Button type="default" shape="round" size="large">
              Create Training <PlusOutlined />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 h-full mt-6 gap-6">
          <div className="flex flex-col">
            <h2 className="text-xl">
              Manage {this.state.allForms.length || ''} Trainings
            </h2>
            <ManageTrainings
              trainings={this.state.allForms}
              loadingTrainings={this.state.loadingForms}
              onTrainingClick={this.onClickTraining}
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl">Edit Members</h2>
            {this.state.loadingForms ? (
              <div>
                Loading current forms <Spin />
              </div>
            ) : this.state.currentForm ? (
              <EditSignups form={this.state.currentForm} />
            ) : (
              <p>No Form Selected</p>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col h-full">
            <h2 className="text-xl">Yearly Stats</h2>
            <YearStats
              forms={this.state.allForms}
              onTrainingClick={this.onClickTraining}
            />
          </div>
        </div>
      </div>
    )
  }
}
