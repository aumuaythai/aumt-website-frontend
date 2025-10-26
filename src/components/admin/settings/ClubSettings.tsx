import { Component } from 'react'

import {
  Button,
  Input,
  InputNumber,
  List,
  notification,
  Radio,
  Spin,
  Switch,
} from 'antd'

import { ClubConfig } from '../../../types'

import { getClubConfig, setClubConfig } from '../../../services/db'

interface ClubSettingsProps {}

interface ClubSettingsState {
  summerSchoolFee: number
  semesterOneFee: number
  semesterTwoFee: number
  fullYearFee: number
  clubSignupSem: 'S1' | 'S2' | 'SS'
  clubSignupStatus: 'open' | 'closed'
  bankAccountNumber: string
  loading: boolean
  saving: boolean
}

export default class ClubSettings extends Component<
  ClubSettingsProps,
  ClubSettingsState
> {
  constructor(props: ClubSettingsProps) {
    super(props)
    this.state = {
      ...this.state,
      loading: true,
      saving: false,
    }
  }

  componentDidMount = () => {
    getClubConfig().then((clubConfig) => {
      console.log(clubConfig)
      this.setState({
        ...this.state,
        ...clubConfig,
        loading: false,
      })
    })
  }

  onSignupSemChange = (sem: 'S1' | 'S2' | 'SS') => {
    this.setState({ ...this.state, clubSignupSem: sem })
  }

  clubSignupStatusChange = (checked: boolean) => {
    this.setState({
      ...this.state,
      clubSignupStatus: checked ? 'open' : 'closed',
    })
  }

  summerSchoolFeeChange = (price: any) => {
    this.setState({ ...this.state, summerSchoolFee: price })
  }

  semesterOneFeeChange = (price: any) => {
    this.setState({ ...this.state, semesterOneFee: price })
  }

  semesterTwoFeeChange = (price: any) => {
    this.setState({ ...this.state, semesterTwoFee: price })
  }

  fullYearFeeChange = (price: any) => {
    this.setState({ ...this.state, fullYearFee: price })
  }

  bankAccountNumberChange = (bankAccountNumber: string) => {
    this.setState({ ...this.state, bankAccountNumber: bankAccountNumber })
  }

  updateSettings = () => {
    this.setState({ ...this.state, saving: true })

    const clubConfig: ClubConfig = {
      summerSchoolFee: this.state.summerSchoolFee,
      semesterOneFee: this.state.semesterOneFee,
      semesterTwoFee: this.state.semesterTwoFee,
      fullYearFee: this.state.fullYearFee,
      clubSignupSem: this.state.clubSignupSem,
      clubSignupStatus: this.state.clubSignupStatus,
      bankAccountNumber: this.state.bankAccountNumber,
    }

    setClubConfig(clubConfig)
      .then(() => {
        this.setState({ ...this.state, saving: false })
        notification.success({ message: 'Club Settings Updated' })
      })
      .catch((err) => {
        notification.error({
          message: 'Could not save member' + err.toString(),
        })
      })
  }

  render() {
    return (
      <div className="text-left mx-auto pb-10 max-w-2xl">
        <h1 className="text-2xl">Club Settings</h1>
        <p>
          Here you can edit club credential settings. Make sure to click the
          save button at the bottom.
        </p>

        {this.state.loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : (
          <>
            <List bordered header={<h1>Memberhip Prices ($)</h1>}>
              <List.Item>
                <span>Summer School</span>
                <InputNumber
                  defaultValue={this.state.summerSchoolFee}
                  onChange={this.summerSchoolFeeChange}
                />
              </List.Item>
              <List.Item>
                <span>Semester 1</span>
                <InputNumber
                  defaultValue={this.state.semesterOneFee}
                  onChange={this.semesterOneFeeChange}
                />
              </List.Item>
              <List.Item>
                <span>Semester 2</span>
                <InputNumber
                  defaultValue={this.state.semesterTwoFee}
                  onChange={this.semesterTwoFeeChange}
                />
              </List.Item>
              <List.Item>
                <span>Full Year</span>
                <InputNumber
                  defaultValue={this.state.fullYearFee}
                  onChange={this.fullYearFeeChange}
                />
              </List.Item>
            </List>

            <List bordered header={<h1>Join Form</h1>} className="!mt-5">
              <List.Item>
                <span>Status</span>
                <Switch
                  checkedChildren="Open"
                  unCheckedChildren="Closed"
                  defaultChecked={
                    this.state.clubSignupStatus === 'open' ? true : false
                  }
                  onChange={this.clubSignupStatusChange}
                />
              </List.Item>
              <List.Item>
                <span>Semester</span>
                <Radio.Group
                  value={this.state.clubSignupSem}
                  onChange={(e) => this.onSignupSemChange(e.target.value)}
                >
                  <Radio.Button value="S1">Sem 1</Radio.Button>
                  <Radio.Button value="S2">Sem 2</Radio.Button>
                  <Radio.Button value="SS">Summer School</Radio.Button>
                </Radio.Group>
              </List.Item>
            </List>

            <List bordered header={<h1>Club Credentials</h1>} className="!mt-5">
              <List.Item>
                <span>Bank Account Number</span>
                <Input
                  onChange={(e) => this.bankAccountNumberChange(e.target.value)}
                  value={this.state.bankAccountNumber}
                />
              </List.Item>
              <List.Item>
                <span>Phone Number</span>
                <Input value={'IN THE WORKS'} />
              </List.Item>
              <List.Item>
                <span>Address</span>
                <Input value={'IN THE WORKS'} />
              </List.Item>
              <List.Item>
                <span>Email</span>
                <Input value={'IN THE WORKS'} />
              </List.Item>
            </List>

            {this.state.saving ? (
              <Spin />
            ) : (
              <Button
                type="primary"
                onClick={this.updateSettings}
                className="!mt-5"
              >
                Save Settings
              </Button>
            )}
          </>
        )}
      </div>
    )
  }
}
