import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  Sparkles,
  PlusCircle,
  Search,
  Briefcase,
  Clock,
  CheckCircle2,
  Users,
  Loader2,
  AlertCircle
} from "lucide-react";
import EmployerJobsPanel from "./EmployerJobsPanel";
import MyApplicationsPanel from "../JobSeeker/MyApplicationsPanel";
import AIRecommendationsPanel from "../JobSeeker/AIRecommendationsPanel";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const isEmployer = user?.role === "Employer";

  // Employer Stats State
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingResponses: 0,
    activeJobs: 0,
    hiredCandidates: 0,
  });
  const [loadingStats, setLoadingStats] = useState(isEmployer);
  const [statsError, setStatsError] = useState("");

  // Fetch real-time employer metrics
  useEffect(() => {
    if (!isEmployer) return;

    const fetchEmployerStats = async () => {
      try {
        setLoadingStats(true);
        // Fetch posted jobs and application responses
        const res = await api.get("/jobs/employer/my-jobs");
        const jobs = res.data?.jobs || res.data || [];

        let totalJobsCount = jobs.length;
        let activeJobsCount = 0;
        let pendingCount = 0;
        let hiredCount = 0;

        jobs.forEach((job) => {
          if (job.status === "Active" || job.isOpen !== false) {
            activeJobsCount += 1;
          }

          // Count applications and pending reviews
          if (Array.isArray(job.applications)) {
            job.applications.forEach((app) => {
              if (app.status === "Pending" || app.status === "Submitted") {
                pendingCount += 1;
              } else if (app.status === "Accepted" || app.status === "Hired") {
                hiredCount += 1;
              }
            });
          }
        });

        setStats({
          totalJobs: totalJobsCount,
          activeJobs: activeJobsCount,
          pendingResponses: pendingCount,
          hiredCandidates: hiredCount,
        });
      } catch (err) {
        console.error("Failed to fetch employer dashboard metrics:", err);
        setStatsError("Could not calculate dynamic application metrics");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchEmployerStats();
  }, [isEmployer]);

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-slate-950 text-slate-800 dark:text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
        
        {/* Interactive Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 sm:p-10 shadow-sm transition-all duration-300 hover:shadow-md">
          {/* Top Decorative Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 dark:from-blue-500 dark:via-indigo-400 dark:to-sky-300" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Jobnique Workspace</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {user?.name || "User"}
                </span>
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                {isEmployer
                  ? "Track active postings, evaluate incoming candidate applications, and respond to pending hiring requests."
                  : "Track active applications, discover AI-matched career opportunities, and manage your pipeline."}
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="shrink-0">
              {isEmployer ? (
                <Link
                  to="/post-job"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post New Position</span>
                </Link>
              ) : (
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Open Roles</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Employer Real-Time Metrics Summary Card */}
        {isEmployer && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Recruitment Activity & Pending Responses</span>
              </h2>
            </div>

            {loadingStats ? (
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span>Calculating active job postings and candidate queues...</span>
              </div>
            ) : statsError ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{statsError}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1: Total Jobs Posted */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Jobs Posted
                    </span>
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.totalJobs}</div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Total listings created by you</p>
                </div>

                {/* Metric 2: Pending Responses Needed */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-amber-200 dark:hover:border-amber-800 transition-all relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Pending Responses
                    </span>
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    {stats.pendingResponses}
                    {stats.pendingResponses > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                        Action Required
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Applications awaiting your review</p>
                </div>

                {/* Metric 3: Active Jobs */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Active Listings
                    </span>
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.activeJobs}</div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Currently open to applicants</p>
                </div>

                {/* Metric 4: Hired / Selected */}
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-sky-200 dark:hover:border-sky-800 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Hired Candidates
                    </span>
                    <div className="p-2 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-xl">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.hiredCandidates}</div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Accepted candidate applications</p>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Workspace Listings & Panels */}
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          <div className={`${isEmployer ? "lg:col-span-3" : "lg:col-span-2"} space-y-6`}>
            {isEmployer ? <EmployerJobsPanel /> : <MyApplicationsPanel />}
          </div>

          {!isEmployer && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                    AI Job Recommendations
                  </h3>
                </div>

                <AIRecommendationsPanel />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;