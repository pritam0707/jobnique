import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Navigation & Widgets
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChatWidget from "./components/AIChatWidget";
import WelcomeIntro from "./components/WelcomeIntro";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetails from "./pages/JobDetails";
import SalaryCalculator from "./pages/SalaryCalculator";
import ForgotPassword from "./pages/ForgotPassword";

// Employer Pages
import PostJob from "./pages/Employer/PostJob";
import EditJob from "./pages/Employer/EditJob";
import EmployerDashboard from "./pages/Employer/Dashboard";
import EmployerProfile from "./pages/Employer/Profile";

// Job Seeker Pages
import JobSeekerDashboard from "./pages/JobSeeker/Dashboard";
import JobSeekerProfile from "./pages/JobSeeker/Profile";
import Jobs from "./pages/JobSeeker/Jobs";

// Redux & Icons
import { fetchCurrentUser } from "./store/slices/authSlice";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

const DashboardRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === "Employer") {
    return <Navigate to="/employer/dashboard" replace />;
  }
  return <Navigate to="/jobseeker/dashboard" replace />;
};

// Helper component to block Employers from Job Seeker / Public pages
const JobSeekerOnlyRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === "Employer") {
    return <Navigate to="/employer/dashboard" replace />;
  }
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state) => state.auth);
  
  // Set showVideo to true by default so it shows on every page reload
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleVideoFinish = () => {
    setShowVideo(false);
  };

  // Full Screen Loading while initial app session re-hydrates
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
        <div className="p-4 rounded-2xl bg-[#EDF5FF] dark:bg-slate-800 text-[#2F80ED] dark:text-blue-400 mb-3">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-[#6B7280] dark:text-slate-400">
          Restoring your session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-slate-950 text-[#111827] dark:text-slate-100 selection:bg-[#56CCF2]/30 selection:text-[#111827] dark:selection:text-slate-100 flex flex-col relative overflow-x-hidden font-sans transition-colors duration-300">
      
      {/* Welcome Video Overlay on App Entry (Triggers on Reload) */}
      {showVideo && <WelcomeIntro onFinish={handleVideoFinish} />}

      {/* Global Sticky Navigation */}
      <Navbar />

      {/* Primary Application Body */}
      <main className="flex-1 relative z-10 flex flex-col">
        <Routes>
          {/* Public / Job Seeker Routes (Blocked for Employers) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route
            path="/jobs"
            element={
              <JobSeekerOnlyRoute>
                <Jobs />
              </JobSeekerOnlyRoute>
            }
          />
          <Route path="/jobs/:id" element={<JobDetails />} />
          
          <Route
            path="/salary"
            element={
              <JobSeekerOnlyRoute>
                <SalaryCalculator />
              </JobSeekerOnlyRoute>
            }
          />

          {/* Universal /dashboard Redirect Entry Point */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* Employer Protected Routes */}
          <Route
            path="/post-job"
            element={
              <ProtectedRoute role="Employer">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute role="Employer">
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute role="Employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <ProtectedRoute role="Employer">
                <EmployerProfile />
              </ProtectedRoute>
            }
          />

          {/* Job Seeker Protected Routes */}
          <Route
            path="/jobseeker/dashboard"
            element={
              <ProtectedRoute role="Job Seeker">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobseeker/profile"
            element={
              <ProtectedRoute role="Job Seeker">
                <JobSeekerProfile />
              </ProtectedRoute>
            }
          />

          {/* Default Fallback Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <JobSeekerProfile />
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route
            path="*"
            element={
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[70vh]">
                <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-[24px] p-10 max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col items-center transition-colors duration-300">
                  <div className="w-16 h-16 rounded-[16px] bg-[#EDF5FF] dark:bg-slate-800 text-[#2F80ED] dark:text-blue-400 flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8" strokeWidth={2} />
                  </div>
                  <h1 className="text-[24px] font-bold text-[#111827] dark:text-white tracking-tight mb-3">
                    404 - Page Not Found
                  </h1>
                  <p className="text-[16px] text-[#6B7280] dark:text-slate-400 mb-8 leading-relaxed">
                    The requested route does not exist or has been moved within the Jobnique platform.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-[16px] text-white bg-[#2F80ED] hover:bg-[#2563EB] shadow-[0_4px_14px_0_rgba(47,128,237,0.39)] transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Floating AI Chat Assistant */}
      <AIChatWidget />
    </div>
  );
}

export default App;