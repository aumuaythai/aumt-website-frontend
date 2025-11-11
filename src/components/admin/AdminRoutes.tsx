import { Route, Routes } from 'react-router'
import AdminLayout from './AdminLayout'
import CreateEvent from './events/CreateEvent'
import EventSignups from './events/EventSignups'
import ManageEvents from './events/ManageEvents'
import Feedback from './feedback/Feedback'
import MemberDashboard from './members/MemberDashboard'
import ClubSettings from './settings/ClubSettings'
import CreateTraining from './trainings/CreateTraining'
import TrainingAttendance from './trainings/TrainingAttendance'
import TrainingDashboard from './trainings/TrainingDashboard'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<TrainingDashboard />} />
        <Route path="/trainings/create" element={<CreateTraining />} />
        <Route path="/trainings/:trainingId" element={<CreateTraining />} />
        <Route
          path="/trainings/:trainingId/attendance"
          element={<TrainingAttendance />}
        />
        <Route path="/events" element={<ManageEvents />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/:eventId" element={<CreateEvent />} />
        <Route path="/events/:eventId/signups" element={<EventSignups />} />
        <Route path="/members" element={<MemberDashboard />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/settings" element={<ClubSettings />} />
      </Route>
    </Routes>
  )
}
