import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Briefcase,
  FileText,
  Sparkles,
  User,
  PlusCircle,
  Search,
  Calendar,
  Eye,
  TrendingUp,
  Edit3,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight
} from "lucide-react";
import EmployerJobsPanel from "../Employer/EmployerJobsPanel";

// Mock Data
const WORK_EXPERIENCE = [
  { id: 1, role: "Jr. UI Designer", company: "Meta", period: "2023 - Present" },
  { id: 2, role: "3D Design Intern", company: "Google", period: "2022 - 2023" }
];

const SKILLS_LIST = ["UI Design", "3D Modeling", "Motion Graphics", "Figma", "React"];

const RECOMMENDED_JOBS = [
  {
    id: 1,
    title: "UX Design Intern",
    company: "Netflix",
    salary: "$20,000 - $40,000",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A purus sagittis non sed turpis erat habitant.",
    tags: ["Fulltime", "Onsite", "Midlevel"],
    applied: false
  },
  {
    id: 2,
    title: "UX Design Intern",
    company: "Netflix",
    salary: "$20,000 - $40,000",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A purus sagittis non sed turpis erat habitant.",
    tags: ["Remote", "Onsite", "Senior"],
    applied: true
  },
  {
    id: 3,
    title: "UX Design Intern",
    company: "Netflix",
    salary: "$20,000 - $40,000",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A purus sagittis non sed turpis erat habitant.",
    tags: ["Remote", "Onsite", "Junior"],
    applied: false
  }
];

// Dynamic Chart & Stats Data based on timeframe
const TIMEFRAME_DATA = {
  "This Week": {
    stats: { interviews: 3, applications: 12, visits: 28 },
    chartApps: "M0,100 Q50,80 100,90 T200,60 T300,80 T400,40 T500,50",
    chartInts: "M0,130 Q50,110 100,120 T200,100 T300,110 T400,90 T500,100",
    labels: ["M", "T", "W", "T", "F", "S", "S", "", "", ""]
  },
  "This Month": {
    stats: { interviews: 13, applications: 45, visits: 93 },
    chartApps: "M0,80 Q50,40 100,60 T200,30 T300,50 T400,20 T500,40",
    chartInts: "M0,110 Q50,90 100,100 T200,80 T300,100 T400,60 T500,85",
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10"]
  },
  "This Year": {
    stats: { interviews: 42, applications: 156, visits: 840 },
    chartApps: "M0,40 Q50,20 100,40 T200,10 T300,30 T400,5 T500,20",
    chartInts: "M0,90 Q50,70 100,80 T200,50 T300,70 T400,30 T500,50",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
  }
};

const Dashboard = () => {
  // Redux state mock (fallback to standard user if none)
  const { user } = useSelector((state) => state.auth) || { user: { name: "1234", role: "Seeker" } };
  const isEmployer = user?.role === "Employer";

  // Interactive States
  const [activeJobs, setActiveJobs] = useState(RECOMMENDED_JOBS);
  const [timeframe, setTimeframe] = useState("This Month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredData, setHoveredData] = useState(null);
  
  // Profile Completion logic (Simulated)
  const [profileCompletion] = useState(80);

  // Handlers
  const handleApplyToggle = (id) => {
    setActiveJobs(prev =>
      prev.map(job => (job.id === id ? { ...job, applied: !job.applied } : job))
    );
  };

  const handleEditClick = (section) => {
    // Replace with your actual modal/routing logic
    alert(`Opening edit modal for: ${section}`);
  };

  const currentData = TIMEFRAME_DATA[timeframe];
  const dashOffset = 100 - profileCompletion; // For the SVG circle stroke

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-bold text-[#111827] tracking-tight">
            Hello, {user?.name || "John Wick"}
          </h1>
          <p className="text-[15px] text-[#6B7280]">
            {isEmployer
              ? "Manage your active job postings and evaluate incoming applications."
              : "Track application analytics, update your profile, and explore recommended roles."}
          </p>
        </div>

        <div>
          {isEmployer ? (
            <Link
              to="/post-job"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[15px] text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] shadow-[0_4px_14px_rgba(47,128,237,0.35)] hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post New Role</span>
            </Link>
          ) : (
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[15px] text-white bg-[#2F80ED] hover:bg-[#2563EB] shadow-[0_4px_14px_rgba(47,128,237,0.35)] hover:shadow-lg transition-all"
            >
              <Search className="w-5 h-5" />
              <span>Explore Open Roles</span>
            </Link>
          )}
        </div>
      </div>

      {isEmployer ? (
        <EmployerJobsPanel />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8">
            
            {/* Profile Donut Chart Section */}
            <div className="text-center space-y-4 pb-6 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-[#111827]">Profile</span>
                <button 
                  onClick={() => handleEditClick("Profile")}
                  className="text-[#2F80ED] text-[13px] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Progress Donut Graphic - Now Dynamic */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center group cursor-pointer transition-transform hover:scale-105">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#EDF5FF]"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#2F80ED] transition-all duration-1000 ease-out"
                    strokeDasharray={`${profileCompletion}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[20px] font-extrabold text-[#111827]">{profileCompletion}%</span>
                  <span className="text-[10px] font-semibold text-[#6B7280] uppercase">Complete</span>
                </div>
              </div>

              <p className="text-[13px] text-[#6B7280]">
                Complete your profile to unlock 3.2x higher interview matches.
              </p>
            </div>

            {/* Work Experience Section */}
            <div className="space-y-4 pb-6 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#111827]">Work Experience</h3>
                <button onClick={() => handleEditClick("Work Experience")} className="text-[#9CA3AF] hover:text-[#2F80ED] transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {WORK_EXPERIENCE.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-[#F7FAFC] rounded-[16px] border border-[#E5E7EB] hover:border-[#2F80ED]/30 transition-colors">
                    <div className="w-9 h-9 rounded-[12px] bg-white border border-[#E5E7EB] flex items-center justify-center text-[#2F80ED] font-bold text-[14px]">
                      {item.company.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#111827]">{item.role}</p>
                      <p className="text-[12px] text-[#6B7280]">{item.company} • {item.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-[#111827]">Skills</h3>
                <button onClick={() => handleEditClick("Skills")} className="text-[#9CA3AF] hover:text-[#2F80ED] transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {SKILLS_LIST.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 bg-[#EDF5FF] border border-[#2F80ED]/20 text-[#2F80ED] text-[13px] font-semibold rounded-full hover:bg-[#2F80ED] hover:text-white transition-colors cursor-default"
                  >
                    • {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Dynamic Metric Stats Cards Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#2F80ED] text-white p-6 rounded-[24px] shadow-[0_8px_25px_rgba(47,128,237,0.3)] flex items-center justify-between hover:transform hover:-translate-y-1 transition-transform cursor-default">
                <div>
                  <p className="text-[32px] font-extrabold leading-none animate-pulse">{currentData.stats.interviews}</p>
                  <p className="text-[14px] font-medium text-white/80 mt-2">Interviews Scheduled</p>
                </div>
                <div className="p-3.5 rounded-[18px] bg-white/20 text-white">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#2F80ED] text-white p-6 rounded-[24px] shadow-[0_8px_25px_rgba(47,128,237,0.3)] flex items-center justify-between hover:transform hover:-translate-y-1 transition-transform cursor-default">
                <div>
                  <p className="text-[32px] font-extrabold leading-none">{currentData.stats.applications}</p>
                  <p className="text-[14px] font-medium text-white/80 mt-2">Applications Sent</p>
                </div>
                <div className="p-3.5 rounded-[18px] bg-white/20 text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-[#2F80ED] text-white p-6 rounded-[24px] shadow-[0_8px_25px_rgba(47,128,237,0.3)] flex items-center justify-between hover:transform hover:-translate-y-1 transition-transform cursor-default">
                <div>
                  <p className="text-[32px] font-extrabold leading-none">{currentData.stats.visits}</p>
                  <p className="text-[14px] font-medium text-white/80 mt-2">Profile Visits</p>
                </div>
                <div className="p-3.5 rounded-[18px] bg-white/20 text-white">
                  <Eye className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Application Stats Line Graph Container */}
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
                <div>
                  <h2 className="text-[18px] font-bold text-[#111827]">Application Stats</h2>
                  <p className="text-[13px] text-[#6B7280]">Real-time tracking vs. scheduled interviews</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#2F80ED]">
                    <span className="w-3 h-3 rounded-full bg-[#2F80ED]" />
                    <span>Applications Sent</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-[#56CCF2]">
                    <span className="w-3 h-3 rounded-full bg-[#56CCF2]" />
                    <span>Interviews</span>
                  </div>
                  
                  {/* Interactive Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="px-3.5 py-1.5 bg-[#F7FAFC] border border-[#E5E7EB] rounded-full text-[13px] font-semibold text-[#6B7280] flex items-center gap-1 hover:bg-gray-100 transition-colors"
                    >
                      <span>{timeframe}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-10 overflow-hidden animate-fadeIn">
                        {Object.keys(TIMEFRAME_DATA).map((tf) => (
                          <button
                            key={tf}
                            onClick={() => { setTimeframe(tf); setIsDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-[13px] font-medium hover:bg-[#F7FAFC] transition-colors ${timeframe === tf ? 'text-[#2F80ED] bg-[#EDF5FF]' : 'text-[#6B7280]'}`}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Interactive Vector Line Chart */}
              <div className="h-52 w-full pt-4 relative">
                
                {/* Tooltip Simulation */}
                {hoveredData && (
                  <div 
                    className="absolute bg-[#111827] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-200"
                    style={{ left: hoveredData.x, top: hoveredData.y - 10 }}
                  >
                    {hoveredData.label}: {hoveredData.val}
                  </div>
                )}

                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#E5E7EB" strokeDasharray="4 4" />

                  {/* Line 1: Applications (Dynamic) */}
                  <path
                    d={currentData.chartApps}
                    fill="none"
                    stroke="#2F80ED"
                    strokeWidth="3.5"
                    className="transition-all duration-500 ease-in-out"
                  />
                  {/* Line 2: Interviews (Dynamic) */}
                  <path
                    d={currentData.chartInts}
                    fill="none"
                    stroke="#56CCF2"
                    strokeWidth="3.5"
                    className="transition-all duration-500 ease-in-out"
                  />

                  {/* Interactive Dot Points - Appended events to circles */}
                  <circle 
                    cx="200" cy={timeframe === "This Year" ? "10" : "30"} r="6" 
                    fill="#2F80ED" stroke="#FFFFFF" strokeWidth="2" 
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={(e) => setHoveredData({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, label: "Applications", val: 8 })}
                    onMouseLeave={() => setHoveredData(null)}
                  />
                  <circle 
                    cx="200" cy={timeframe === "This Year" ? "50" : "80"} r="6" 
                    fill="#56CCF2" stroke="#FFFFFF" strokeWidth="2" 
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={(e) => setHoveredData({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, label: "Interviews", val: 3 })}
                    onMouseLeave={() => setHoveredData(null)}
                  />
                </svg>

                <div className="flex justify-between text-[11px] font-semibold text-[#9CA3AF] mt-3">
                  {currentData.labels.map((lbl, i) => (
                    <span key={i} className="flex-1 text-center">{lbl}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Jobs Horizontal Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#111827]">Recommended Jobs</h2>
                <Link to="/jobs" className="text-[#2F80ED] text-[14px] font-semibold hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-[14px] bg-[#111827] text-white flex items-center justify-center font-bold text-[14px]">
                          {job.company.charAt(0)}
                        </div>
                        <span className="text-[12px] font-semibold text-[#6B7280]">{job.company}</span>
                      </div>

                      <h3 className="text-[18px] font-bold text-[#111827] mb-1">{job.title}</h3>
                      <p className="text-[14px] font-semibold text-[#2F80ED] mb-3">{job.salary}</p>
                      <p className="text-[13px] text-[#6B7280] line-clamp-2 mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {job.tags.map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-[#F7FAFC] border border-[#E5E7EB] text-[#6B7280] text-[11px] font-medium rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyToggle(job.id)}
                      className={`w-full py-3 rounded-full text-[14px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        job.applied
                          ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 hover:bg-[#22C55E]/20"
                          : "bg-[#2F80ED] text-white hover:bg-[#2563EB] shadow-[0_4px_14px_rgba(47,128,237,0.35)] hover:shadow-[0_6px_20px_rgba(47,128,237,0.5)]"
                      }`}
                    >
                      {job.applied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 animate-bounce" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <span>Apply Role</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;