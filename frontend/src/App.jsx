import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { RoutineProvider } from './context/RoutineContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import SplashScreen from './components/SplashScreen.jsx';

import Welcome from './pages/Welcome.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SkinAnalysis from './pages/SkinAnalysis.jsx';
import AnalysisResults from './pages/AnalysisResults.jsx';
import Routine from './pages/Routine.jsx';
import Chat from './pages/Chat.jsx';
import Progress from './pages/Progress.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

// Gates all routes behind AuthContext's initial /api/auth/me check — without
// this, any user-dependent UI (avatar initials, first name, etc.) briefly
// renders its "not logged in yet" state and then snaps to the real one a
// moment later, which reads as the page being broken/unsettled on load.
function AppShell() {
  const { loading } = useAuth();
  if (loading) return <SplashScreen />;

  return (
    <RoutineProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/questionnaire" element={<Questionnaire />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<SkinAnalysis />} />
        <Route path="/analysis/results" element={<AnalysisResults />} />
        <Route path="/routine" element={<Routine />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RoutineProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ToastProvider>
  );
}
