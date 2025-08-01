import {
  ArrowLeftOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { Component, Key, lazy, useEffect, useState } from 'react'
import {
  Link,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'
import { AumtEvent, AumtWeeklyTraining } from '../../types'
import AdminStore from './AdminStore'
import { CommitteeApps } from './CommitteeApps/CommitteeApps'
import CreateEvent from './Events/CreateEvent'
import EventSignups from './Events/EventSignups'
import { ManageEvents } from './Events/ManageEvents'
import { Feedback } from './Feedback/Feedback'
import './MainAdmin.css'
import ClubSettings from './Settings/ClubSettings'
import CreateTraining from './Trainings/CreateTraining'
import TrainingAttendance from './Trainings/TrainingAttendance'
import { TrainingDashboard } from './Trainings/TrainingDashboard'

const MemberDashboardLazyWrapper = lazy(
  () =>
    import(
      './Members/MemberDashboard' /* webpackChunkName: "member-dashboard" */
    )
)

export default function MainAdmin() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [forms, setForms] = useState<AumtWeeklyTraining[]>([])
  const [events, setEvents] = useState<AumtEvent[]>([])

  useEffect(() => {
    AdminStore.addListeners(setForms, setEvents)
    return () => {
      AdminStore.cleanup()
    }
  }, [])

  return (
    <div className="adminContainer">
      {window.innerWidth < 1180 ? (
        <div className="openMenuButton">
          <Button onClick={(e) => setMenuOpen(true)}>
            <MenuOutlined />
            Admin
          </Button>
          <Drawer
            placement="left"
            open={menuOpen}
            onClose={(e) => setMenuOpen(false)}
          >
            <AdminMenu />
          </Drawer>
        </div>
      ) : (
        <div className="adminMenu">
          <AdminMenu />
        </div>
      )}
      <div className="adminContent">
        <Switch>
          <Route path="/admin/events/:id">
            <EventSignups events={events}></EventSignups>
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
              <ManageEvents events={events}></ManageEvents>
            </div>
          </Route>

          <Route path="/admin/members">
            <MemberDashboardLazyWrapper></MemberDashboardLazyWrapper>
          </Route>

          <Route path="/admin/feedback">
            <Feedback forms={forms}></Feedback>
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

          <Route path="/admin/attendance/:id" component={TrainingAttendance} />

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
            <TrainingDashboard forms={forms}></TrainingDashboard>
          </Route>
        </Switch>
      </div>
    </div>
  )
}

function AdminMenu() {
  const [currentSelectedAdmin, setCurrentSelectedAdmin] = useState('trainings')

  const items: ItemType[] = [
    {
      label: <Link to="/admin">Trainings</Link>,
      key: 'trainings',
    },
    {
      label: <Link to="/admin/events">Events</Link>,
      key: 'events',
    },
    {
      label: <Link to="/admin/members">Members</Link>,
      key: 'members',
    },
    {
      label: <Link to="/admin/feedback">Feedback</Link>,
      key: 'feedback',
    },
    {
      label: <Link to="/admin/settings">Settings</Link>,
      key: 'settings',
    },
    {
      label: <Link to="/admin/committee-apps">Committee Apps</Link>,
      key: 'committee-apps',
    },
  ]

  function handleMenuClick(e: { key: Key }) {
    setCurrentSelectedAdmin(String(e.key))
  }

  return (
    <Menu
      items={items}
      onClick={handleMenuClick}
      selectedKeys={[currentSelectedAdmin]}
    />
  )
}
