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
  AlertCircle,
  ArrowLeft,
  Trash2,
  Edit,
  Check,
  X,
  UserCheck,
  Mail,
  MapPin,
  Building2,
  ToggleLeft,
  ToggleRight,
  Phone,
  FileText,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import MyApplicationsPanel from "../JobSeeker/MyApplicationsPanel";
import AIRecommendationsPanel from "../JobSeeker/AIRecommendationsPanel";

// Helper to point relative file paths to Express port 4000 for PDF viewing
const formatResumeUrl = (url) => {
  if (!url) return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const backendBase = "http://localhost:4000";
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${backendBase}${cleanPath}`;
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const isEmployer = user?.role === "Employer";

  // Active View State: "main" | "jobs" | "pending" | "active" | "hired"
  const [activeWindow, setActiveWindow] = useState("main");

  // Deletion Modal State
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ Contact Candidate Modal State
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Raw Data & Stats State
  const [jobsData, setJobsData] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingResponses: 0,
    activeJobs: 0,
    hiredCandidates: 0,
  });
  const [loading, setLoading] = useState(isEmployer);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Per-job status toggle loading state
  const [togglingJobId, setTogglingJobId] = useState(null);

  // Helper to determine if a job is currently active/open
  const isJobActive = (job) => {
    if (job?.status) {
      return job.status.toLowerCase() === "active";
    }
    if (job?.expired !== undefined) {
      return !job.expired;
    }
    return job?.isOpen === true;
  };

  // Fetch Employer Jobs and calculate statistics
  const fetchEmployerData = async () => {
    if (!isEmployer) return;
    try {
      setLoading(true);
      const res = await api.get("/jobs/employer/my-jobs");
      const jobs = res.data?.jobs || res.data || [];
      setJobsData(jobs);

      let totalCount = jobs.length;
      let activeCount = 0;
      let pendingCount = 0;
      let hiredCount = 0;

      jobs.forEach((job) => {
        if (isJobActive(job)) {
          activeCount += 1;
        }

        if (Array.isArray(job.applications)) {
          job.applications.forEach((app) => {
            const status = app.status?.toLowerCase();
            if (status === "pending" || status === "submitted") {
              pendingCount += 1;
            } else if (status === "accepted" || status === "hired") {
              hiredCount += 1;
            }
          });
        }
      });

      setStats({
        totalJobs: totalCount,
        activeJobs: activeCount,
        pendingResponses: pendingCount,
        hiredCandidates: hiredCount,
      });
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Failed to load recruitment metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerData();
  }, [isEmployer]);

  // Handle Application Accept/Decline Action
  const handleApplicationStatus = async (applicationId, status) => {
    try {
      setActionLoading(true);
      await api.put(`/applications/status/${applicationId}`, { status });
      await fetchEmployerData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update application status");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle a job between Active (open) and Inactive (closed)
  const handleToggleJobStatus = async (jobId, currentlyActive) => {
    try {
      setTogglingJobId(jobId);
      await api.put(`/jobs/status/${jobId}`, {
        status: !currentlyActive ? "Active" : "Inactive",
        isOpen: !currentlyActive,
        expired: currentlyActive,
      });
      await fetchEmployerData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update job status");
    } finally {
      setTogglingJobId(null);
    }
  };

  // Open custom modal for job deletion
  const openDeleteModal = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  // Execute job deletion via API
  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      setActionLoading(true);
      await api.delete(`/jobs/delete/${jobToDelete}`);
      await fetchEmployerData();
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    } finally {
      setActionLoading(false);
    }
  };

  // Aggregated applications list for sub-windows
  const getAllApplications = () => {
    let list = [];
    jobsData.forEach((job) => {
      if (Array.isArray(job.applications)) {
        job.applications.forEach((app) => {
          list.push({ 
            ...app, 
            jobTitle: job.title, 
            jobId: job.id || job._id,
            applicantName: app.applicantName || app.applicant?.name || app.name || "Candidate",
            applicantEmail: app.applicantEmail || app.applicant?.email || app.email || "No email attached",
            applicantPhone: app.applicantPhone || app.applicant?.phone || app.phone || "Not provided",
            resumeUrl: app.resumeUrl || app.applicant?.resumeUrl || app.resume || app.applicant?.resume,
            coverLetter: app.coverLetter || app.letter
          });
        });
      }
    });
    return list;
  };

  // Render Sub-Window Views when a Glass Card is clicked
  const renderSubWindow = () => {
    const allApplications = getAllApplications();

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Sub-Window Header with Back Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveWindow("main")}
              className="p-2.5 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white capitalize">
                {activeWindow === "jobs" && "Posted Jobs Management"}
                {activeWindow === "pending" && "Pending Application Reviews"}
                {activeWindow === "active" && "Active Job Listings"}
                {activeWindow === "hired" && "Hired & Selected Candidates"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage, review, and organize records dynamically.
              </p>
            </div>
          </div>

          {activeWindow === "jobs" && (
            <Link
              to="/post-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
          )}
        </div>

        {/* 1. JOBS POSTED SUB-WINDOW */}
        {activeWindow === "jobs" && (
          <div className="space-y-4">
            {jobsData.length === 0 ? (
              <div className="p-12 text-center bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl backdrop-blur-md">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Jobs Posted Yet</h3>
                <p className="text-xs text-slate-500 mt-1">Click above to post your first position.</p>
              </div>
            ) : (
              jobsData.map((job) => {
                const jobId = job.id || job._id;
                const activeStatus = isJobActive(job);
                const isToggling = togglingJobId === jobId;

                return (
                  <div
                    key={jobId}
                    className="p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-blue-400/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            activeStatus
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {activeStatus ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location || job.city || "Remote"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {job.category || "Engineering"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                          {job.applications?.length || 0} Applicants
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleJobStatus(jobId, activeStatus)}
                        disabled={isToggling}
                        title={activeStatus ? "Deactivate Job" : "Activate Job"}
                        className={`p-2.5 rounded-2xl transition-colors disabled:opacity-50 ${
                          activeStatus
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : activeStatus ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </button>
                      <Link
                        to={`/edit-job/${jobId}`}
                        className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(jobId)}
                        disabled={actionLoading}
                        className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 2. PENDING RESPONSES SUB-WINDOW */}
        {activeWindow === "pending" && (
          <div className="space-y-4">
            {allApplications.filter((a) => ["pending", "submitted"].includes(a.status?.toLowerCase())).length === 0 ? (
              <div className="p-12 text-center bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl backdrop-blur-md">
                <Clock className="w-12 h-12 text-amber-500/60 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Pending Applications</h3>
                <p className="text-xs text-slate-500 mt-1">All applicant submissions have been reviewed.</p>
              </div>
            ) : (
              allApplications
                .filter((a) => ["pending", "submitted"].includes(a.status?.toLowerCase()))
                .map((app) => (
                  <div
                    key={app.id || app._id}
                    className="p-6 bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-900/40 rounded-3xl shadow-sm flex flex-col gap-5 hover:border-amber-400/50 transition-all"
                  >
                    {/* Top Info Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200/50">
                          Applied for: {app.jobTitle}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                          {app.applicantName}
                        </h3>
                      </div>

                      {/* Contact Badges */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          {app.applicantEmail}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          {app.applicantPhone}
                        </span>
                      </div>
                    </div>

                    {/* Cover Letter Section */}
                    {app.coverLetter && (
                      <div className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/80 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                          <FileText className="w-3.5 h-3.5 text-blue-500" />
                          <span>Cover Letter Preview:</span>
                        </div>
                        <p className="line-clamp-3">{app.coverLetter}</p>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      {/* View Resume / CV Button */}
                      {app.resumeUrl ? (
                        <a
                          href={formatResumeUrl(app.resumeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs transition-all flex items-center gap-2 border border-blue-200/50"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Applicant CV</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No CV attached</span>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2.5">
                        <a
                          href={`mailto:${app.applicantEmail}?subject=Interview Invitation for ${encodeURIComponent(app.jobTitle)} position at Jobnique`}
                          className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-semibold text-xs transition-all flex items-center gap-1.5 border border-indigo-200/50"
                          title="Schedule Interview via Mail"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Send Message</span>
                        </a>

                        <button
                          onClick={() => handleApplicationStatus(app.id || app._id, "Accepted")}
                          disabled={actionLoading}
                          className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept Candidate</span>
                        </button>

                        <button
                          onClick={() => handleApplicationStatus(app.id || app._id, "Rejected")}
                          disabled={actionLoading}
                          className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* 3. ACTIVE LISTINGS SUB-WINDOW */}
        {activeWindow === "active" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobsData.filter((j) => isJobActive(j)).length === 0 ? (
              <div className="col-span-2 p-12 text-center bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl backdrop-blur-md">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/60 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Active Jobs</h3>
                <p className="text-xs text-slate-500 mt-1">Create or re-open listings to accept applications.</p>
              </div>
            ) : (
              jobsData
                .filter((j) => isJobActive(j))
                .map((job) => {
                  const jobId = job.id || job._id;
                  const isToggling = togglingJobId === jobId;

                  return (
                    <div
                      key={jobId}
                      className="p-6 bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-900/40 rounded-3xl shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold mb-3">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Open & Receiving Resumes</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                          {job.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-500">
                          {job.applications?.length || 0} Total Applicants
                        </span>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/edit-job/${jobId}`}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Edit Job Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleToggleJobStatus(jobId, true)}
                            disabled={isToggling}
                            className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                            title="Deactivate this listing"
                          >
                            {isToggling ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ToggleRight className="w-3.5 h-3.5" />
                            )}
                            <span>Deactivate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* 4. HIRED CANDIDATES SUB-WINDOW */}
        {activeWindow === "hired" && (
          <div className="space-y-4">
            {allApplications.filter((a) => ["accepted", "hired"].includes(a.status?.toLowerCase())).length === 0 ? (
              <div className="p-12 text-center bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl backdrop-blur-md">
                <Users className="w-12 h-12 text-sky-500/60 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Hired Candidates Yet</h3>
                <p className="text-xs text-slate-500 mt-1">Accepted candidates will show up here.</p>
              </div>
            ) : (
              allApplications
                .filter((a) => ["accepted", "hired"].includes(a.status?.toLowerCase()))
                .map((app) => (
                  <div
                    key={app.id || app._id}
                    className="p-6 bg-white/80 dark:bg-slate-900/80 border border-sky-200/60 dark:border-sky-900/40 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 text-[11px] font-bold mb-2">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Hired for {app.jobTitle}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {app.applicantName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {app.applicantEmail}
                      </p>
                    </div>

                    {/* ✅ Triggers Popup Modal */}
                    <button
                      onClick={() => setSelectedCandidate(app)}
                      className="px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Contact Candidate</span>
                    </button>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-slate-950 text-slate-800 dark:text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
        {/* Render Sub-Window or Main Dashboard */}
        {activeWindow !== "main" && isEmployer ? (
          renderSubWindow()
        ) : (
          <>
            {/* Expanded Hero Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-md backdrop-blur-xl transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-tight shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Jobnique Workspace</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                    Welcome back,{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-300 bg-clip-text text-transparent">
                      {user?.name || "User"}
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    {isEmployer
                      ? "Control hiring pipelines, review candidate applications, and track active positions from your 3D interactive dashboard."
                      : "Track active applications, discover AI-matched career opportunities, and manage your job search pipeline."}
                  </p>
                </div>

                <div className="shrink-0">
                  {isEmployer ? (
                    <Link
                      to="/post-job"
                      className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 active:scale-95 transition-all duration-200"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Post New Position</span>
                    </Link>
                  ) : (
                    <Link
                      to="/jobs"
                      className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 active:scale-95 transition-all duration-200"
                    >
                      <Search className="w-5 h-5" />
                      <span>Explore Open Roles</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* 2x2 Glassmorphism Cards Section for Employers */}
            {isEmployer && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Recruitment Metrics & Interactive Control Panels</span>
                  </h2>
                </div>

                {loading ? (
                  <div className="p-10 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-3 text-slate-400 text-xs backdrop-blur-md">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Syncing recruitment pipelines...</span>
                  </div>
                ) : error ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{error}</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Jobs Posted */}
                    <div
                      onClick={() => setActiveWindow("jobs")}
                      className="group cursor-pointer p-8 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px]"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />

                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Jobs Posted
                        </span>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                          <Briefcase className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="relative z-10 mt-4">
                        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                          {stats.totalJobs}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Total listings created • Click to manage, edit & delete
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Pending Responses */}
                    <div
                      onClick={() => setActiveWindow("pending")}
                      className="group cursor-pointer p-8 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px]"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />

                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Pending Responses
                        </span>
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
                          <Clock className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="relative z-10 mt-4">
                        <div className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                          {stats.pendingResponses}
                          {stats.pendingResponses > 0 && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 animate-pulse">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Applications awaiting review • Click to accept or decline queries
                        </p>
                      </div>
                    </div>

                    {/* Card 3: Active Listings */}
                    <div
                      onClick={() => setActiveWindow("active")}
                      className="group cursor-pointer p-8 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px]"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />

                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Active Listings
                        </span>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="relative z-10 mt-4">
                        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                          {stats.activeJobs}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Currently open listings • Click to review active positions
                        </p>
                      </div>
                    </div>

                    {/* Card 4: Hired Candidates */}
                    <div
                      onClick={() => setActiveWindow("hired")}
                      className="group cursor-pointer p-8 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px]"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />

                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Hired Candidates
                        </span>
                        <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl group-hover:scale-110 transition-transform">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="relative z-10 mt-4">
                        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                          {stats.hiredCandidates}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Accepted applicants • Click to view hired candidate profiles
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Job Seeker View Controls */}
            {!isEmployer && (
              <div className="grid gap-8 lg:grid-cols-3 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <MyApplicationsPanel />
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 shadow-sm backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        AI Job Recommendations
                      </h3>
                    </div>

                    <AIRecommendationsPanel />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ✅ Contact Candidate Interactive Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative">
              {/* Close Icon Button */}
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Candidate Info</h3>
                  <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                    Hired for {selectedCandidate.jobTitle}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Candidate Name */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Full Name
                  </span>
                  <p className="text-slate-900 dark:text-white font-semibold text-sm">
                    {selectedCandidate.applicantName}
                  </p>
                </div>

                {/* Email Address */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedCandidate.applicantEmail}`}
                    className="text-sky-600 dark:text-sky-400 hover:underline font-medium text-sm flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{selectedCandidate.applicantEmail}</span>
                  </a>
                </div>

                {/* Phone Number */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Phone Number
                  </span>
                  <a
                    href={`tel:${selectedCandidate.applicantPhone}`}
                    className="text-slate-800 dark:text-slate-200 hover:text-sky-600 font-medium text-sm flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{selectedCandidate.applicantPhone || "Not provided"}</span>
                  </a>
                </div>

                {/* Resume URL */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Resume Document
                  </span>
                  {selectedCandidate.resumeUrl ? (
                    <a
                      href={formatResumeUrl(selectedCandidate.resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:underline font-semibold text-sm mt-1"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Resume (PDF)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs italic">No resume attached</span>
                  )}
                </div>
              </div>

              {/* Close Action */}
              <div className="mt-6">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs transition-all"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom In-App Deletion Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Job Listing?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This action cannot be undone. All associated candidate records will be permanently removed.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setJobToDelete(null);
                  }}
                  disabled={actionLoading}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteJob}
                  disabled={actionLoading}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;