import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  Sparkles,
  MapPin,
  Briefcase,
  ArrowRight,
  Loader2,
  AlertCircle,
  FileText,
  Building2,
  TrendingUp,
  Search,
} from "lucide-react";

const AIRecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError("");
    setRecommendations(null);
    try {
      const res = await api.post("/ai/recommend-jobs", {});
      setRecommendations(res.data.recommendations);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch job recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden p-6 sm:p-8 bg-slate-900/60 border border-slate-800/80 rounded-3xl backdrop-blur-xl shadow-2xl transition-all">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Match Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            AI Job Recommendations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personalized job suggestions based on your resume and skill profile
          </p>
        </div>

        <button
          onClick={handleGetRecommendations}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Profile...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{recommendations ? "Refresh Matches" : "Get Recommendations"}</span>
            </>
          )}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-300 font-medium">{error}</p>
        </div>
      )}

      {/* Empty State: Call to Action (Initial state) */}
      {!recommendations && !loading && !error && (
        <div className="p-8 text-center bg-slate-950/60 border border-slate-800/80 rounded-2xl">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Ready to find your best-fit roles?
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
            Ensure your resume is updated in your{" "}
            <Link
              to="/profile"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 transition-colors"
            >
              profile settings
            </Link>
            , then click the button above to run our AI matcher.
          </p>
        </div>
      )}

      {/* Empty State: No Matches Found */}
      {recommendations && recommendations.length === 0 && (
        <div className="p-8 text-center bg-slate-950/60 border border-slate-800/80 rounded-2xl">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-300 font-medium">No strong matches found right now.</p>
          <p className="text-xs text-slate-500 mt-1">
            Try updating your profile skills or checking back later as new positions open up.
          </p>
        </div>
      )}

      {/* Recommendation Results List */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing top {recommendations.length} matched positions</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> High accuracy match
            </span>
          </div>

          <div className="grid gap-3.5">
            {recommendations.map((rec, index) => {
              const jobId = rec.job.id || rec.job._id;
              return (
                <Link
                  key={jobId || index}
                  to={`/jobs/${jobId}`}
                  className="group relative p-5 bg-slate-950/70 hover:bg-slate-950 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-100 text-sm sm:text-base group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                        <span>{rec.job.title}</span>
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1.5 text-xs text-slate-400">
                        {(rec.job.city || rec.job.country) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {[rec.job.city, rec.job.country].filter(Boolean).join(", ")}
                          </span>
                        )}
                        {rec.job.category && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                            {rec.job.category}
                          </span>
                        )}
                        {rec.job.companyName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            {rec.job.companyName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-300 transition-all shrink-0">
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  {/* AI Reason Callout */}
                  {rec.reason && (
                    <div className="pt-3 border-t border-slate-800/60 flex items-start gap-2.5">
                      <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-indigo-300 font-medium">Why it matches: </strong>
                        {rec.reason}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default AIRecommendationsPanel;