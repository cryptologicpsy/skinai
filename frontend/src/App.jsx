import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { RoutineProvider } from './context/RoutineContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import { fontsReadyPromise } from './fontsReady.js';

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

// Gates all routes behind two things: AuthContext's initial /api/auth/me
// check (without this, user-dependent UI like avatar initials briefly shows
// its "not logged in yet" state before snapping to the real one) AND the
// icon font being ready (otherwise the splash disappears and the first real
// page shows with every icon invisible for a few seconds on a slow
// connection — better to keep the splash up a little longer than reveal a
// page full of blank icon slots).
function AppShell() {
  const { loading } = useAuth();
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fontsReadyPromise.finally(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !fontsReady) return <SplashScreen />;

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
