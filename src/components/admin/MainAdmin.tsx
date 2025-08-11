import {
  ArrowLeftOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { lazy, useEffect, useState } from 'react'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { AumtEvent, AumtWeeklyTraining } from '../../types'
import AdminStore from './AdminStore'
import CreateEvent from './events/CreateEvent'
import EventSignups from './events/EventSignups'
import { ManageEvents } from './events/ManageEvents'
import { Feedback } from './feedback/Feedback'
import './MainAdmin.css'
import ClubSettings from './settings/ClubSettings'
import CreateTraining from './trainings/CreateTraining'
import TrainingAttendance from './trainings/TrainingAttendance'
import { TrainingDashboard } from './trainings/TrainingDashboard'

const MemberDashboardLazyWrapper = lazy(
  () =>
    import(
      './members/MemberDashboard' /* webpackChunkName: "member-dashboard" */
    )
)

export default function MainAdmin() {
  const { userIsAdmin } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)
  const [forms, setForms] = useState<AumtWeeklyTraining[]>([])
  const [events, setEvents] = useState<AumtEvent[]>([])

  useEffect(() => {
    AdminStore.addListeners(setForms, setEvents)
    return () => {
      AdminStore.cleanup()
    }
  }, [])

  if (!userIsAdmin) {
    return <div>You are not authorised to access this page.</div>
  }

  return (
    <div className="text-left flex min-h-[calc(100vh-50px)] h-0">
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
        <div className="w-40">
          <AdminMenu />
        </div>
      )}

      <Switch>
        <Route path="/admin/events/:id">
          <EventSignups events={events} />
        </Route>

        <Route path="/admin/events">
          <div className="manageEventsContainer">
            <div className="mainAdminEventsHeader">
              <h2 className="createEventTitle manageEventTitle text-xl">
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
            <ManageEvents events={events} />
          </div>
        </Route>

        <Route path="/admin/members">
          <MemberDashboardLazyWrapper />
        </Route>

        <Route path="/admin/feedback">
          <Feedback forms={forms} />
        </Route>

        <Route path="/admin/settings">
          <ClubSettings />
        </Route>

        <Route path="/admin/createtraining">
          <div className="mainAdminCreateFormContainer">
            <h2 className="createTrainingTitle">
              <Link className="mainAdminCreateBack" to="/admin">
                <ArrowLeftOutlined />
              </Link>
              Create Training
            </h2>
            <CreateTraining />
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
            <CreateEvent />
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
              <CreateTraining />
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
              <CreateEvent />
            </div>
          </div>
        </Route>

        <Route path="/admin">
          <TrainingDashboard forms={forms} />
        </Route>
      </Switch>
    </div>
  )
}

function AdminMenu() {
  const location = useLocation()
  const selectedKey = location.pathname.split('/')[2] || 'trainings'

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
  ]

  return <Menu items={items} selectedKeys={[selectedKey]} />
}
