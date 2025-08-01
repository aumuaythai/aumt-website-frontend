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
import GenerateReportWrapper from './Report/GenerateReportWrapper'
import GenerateSignupWrapper from './Report/GenerateSignupWrapper'
import { WeekStats } from './Stats/WeekStats'
import { YearStats } from './Stats/YearStats'
import './TrainingDashboard.css'

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
      <div className="trainingDashboardContainer">
        <div className="weeklyStatSelectorContainer">
          {/* <Button onClick={this.signMockData}>Mock Data</Button> */}
          <Link
            to="/admin/createtraining"
            className="trainingDashboardCreateButton"
          >
            <Button type="primary" shape="round" size="large">
              Create Training <PlusOutlined />
            </Button>
          </Link>
          <Dropdown
            className="trainingDashboardFormSelector"
            trigger={['click']}
            overlay={this.getFormsDropdown}
          >
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
          {this.state.currentForm ? (
            <GenerateSignupWrapper
              form={this.state.currentForm}
            ></GenerateSignupWrapper>
          ) : (
            <></>
          )}
          {this.state.currentForm ? (
            <Link
              to={`/admin/attendance/${
                this.state.currentForm
                  ? this.state.currentForm.trainingId
                  : null
              }`}
            >
              <Button type="primary" size="large">
                Attendance
              </Button>
            </Link>
          ) : (
            <></>
          )}

          <div className="clearBoth"></div>
        </div>
        <div className="trainingDashboardContentContainer">
          <div className="weekStatsContainer trainingDashboardSection">
            <h2 className="sectionHeader">Weekly Stats</h2>
            <WeekStats
              loadingForms={this.state.loadingForms}
              form={this.state.currentForm}
            ></WeekStats>
          </div>
          <div className="editMembersContainer trainingDashboardSection">
            <h2 className="sectionHeader">Edit Members</h2>
            {this.state.loadingForms ? (
              <div>
                Loading current forms <Spin />
              </div>
            ) : this.state.currentForm ? (
              <EditSignups form={this.state.currentForm}></EditSignups>
            ) : (
              <p>No Form Selected</p>
            )}
          </div>
          <div className="clearBoth"></div>
          <div className="manageTrainingsWrapper trainingDashboardSection">
            <h2 className="sectionHeader">
              Manage {this.state.allForms.length || ''} Trainings
              <Link to="/admin/createtraining">
                <Button className="manageTrainingsAddButton" shape="round">
                  <PlusOutlined />
                </Button>
              </Link>
              <Popover
                trigger="click"
                content={
                  <div>
                    <Button
                      className="trainingDashboardDownloadCsvOption"
                      type="link"
                      onClick={this.downloadTrainingCsv}
                    >
                      Trainings .csv
                    </Button>
                    <Button
                      className="trainingDashboardDownloadCsvOption"
                      type="link"
                      onClick={this.downloadSignupsCsv}
                    >
                      Signups .csv
                    </Button>
                  </div>
                }
              >
                <Button type="link">Download...</Button>
              </Popover>
              <GenerateReportWrapper
                forms={this.state.allForms}
              ></GenerateReportWrapper>
            </h2>
            <div className="manageTrainingsComponentWrapper">
              <ManageTrainings
                trainings={this.state.allForms}
                loadingTrainings={this.state.loadingForms}
                onTrainingClick={this.onClickTraining}
              ></ManageTrainings>
            </div>
          </div>
          <div className="yearStatsWrapper trainingDashboardSection">
            <h2 className="sectionHeader">Yearly Stats</h2>
            <YearStats
              forms={this.state.allForms}
              onTrainingClick={this.onClickTraining}
            ></YearStats>
          </div>
          <div className="clearBoth"></div>
        </div>
      </div>
    )
  }
}
