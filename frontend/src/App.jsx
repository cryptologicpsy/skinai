import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { RoutineProvider } from './context/RoutineContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

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

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
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
      </AuthProvider>
    </ToastProvider>
  );
}
