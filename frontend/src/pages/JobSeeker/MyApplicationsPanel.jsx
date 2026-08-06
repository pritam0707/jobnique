import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  FileText,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const getStatusBadge = (status) => {
  switch (status) {
    case "Accepted":
      return {
        style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      };
    case "Rejected":
      return {
        style: "bg-red-500/10 text-red-400 border-red-500/30",
        icon: <XCircle className="w-3.5 h-3.5 text-red-400" />,
      };
    case "Reviewed":
      return {
        style: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        icon: <Eye className="w-3.5 h-3.5 text-blue-400" />,
      };
    default:
      return {
        style: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      };
  }
};

const MyApplicationsPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my-applications");
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        <p className="text-xs text-slate-400">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden p-6 sm:p-8 bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-xl shadow-2xl transition-all">
      {/* Ambient Glow */}
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Job Seeker Dashboard</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Your Applications
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track the status of all your submitted job applications
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all shrink-0"
        >
          <Briefcase className="w-4 h-4" />
          <span>Browse More Jobs</span>
        </Link>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/60 border border-slate-800/80 rounded-2xl">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            No applications submitted yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            You haven't applied to any job postings yet. Explore open roles and land your next opportunity!
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 transition-all border border-slate-700 group"
          >
            <span>Explore Open Roles</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : (
        /* Applications List */
        <div className="space-y-3">
          {applications.map((app) => {
            const appId = app.id || app._id;
            const jobId = app.job?.id || app.job?._id;
            const statusInfo = getStatusBadge(app.status);

            return (
              <div
                key={appId}
                className="p-4 sm:p-5 bg-slate-950/70 border border-slate-800/90 rounded-2xl transition-all duration-200 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <Link
                    to={jobId ? `/jobs/${jobId}` : "#"}
                    className="font-semibold text-slate-100 text-sm sm:text-base hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{app.job?.title || "Untitled Position"}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                  </Link>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400">
                    {(app.job?.city || app.job?.country) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {[app.job?.city, app.job?.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                    {app.job?.category && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                        {app.job.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusInfo.style}`}
                  >
                    {statusInfo.icon}
                    <span>{app.status || "Pending"}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPanel;