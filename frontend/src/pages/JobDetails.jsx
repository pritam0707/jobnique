import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
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
  FileText,
  Upload,
  FileCheck
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeUrlFile] = useState(null);
  const [applyStatus, setApplyStatus] = useState({ loading: false, message: "", error: "" });

  // Check if current user is an employer
  const isEmployer = user?.role === "Employer";

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/single/${id}`);
        setJob(res.data?.job || res.data);
      } catch (err) {
        console.error("API Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setApplyStatus({
          loading: false,
          message: "",
          error: "Please upload a valid PDF file (.pdf)",
        });
        setResumeUrlFile(null);
        return;
      }
      setApplyStatus({ loading: false, message: "", error: "" });
      setResumeUrlFile(selectedFile);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!resumeFile) {
      setApplyStatus({
        loading: false,
        message: "",
        error: "Please select a PDF resume file to upload.",
      });
      return;
    }

    setApplyStatus({ loading: true, message: "", error: "" });

    try {
      // Use FormData to upload files via multipart/form-data
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("coverLetter", coverLetter);

      await api.post(`/applications/${id}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setApplyStatus({
        loading: false,
        message: "Application & PDF Resume submitted successfully!",
        error: "",
      });
      setCoverLetter("");
      setResumeUrlFile(null);
    } catch (err) {
      setApplyStatus({
        loading: false,
        message: "",
        error: err.response?.data?.message || "Failed to submit application. Please try again.",
      });
    }
  };

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

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 font-sans transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-[#111827] border border-slate-100 dark:border-[#1F2937] rounded-3xl p-8 text-center shadow-md">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Listing Not Found</h2>
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
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1F2937] text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Hero Header Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#111827] border border-slate-100 dark:border-[#1F2937] rounded-3xl shadow-sm relative overflow-hidden transition-colors duration-300">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
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

                {(job.employer || job.companyName) && (
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>Posted by</span>
                    <span className="text-[#2F80ED] dark:text-[#56CCF2] font-semibold">
                      {job.employer?.name || job.companyName || "Employer"}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-[#1F2937]">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-[#1F2937] border border-slate-200/60 dark:border-[#374151] rounded-xl text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-[#2F80ED] dark:text-[#56CCF2] shrink-0" />
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {job.city && job.country ? `${job.city}, ${job.country}` : job.location || "Remote / Global"}
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className={`${isEmployer ? "lg:col-span-12" : "lg:col-span-7"} space-y-6`}>
            <div className="p-6 sm:p-8 bg-white dark:bg-[#111827] border border-slate-100 dark:border-[#1F2937] rounded-3xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-[#1F2937]">
                <FileText className="w-5 h-5 text-[#2F80ED] dark:text-[#56CCF2]" />
                <span>Job Description & Requirements</span>
              </h2>

              <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
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
          {!isEmployer && (
            <div className="lg:col-span-5">
              <div className="sticky top-28 p-6 sm:p-8 bg-white dark:bg-[#111827] border border-slate-100 dark:border-[#1F2937] rounded-3xl shadow-sm transition-colors duration-300">
                
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                    <Send className="w-5 h-5 text-[#2F80ED] dark:text-[#56CCF2]" />
                    <span>Apply for Position</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload your PDF resume and submit your application.
                  </p>
                </div>

                {applyStatus.message && (
                  <div className="p-4 mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                      {applyStatus.message}
                    </p>
                  </div>
                )}

                {applyStatus.error && (
                  <div className="p-4 mb-6 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium">
                      {applyStatus.error}
                    </p>
                  </div>
                )}

                <form onSubmit={handleApply} className="space-y-5">
                  {/* PDF Resume File Upload Field */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Upload PDF Resume <span className="text-red-500">*</span>
                    </label>

                    <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 dark:border-[#374151] hover:border-[#2F80ED] dark:hover:border-[#56CCF2] rounded-2xl cursor-pointer bg-slate-50 dark:bg-[#1F2937] transition-all group">
                      {resumeFile ? (
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                          <FileCheck className="w-5 h-5" />
                          <span className="truncate max-w-[200px]">{resumeFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-center">
                          <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#2F80ED] dark:group-hover:text-[#56CCF2] transition-colors" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                            Click to upload PDF Resume
                          </span>
                          <span className="text-[11px] text-slate-400">PDF files only (max 5MB)</span>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Cover Letter Input Field */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Any message <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Introduce yourself or highlight key experiences..."
                      rows={4}
                      className="w-full p-4 bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-[#374151] focus:border-[#2F80ED] text-slate-800 dark:text-white placeholder-slate-400 rounded-2xl outline-none text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applyStatus.loading}
                    className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {applyStatus.loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading & Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default JobDetails;