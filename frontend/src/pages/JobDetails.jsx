import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../api/axios";
import { toggleSaveJob } from "../store/slices/authSlice";
import {
  MapPin,
  IndianRupee,
  Building2,
  Send,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  UserCheck,
  Share2,
  Bookmark,
  FileText
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [applyStatus, setApplyStatus] = useState({ loading: false, message: "", error: "" });
  const [savingJob, setSavingJob] = useState(false);

  // String-safe and JSON-string-safe bookmark lookup
  const isSaved = () => {
    if (!user?.savedJobs) return false;
    let savedList = user.savedJobs;

    if (typeof savedList === "string") {
      try {
        savedList = JSON.parse(savedList);
      } catch (e) {
        savedList = savedList.split(",");
      }
    }

    if (!Array.isArray(savedList)) return false;

    return savedList.some((saved) => {
      const savedId = typeof saved === "object" ? (saved._id || saved.id) : saved;
      return String(savedId).replace(/^["']|["']$/g, "").trim() === String(id).replace(/^["']|["']$/g, "").trim();
    });
  };

  const savedStatus = isSaved();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // FIXED: Hits /jobs/single/:id endpoint matching jobRoutes.js
        const res = await api.get(`/jobs/single/${id}`);
        setJob(res.data?.job || res.data);
      } catch (err) {
        console.error("API Fetch error, looking up fallback seed list:", err);
        const matchedSeed = typeof SEED_JOBS !== "undefined" ? SEED_JOBS.find((j) => String(j._id || j.id) === String(id)) : null;
        if (matchedSeed) {
          setJob(matchedSeed);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setSavingJob(true);
    try {
      await dispatch(toggleSaveJob(id)).unwrap();
    } catch (err) {
      console.error("Failed to toggle save job:", err);
    } finally {
      setSavingJob(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setApplyStatus({ loading: true, message: "", error: "" });
    try {
      await api.post(`/applications/${id}/apply`, { coverLetter });
      setApplyStatus({
        loading: false,
        message: "Application submitted successfully! Our team will review it shortly.",
        error: "",
      });
      setCoverLetter("");
    } catch (err) {
      setApplyStatus({
        loading: false,
        message: "",
        error: err.response?.data?.message || "Failed to submit application. Please try again.",
      });
    }
  };

  // Loading State Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-950 border-t-[#2F80ED] dark:border-t-[#56CCF2] animate-spin" />
          <Sparkles className="w-6 h-6 text-[#2F80ED] dark:text-[#56CCF2] absolute animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Loading opportunity details...</p>
      </div>
    );
  }

  // Not Found State
  if (!job) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 font-sans transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-[#111827] border border-slate-100 dark:border-[#1F2937] rounded-3xl p-8 text-center shadow-md">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Listing Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            This job position might have been closed, removed, or is temporarily unavailable.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="px-6 py-3 bg-[#2F80ED] hover:bg-blue-600 text-white rounded-2xl text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-sm active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation / Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] hover:border-slate-300 dark:hover:border-[#374151] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-semibold shadow-sm transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              disabled={savingJob}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                savedStatus
                  ? "bg-blue-50 dark:bg-[#2F80ED]/20 border-blue-200 dark:border-[#2F80ED]/40 text-[#2F80ED] dark:text-[#56CCF2]"
                  : "bg-white dark:bg-[#111827] border-slate-200 dark:border-[#1F2937] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {savingJob ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#2F80ED] dark:text-[#56CCF2]" />
              ) : (
                <Bookmark className={`w-4 h-4 ${savedStatus ? "fill-current text-[#2F80ED] dark:text-[#56CCF2]" : ""}`} />
              )}
              <span className="hidden sm:inline">{savedStatus ? "Saved" : "Save Job"}</span>
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="p-2.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] hover:border-slate-300 dark:hover:border-[#374151] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#111827] border border-slate-100 dark:border-[#1F2937] rounded-3xl shadow-sm relative overflow-hidden transition-colors duration-300">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              
              {/* Company Avatar Badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 dark:bg-[#1F2937] border border-blue-100 dark:border-[#374151] flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-[#2F80ED] dark:text-[#56CCF2]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-[#2F80ED]/10 border border-blue-100 dark:border-[#2F80ED]/30 text-[#2F80ED] dark:text-[#56CCF2] rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {job.category || "General"}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                    Full-time
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {job.title}
                </h1>

                {job.employer && (
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>Posted by</span>
                    <span className="text-[#2F80ED] dark:text-[#56CCF2] font-semibold">{job.employer.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics Badge Grid */}
            <div className="flex flex-wrap lg:flex-col gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-[#1F2937]">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-[#1F2937] border border-slate-200/60 dark:border-[#374151] rounded-xl text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-[#2F80ED] dark:text-[#56CCF2] shrink-0" />
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {job.city && job.country ? `${job.city}, ${job.country}` : "Remote / Global"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-xs sm:text-sm">
                <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  {job.fixedSalary
                    ? `₹${Number(job.fixedSalary).toLocaleString("en-IN")}/yr`
                    : job.salaryFrom && job.salaryTo
                    ? `₹${Number(job.salaryFrom).toLocaleString("en-IN")} - ₹${Number(job.salaryTo).toLocaleString("en-IN")}/yr`
                    : "Competitive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Details & Application Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Job Description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 bg-white dark:bg-[#111827] border border-slate-100 dark:border-[#1F2937] rounded-3xl shadow-sm transition-colors duration-300">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-[#1F2937]">
                <FileText className="w-5 h-5 text-[#2F80ED] dark:text-[#56CCF2]" />
                <span>Job Description & Requirements</span>
              </h2>

              <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                {job.description}
              </div>
            </div>

            <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100/60 dark:bg-blue-900/50 text-[#2F80ED] dark:text-[#56CCF2] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Direct Employer Response</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Applications submitted on Jobnique go directly to the hiring manager’s inbox with real-time response tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 p-6 sm:p-8 bg-white dark:bg-[#111827] border border-slate-100 dark:border-[#1F2937] rounded-3xl shadow-sm transition-colors duration-300">
              
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Send className="w-5 h-5 text-[#2F80ED] dark:text-[#56CCF2]" />
                  <span>Apply for Position</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submit your application along with a customized cover letter.
                </p>
              </div>

              {/* Status Notifications */}
              {applyStatus.message && (
                <div className="p-4 mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
                    {applyStatus.message}
                  </p>
                </div>
              )}

              {applyStatus.error && (
                <div className="p-4 mb-6 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium leading-relaxed">
                    {applyStatus.error}
                  </p>
                </div>
              )}

              {/* Conditional Rendering according to Auth & Role */}
              {(!isAuthenticated || user?.role === "Job Seeker") ? (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Cover Letter <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Introduce yourself or highlight key experiences that make you a great fit..."
                      rows={6}
                      className="w-full p-4 bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-[#374151] focus:border-[#2F80ED] dark:focus:border-[#56CCF2] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl outline-none transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applyStatus.loading}
                    className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] shadow-md shadow-blue-500/20 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applyStatus.loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
                      Applying as a guest will prompt you to <Link to="/login" className="text-[#2F80ED] dark:text-[#56CCF2] font-semibold hover:underline">Log In</Link>.
                    </p>
                  )}
                </form>
              ) : (
                <div className="p-6 bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-[#374151] rounded-2xl text-center">
                  <Building2 className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Employer Account Active</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    You are currently logged in as an Employer. Application submission is available for Job Seekers only.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default JobDetails;