import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Facility from './pages/Facility';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import ActivityList from './pages/ActivityList';
import ActivityDetail from './pages/ActivityDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/facility" element={<Facility />} />
        <Route path="/room" element={<RoomList />} />
        <Route path="/room/:slug" element={<RoomDetail />} />
        <Route path="/activity" element={<ActivityList />} />
        <Route path="/activity/:slug" element={<ActivityDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
