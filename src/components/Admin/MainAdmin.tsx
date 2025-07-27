import { Component, Key, lazy } from 'react'
import {
  Link,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'

import {
  ArrowLeftOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Menu } from 'antd'

import './MainAdmin.css'

import CreateEvent from './Events/CreateEvent'
import EventSignups from './Events/EventSignups'
import ClubSettings from './Settings/ClubSettings'
import CreateTraining from './Trainings/CreateTraining'

import { CommitteeApps } from './CommitteeApps/CommitteeApps'
import { ManageEvents } from './Events/ManageEvents'
import { Feedback } from './Feedback/Feedback'
import { TrainingDashboard } from './Trainings/TrainingDashboard'

import { AumtEvent, AumtWeeklyTraining } from '../../types'

import AdminStore from './AdminStore'
import TrainingAttendance from './Trainings/TrainingAttendance'

const MemberDashboardLazyWrapper = lazy(
  () =>
    import(
      './Members/MemberDashboard' /* webpackChunkName: "member-dashboard" */
    )
)

interface MainAdminProps extends RouteComponentProps {}

interface MainAdminState {
  menuOpen: boolean
  currentSelectedAdmin: string
  forms: AumtWeeklyTraining[]
  events: AumtEvent[]
}

class MainAdmin extends Component<MainAdminProps, MainAdminState> {
  private routeChangeListener: null | Function = null
  constructor(props: MainAdminProps) {
    super(props)
    this.state = {
      menuOpen: false,
      currentSelectedAdmin: 'trainings',
      forms: [],
      events: [],
    }
    AdminStore.addListeners(this.handleNewForms, this.handleNewEvents)
    this.routeChangeListener = null
  }

  componentDidMount = () => {
    this.routeChangeListener = this.props.history.listen(this.onRouteChange)
    this.setStateFromPathChange(window.location.pathname)
  }

  componentWillUnmount = () => {
    if (this.routeChangeListener) {
      this.routeChangeListener()
    }
    AdminStore.cleanup()
  }

  handleNewForms = (forms: AumtWeeklyTraining[]) => {
    this.setState({ ...this.state, forms })
  }

  handleNewEvents = (events: AumtEvent[]) => {
    this.setState({ ...this.state, events })
  }

  onRouteChange = (location: any, action: string) => {
    this.setStateFromPathChange(location.pathname)
  }

  /**
   * Sets current window path state. So when page refreshes it persists.
   * @param windowPath the current window path.
   */
  setStateFromPathChange = (windowPath: string) => {
    // Defaults to trainings page.
    let currentSelectedAdmin = 'trainings'
    if (
      windowPath.indexOf('/admin/events') > -1 ||
      windowPath.indexOf('/admin/createevent') > -1 ||
      windowPath.indexOf('/admin/editevent') > -1
    ) {
      currentSelectedAdmin = 'events'
    } else if (windowPath.indexOf('/admin/members') > -1) {
      currentSelectedAdmin = 'members'
    } else if (windowPath.indexOf('/admin/feedback') > -1) {
      currentSelectedAdmin = 'feedback'
    } else if (windowPath.indexOf('/admin/committee-apps') > -1) {
      currentSelectedAdmin = 'committee-apps'
    } else if (windowPath.indexOf('/admin/settings') > -1) {
      currentSelectedAdmin = 'settings'
    }

    this.setState({
      ...this.state,
      currentSelectedAdmin,
    })
  }

  setMenuOpen = (open: boolean) => {
    this.setState({ ...this.state, menuOpen: open })
  }

  handleMenuClick = (e: { key: Key }) => {
    this.setState({
      currentSelectedAdmin: String(e.key),
    })
  }

  getMenu = () => {
    return (
      <Menu
        className="adminMenu"
        onClick={this.handleMenuClick}
        selectedKeys={[this.state.currentSelectedAdmin]}
      >
        <Menu.Item key="trainings">
          <Link to="/admin">Trainings</Link>
        </Menu.Item>
        <Menu.Item key="events">
          <Link to="/admin/events">Events</Link>
        </Menu.Item>
        <Menu.Item key="members">
          <Link to="/admin/members">Members</Link>
        </Menu.Item>
        <Menu.Item key="feedback">
          <Link to="/admin/feedback">Feedback</Link>
        </Menu.Item>
        <Menu.Item key="settings">
          <Link to="/admin/settings">Settings</Link>
        </Menu.Item>
        <Menu.Item key="committee-apps">
          <Link to="/admin/committee-apps">Committee Apps</Link>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    return (
      <div className="adminContainer">
        {window.innerWidth < 1180 ? (
          <div className="openMenuButton">
            <Button onClick={(e) => this.setMenuOpen(true)}>
              <MenuOutlined />
              Admin
            </Button>
            <Drawer
              placement="left"
              visible={this.state.menuOpen}
              onClose={(e) => this.setMenuOpen(false)}
            >
              {this.getMenu()}
            </Drawer>
          </div>
        ) : (
          <div className="adminMenu">{this.getMenu()}</div>
        )}
        <div className="adminContent">
          <Switch>
            <Route path="/admin/events/:id">
              <EventSignups events={this.state.events}></EventSignups>
            </Route>

            <Route path="/admin/events">
              <div className="manageEventsContainer">
                <div className="mainAdminEventsHeader">
                  <h2 className="createEventTitle manageEventTitle">
                    Manage Events
                  </h2>
                  <Link
                    to="/admin/createevent"
                    className="mainAdminCreateEventButton"
                  >
                    <Button type="primary" size="large" shape="round">
                      Create Event <PlusOutlined />
                    </Button>
                  </Link>
                  <div className="clearBoth"></div>
                </div>
                <ManageEvents events={this.state.events}></ManageEvents>
              </div>
            </Route>

            <Route path="/admin/members">
              <MemberDashboardLazyWrapper></MemberDashboardLazyWrapper>
            </Route>

            <Route path="/admin/feedback">
              <Feedback forms={this.state.forms}></Feedback>
            </Route>

            <Route path="/admin/settings">
              <ClubSettings />
            </Route>

            <Route path="/admin/committee-apps">
              <CommitteeApps></CommitteeApps>
            </Route>

            <Route path="/admin/createtraining">
              <div className="mainAdminCreateFormContainer">
                <h2 className="createTrainingTitle">
                  <Link className="mainAdminCreateBack" to="/admin">
                    <ArrowLeftOutlined />
                  </Link>
                  Create Training
                </h2>
                <CreateTraining></CreateTraining>
              </div>
            </Route>

            <Route path="/admin/createevent">
              <div className="mainAdminCreateFormContainer">
                <h2 className="createTrainingTitle">
                  <Link className="mainAdminCreateBack" to="/admin/events">
                    <ArrowLeftOutlined />
                  </Link>
                  Create Event
                </h2>
                <CreateEvent></CreateEvent>
              </div>
            </Route>

            <Route path="/admin/edittraining/:trainingid">
              <div className="mainAdminCreateFormContainer">
                <div>
                  <h2 className="createTrainingTitle">
                    <Link className="mainAdminCreateBack" to="/admin">
                      <ArrowLeftOutlined />
                    </Link>
                    Edit
                  </h2>
                  <CreateTraining></CreateTraining>
                </div>
              </div>
            </Route>

            <Route
              path="/admin/attendance/:id"
              component={TrainingAttendance}
            />

            <Route path="/admin/editevent/:eventId">
              <div className="mainAdminCreateFormContainer">
                <div>
                  <h2 className="createTrainingTitle">
                    <Link className="mainAdminCreateBack" to="/admin/events">
                      <ArrowLeftOutlined />
                    </Link>
                    Edit Event
                  </h2>
                  <CreateEvent></CreateEvent>
                </div>
              </div>
            </Route>

            <Route path="/admin">
              <TrainingDashboard forms={this.state.forms}></TrainingDashboard>
            </Route>
          </Switch>
        </div>
      </div>
    )
  }
}

export default withRouter(MainAdmin)
