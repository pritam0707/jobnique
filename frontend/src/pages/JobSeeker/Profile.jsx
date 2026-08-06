import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { fetchCurrentUser } from "../../store/slices/authSlice";
import {
  User,
  Phone,
  Mail,
  FileText,
  Upload,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Save,
  Cpu,
  BadgeCheck,
  X,
  Edit,
  Trash2,
  Star,
  Zap,
  Bookmark,
  Building2,
  MapPin,
  ArrowUpRight,
  AlertTriangle,
  Tag
} from "lucide-react";

// Formatted AI Output helper
const FormattedAIOutput = ({ text }) => {
  if (!text) return null;
  const rawSections = text.split(/(?=\*\*[^*]+\*\*)/g);

  return (
    <div className="space-y-4">
      {rawSections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        const headerMatch = trimmed.match(/^\*\*([^*]+)\*\*/);
        const headerTitle = headerMatch ? headerMatch[1].trim() : "";
        const bodyText = headerMatch ? trimmed.replace(/^\*\*([^*]+)\*\*/, "").trim() : trimmed;

        if (headerTitle.toLowerCase().includes("overall score")) return null;

        let icon = <Zap className="w-4 h-4 text-blue-600" />;
        let headerColor = "text-blue-700";
        let bulletIcon = <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />;

        if (headerTitle.toLowerCase().includes("strength")) {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
          headerColor = "text-emerald-700";
          bulletIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />;
        } else if (headerTitle.toLowerCase().includes("improve") || headerTitle.toLowerCase().includes("gap")) {
          icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
          headerColor = "text-amber-700";
          bulletIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />;
        } else if (headerTitle.toLowerCase().includes("keyword") || headerTitle.toLowerCase().includes("skill")) {
          icon = <Tag className="w-4 h-4 text-sky-600" />;
          headerColor = "text-sky-700";
          bulletIcon = <Tag className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />;
        }

        const lines = bodyText.split("\n").filter((l) => l.trim() !== "");

        return (
          <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            {headerTitle && (
              <h3 className={`text-sm font-bold ${headerColor} flex items-center gap-2 border-b border-slate-200 pb-2 mb-3`}>
                {icon}
                <span>{headerTitle}</span>
              </h3>
            )}

            <div className="space-y-2">
              {lines.map((line, lIdx) => {
                const isBullet = line.trim().startsWith("*") || line.trim().startsWith("-");
                const cleanLine = line.replace(/^[*-]\s*/, "").trim();

                const formattedHtml = cleanLine.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-slate-900 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">$1</strong>'
                );

                if (isBullet) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {bulletIcon}
                      <p className="flex-1" dangerouslySetInnerHTML={{ __html: formattedHtml }} />
                    </div>
                  );
                }

                return (
                  <p key={lIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedHtml }} />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Scorecard Component
const ResumeScoreCard = ({ text }) => {
  if (!text) return null;

  const scoreMatch = text.match(/Overall Score:\s*\*?(\d+)(?:\/(\d+))?\*?/i) || text.match(/(\d+)\/10/);
  
  let scoreNum = 7;
  let maxScore = 10;

  if (scoreMatch) {
    scoreNum = parseInt(scoreMatch[1], 10);
    if (scoreMatch[2]) maxScore = parseInt(scoreMatch[2], 10);
  }

  const percentage = Math.min(100, Math.round((scoreNum / maxScore) * 100));

  let scoreColor = "text-emerald-600";
  let strokeColor = "#10B981";
  let badgeBg = "bg-emerald-50 border-emerald-200 text-emerald-700";
  let label = "Strong Candidate";

  if (percentage < 50) {
    scoreColor = "text-red-600";
    strokeColor = "#EF4444";
    badgeBg = "bg-red-50 border-red-200 text-red-700";
    label = "Needs Optimization";
  } else if (percentage < 75) {
    scoreColor = "text-amber-600";
    strokeColor = "#F59E0B";
    badgeBg = "bg-amber-50 border-amber-200 text-amber-700";
    label = "Good Potential";
  }

  const summaryMatch = text.match(/\*\*Overall Score:[^*]+\*\*\s*([\s\S]*?)$/i);
  const summaryText = summaryMatch ? summaryMatch[1].trim() : "";

  return (
    <div className="p-5 sm:p-6 bg-blue-600 border border-blue-500 rounded-3xl shadow-lg shadow-blue-500/15 relative overflow-hidden mb-6 text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold">
            <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>AI Audit Breakdown</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            Resume Audit Index
          </h3>

          <p className="text-xs text-blue-100 max-w-md leading-relaxed">
            {summaryText || "Calculated based on skill density, formatting clarity, quantifiable impact metrics, and key industry term alignment."}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shrink-0 min-w-[150px] shadow-sm text-slate-800">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="transition-all duration-1000 ease-out"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke={strokeColor}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-lg font-extrabold ${scoreColor}`}>
                {scoreNum}/{maxScore}
              </span>
            </div>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badgeBg}`}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form States
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user]);

  // Resume States
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [resumeMsg, setResumeMsg] = useState("");
  const [resumeErr, setResumeErr] = useState("");

  // AI Analysis States
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeErr, setAnalyzeErr] = useState("");

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    setProfileErr("");
    try {
      await api.put("/auth/profile", form);
      await dispatch(fetchCurrentUser());
      setProfileMsg("Profile details updated successfully");
      setTimeout(() => {
        setIsEditModalOpen(false);
        setProfileMsg("");
      }, 1200);
    } catch (err) {
      setProfileErr(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setUploading(true);
    setResumeMsg("");
    setResumeErr("");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      await api.post("/auth/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(fetchCurrentUser());
      setResumeMsg("Resume uploaded and indexed successfully");
      setResumeFile(null);
    } catch (err) {
      setResumeErr(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleResumeDelete = async () => {
    setDeletingResume(true);
    setResumeMsg("");
    setResumeErr("");

    try {
      await api.delete("/auth/delete-resume");
      await dispatch(fetchCurrentUser());
      setResumeMsg("Resume deleted successfully");
    } catch (err) {
      setResumeErr(err.response?.data?.message || "Failed to delete resume");
    } finally {
      setDeletingResume(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await api.post(`/jobs/save/${jobId}`);
      await dispatch(fetchCurrentUser());
    } catch (err) {
      console.error("Failed to remove saved job:", err);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalyzeErr("");
    setAnalysis("");
    try {
      const res = await api.post("/ai/analyze-resume", {});
      setAnalysis(res.data.feedback);
    } catch (err) {
      setAnalyzeErr(err.response?.data?.message || "Failed to analyze resume");
    } finally {
      setAnalyzing(false);
    }
  };

  const getResumeUrl = () => {
    if (!user?.resumeUrl) return "";
    if (user.resumeUrl.startsWith("http")) return user.resumeUrl;
    const baseUrl = (import.meta.env.VITE_API_URL || "").replace("/api/v1", "");
    return `${baseUrl}${user.resumeUrl}`;
  };

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] text-slate-800 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        
        {/* Profile Banner */}
        <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-blue-500/20 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-2">
              <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{user?.role || "Verified Account"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {user?.name || "Account Profile"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-center">
              <span className="block text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Bookmarked</span>
              <span className="text-lg font-bold text-blue-900">{user?.savedJobs?.length || 0} Jobs</span>
            </div>
          </div>
        </div>

        {/* Section Grid: Personal Details & Resume Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Personal Details */}
          <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Full Name</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <User className="w-4 h-4 text-slate-400" />
                    {user?.name || "Not provided"}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Phone Number</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {user?.phone || "Not provided"}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Email Address</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full mt-6 py-3 px-5 rounded-2xl font-semibold text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Resume Management */}
          <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Resume Document</h2>
              </div>

              {resumeMsg && (
                <div className="p-3 mb-5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-700">{resumeMsg}</p>
                </div>
              )}
              {resumeErr && (
                <div className="p-3 mb-5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <p className="text-xs text-red-700">{resumeErr}</p>
                </div>
              )}

              {user?.resumeUrl ? (
                <div className="p-4 mb-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-800">Active Resume PDF</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.resumeUrl}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={getResumeUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={handleResumeDelete}
                      disabled={deletingResume}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                      title="Delete Resume"
                    >
                      {deletingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 mb-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                  <p className="text-xs text-slate-400">No active resume uploaded yet</p>
                </div>
              )}

              <form onSubmit={handleResumeUpload} className="space-y-4">
                <div className="relative group border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 bg-slate-50 text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    {resumeFile ? resumeFile.name : "Choose PDF or TXT to replace/upload"}
                  </p>
                  <p className="text-[10px] text-slate-400">Max file size 5MB (PDF/TXT only)</p>
                </div>

                <button
                  type="submit"
                  disabled={!resumeFile || uploading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading Resume...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Selected File</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Parsed securely for AI recommendation matches</span>
            </div>
          </div>
        </div>

        {/* SAVED JOBS SECTION */}
        <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Saved Job Openings</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quickly access positions you bookmarked to complete applications later
              </p>
            </div>
          </div>

          {user?.savedJobs && user.savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.savedJobs.map((job) => {
                const jobId = job.id || job._id;
                return (
                  <div
                    key={jobId}
                    className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-between hover:border-blue-300 transition-all group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                              {job.category || "General"}
                            </span>
                            <p className="text-xs text-slate-600 font-medium">
                              {job.employer?.name || "Verified Employer"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUnsaveJob(jobId)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all"
                          title="Remove from Saved"
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.city && job.country ? `${job.city}, ${job.country}` : "Remote"}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/jobs/${jobId}`}
                      className="w-full py-2 bg-white hover:bg-blue-600 border border-slate-200 hover:border-blue-600 text-slate-700 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>View & Apply</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No saved positions yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                Click the bookmark icon on any position in the open listings tab to save it here for later evaluation.
              </p>
            </div>
          )}
        </div>

        {/* AI Resume Analysis Card */}
        <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">AI Resume Optimizer</h2>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Get instant AI feedback on formatting, keyword optimization, and gaps.
                </p>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !user?.resumeUrl}
              className="py-3 px-5 rounded-2xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-100" />
                  <span>Analyze My Resume</span>
                </>
              )}
            </button>
          </div>

          {analyzeErr && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-xs text-red-700 font-medium">{analyzeErr}</p>
            </div>
          )}

          {analysis ? (
            <div className="space-y-6">
              <ResumeScoreCard text={analysis} />
              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-800">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4 pb-2 border-b border-slate-200">
                  <Cpu className="w-4 h-4" />
                  <span>Detailed AI Insights & Feedback</span>
                </div>
                <FormattedAIOutput text={analysis} />
              </div>
            </div>
          ) : (
            !analyzing && (
              <div className="p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
                <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">Ready to audit your resume</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                  Click the analyze button above to trigger deep-parsing across technical keywords and hiring manager preferences.
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Edit Profile
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {profileMsg && (
                <div className="p-3.5 mb-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-700 font-medium">{profileMsg}</p>
                </div>
              )}

              {profileErr && (
                <div className="p-3.5 mb-5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <p className="text-xs text-red-700 font-medium">{profileErr}</p>
                </div>
              )}

              <form id="profile-form" onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Email Address <span className="text-slate-400">(Read Only)</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 text-slate-400 rounded-2xl outline-none text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="profile-form"
                disabled={savingProfile}
                className="py-2.5 px-6 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;