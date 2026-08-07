import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../../api/axios";
import { toggleSaveJob } from "../../store/slices/authSlice";
import {
  Search,
  MapPin,
  IndianRupee,
  Sparkles,
  ArrowUpRight,
  X,
  Building2,
  SlidersHorizontal,
  Bookmark,
  AlertCircle
} from "lucide-react";

// Synchronized Categories with PostJob.jsx
const CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "AI / Machine Learning",
  "DevOps",
  "Product Design",
  "Data Science",
  "Cybersecurity",
  "Product Management",
  "Other"
];

const Jobs = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        // Handles both { jobs: [...] } and raw array [] backend responses safely
        const jobList = Array.isArray(res.data) ? res.data : res.data?.jobs || [];
        setJobs(jobList);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  // Uses Redux thunk to toggle save status seamlessly
  const handleToggleSaveJob = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("Please login to save jobs.");
      return;
    }

    try {
      await dispatch(toggleSaveJob(id)).unwrap();
    } catch (err) {
      console.error("Failed to save/unsave job:", err);
    }
  };

  // Robust string-safe check for raw IDs or populated object models
  const isJobSaved = (jobId) => {
    if (!user || !user.savedJobs) return false;

    // Handles arrays whether they contain IDs ["1","2"] or populated objects [{id: "1"}]
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
      let savedId = "";
      if (typeof saved === "object" && saved !== null) {
        savedId = String(saved.id || saved._id || "").trim();
      } else {
        savedId = String(saved).trim();
      }
      return savedId.replace(/^["']|["']$/g, "") === String(jobId).replace(/^["']|["']$/g, "").trim();
    });
  };

  // Safe Filtering Logic with optional chaining and fallback strings
  const filteredJobs = jobs.filter((job) => {
    const jobCat = job.category || "";
    const matchesCategory =
      selectedCategory === "All" ||
      jobCat.toLowerCase() === selectedCategory.toLowerCase();

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (job.title || "").toLowerCase().includes(searchLower) ||
      (job.category || "").toLowerCase().includes(searchLower) ||
      (job.description || "").toLowerCase().includes(searchLower) ||
      (job.city || "").toLowerCase().includes(searchLower) ||
      (job.country || "").toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0B0F17] text-[#111827] dark:text-[#F3F4F6] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDF5FF] dark:bg-[#2F80ED]/10 border border-[#2F80ED]/20 text-[#2F80ED] dark:text-[#56CCF2] text-xs font-semibold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Real-time Openings</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111827] dark:text-white">
              Find Your Next Role
            </h1>
          </div>

          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-sm md:text-right">
            Showing <span className="font-semibold text-[#111827] dark:text-white">{filteredJobs.length}</span> verified active positions across engineering, product, and operations.
          </p>
        </div>

        {/* Search & Filter Controls Panel */}
        <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-3xl p-4 shadow-sm space-y-4 transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full flex items-center bg-[#F7FAFC] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#2F80ED]/30 focus-within:border-[#2F80ED] transition-all">
              <Search className="w-5 h-5 text-[#9CA3AF] mr-3 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by title, skills, city, or country..."
                className="w-full bg-transparent text-[#111827] dark:text-white placeholder-[#9CA3AF] text-sm outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded-md text-[#9CA3AF] hover:bg-[#E5E7EB] dark:hover:bg-[#374151] hover:text-[#111827] dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Reset Filters Button */}
            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="w-full md:w-auto px-5 py-3 bg-[#F7FAFC] dark:bg-[#1F2937] hover:bg-[#EDF5FF] dark:hover:bg-[#374151] text-[#111827] dark:text-white rounded-2xl text-sm font-medium border border-[#E5E7EB] dark:border-[#374151] transition-colors shrink-0 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Category Quick Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 hide-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                    active
                      ? "bg-[#2F80ED] text-white shadow-sm shadow-[#2F80ED]/30"
                      : "bg-[#F7FAFC] dark:bg-[#1F2937] text-[#6B7280] dark:text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#374151] hover:bg-[#EDF5FF] dark:hover:bg-[#374151] hover:text-[#2F80ED] dark:hover:text-[#56CCF2]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-3xl shadow-sm animate-pulse space-y-5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-[#F7FAFC] dark:bg-[#1F2937] rounded-2xl" />
                    <div className="space-y-2">
                      <div className="w-20 h-3 bg-[#F7FAFC] dark:bg-[#1F2937] rounded" />
                      <div className="w-24 h-4 bg-[#F7FAFC] dark:bg-[#1F2937] rounded" />
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-[#F7FAFC] dark:bg-[#1F2937] rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-5 bg-[#F7FAFC] dark:bg-[#1F2937] rounded" />
                  <div className="w-1/2 h-4 bg-[#F7FAFC] dark:bg-[#1F2937] rounded" />
                </div>
                <div className="w-full h-11 bg-[#F7FAFC] dark:bg-[#1F2937] rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-10 md:p-16 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-3xl text-center shadow-sm max-w-2xl mx-auto my-12 transition-colors duration-300">
            <div className="w-16 h-16 bg-[#EDF5FF] dark:bg-[#2F80ED]/10 border border-[#2F80ED]/20 text-[#2F80ED] dark:text-[#56CCF2] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-2 tracking-tight">No Matching Positions Found</h3>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-sm mb-8 leading-relaxed max-w-md mx-auto">
              We couldn't find any jobs matching "{searchTerm}". Try tweaking your search keywords or clearing your category filters to see more results.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="px-6 py-3 bg-[#2F80ED] hover:bg-[#2563EB] text-white rounded-2xl text-sm font-medium transition-all shadow-md active:scale-[0.98]"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const jobId = job.id || job._id;
              const saved = isJobSaved(jobId);

              return (
                <Link
                  key={jobId}
                  to={`/jobs/${jobId}`}
                  className="p-6 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#2F80ED]/50 dark:hover:border-[#2F80ED]/50 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#EDF5FF] dark:bg-[#1F2937] border border-[#2F80ED]/20 dark:border-[#374151] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Building2 className="w-5 h-5 text-[#2F80ED] dark:text-[#56CCF2]" />
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-[#2F80ED] dark:text-[#56CCF2] font-bold mb-0.5">
                            {job.category || "General"}
                          </p>
                          <p className="text-sm text-[#111827] dark:text-white font-semibold">
                            {job.employer?.name || "Verified Employer"}
                          </p>
                        </div>
                      </div>

                      {/* Save/Unsave Job Button */}
                      <button
                        onClick={(e) => handleToggleSaveJob(e, jobId)}
                        className={`p-2 rounded-xl border text-sm transition-all focus:outline-none ${
                          saved
                            ? "bg-[#EDF5FF] dark:bg-[#2F80ED]/20 border-[#2F80ED]/30 text-[#2F80ED] dark:text-[#56CCF2]"
                            : "bg-transparent border-transparent text-[#9CA3AF] hover:bg-[#F7FAFC] dark:hover:bg-[#1F2937] hover:text-[#111827] dark:hover:text-white"
                        }`}
                        aria-label={saved ? "Unsave Job" : "Save Job"}
                      >
                        <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    <h2 className="text-lg font-bold text-[#111827] dark:text-white group-hover:text-[#2F80ED] dark:group-hover:text-[#56CCF2] transition-colors mb-2 line-clamp-1 tracking-tight">
                      {job.title}
                    </h2>

                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] line-clamp-2 leading-relaxed mb-6">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#E5E7EB] dark:border-[#1F2937] space-y-5">
                    <div className="flex flex-wrap items-center justify-between text-sm gap-2">
                      <div className="flex items-center gap-1.5 text-[#6B7280] dark:text-[#9CA3AF] font-medium">
                        <MapPin className="w-4 h-4 text-[#9CA3AF]" />
                        <span>{job.city && job.country ? `${job.city}, ${job.country}` : "Remote"}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[#22C55E] font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        <span>
                          {job.fixedSalary
                            ? `${Number(job.fixedSalary).toLocaleString("en-IN")}/yr`
                            : job.salaryFrom && job.salaryTo
                            ? `${Number(job.salaryFrom).toLocaleString("en-IN")} - ${Number(job.salaryTo).toLocaleString("en-IN")}`
                            : "Competitive"}
                        </span>
                      </div>
                    </div>

                    <div className="w-full py-2.5 bg-[#F7FAFC] dark:bg-[#1F2937] group-hover:bg-[#2F80ED] text-[#111827] dark:text-white group-hover:text-white border border-[#E5E7EB] dark:border-[#374151] group-hover:border-[#2F80ED] rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5">
                      <span>View Details & Apply</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;