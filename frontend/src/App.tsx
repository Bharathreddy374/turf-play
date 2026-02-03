import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login.tsx';
import Signup from './pages/Auth/Signup.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import AdminDashboard from './pages/Admin/AdminDashboard.tsx';
import TurfManagement from './pages/Admin/TurfManagement.tsx';
import TurfList from './pages/Turfs/TurfList.tsx';
import TurfDetails from './pages/Turfs/TurfDetails.tsx';
import UserProvider from './context/UserContext.tsx';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/turfs" element={<TurfManagement />} />
          <Route path="/turfs" element={<TurfList />} />
          <Route path="/turfs/:id" element={<TurfDetails />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
