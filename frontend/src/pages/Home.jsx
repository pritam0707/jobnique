import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp,
  BrainCircuit,
  Building2,
  Zap,
  MapPin,
  DollarSign,
  ArrowUpRight,
  Menu,
  X,
  ChevronRight,
  Calculator,
  LayoutDashboard
} from "lucide-react";

const POPULAR_TAGS = [
  "Frontend", "Backend", "AI / Machine Learning", "DevOps", "Product Design", "Data Science"
];

const FEATURED_JOBS_PREVIEW = [
  {
    id: 1,
    title: "Senior AI Systems Engineer",
    company: "NeuralTech Labs",
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k - $210k",
    type: "Full-time",
    tags: ["Python", "PyTorch", "Kubernetes"],
    match: "98% Match"
  },
  {
    id: 2,
    title: "Lead Frontend Architect",
    company: "Vanguard Cloud",
    location: "Remote",
    salary: "$140k - $180k",
    type: "Full-time",
    tags: ["React", "TypeScript", "Tailwind"],
    match: "95% Match"
  },
  {
    id: 3,
    title: "Principal Product Designer",
    company: "Aetheria Studios",
    location: "New York, NY (Onsite)",
    salary: "$150k - $190k",
    type: "Full-time",
    tags: ["Figma", "Design Systems", "UI/UX"],
    match: "92% Match"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Dashboard route based on user role
  const dashboardPath = user?.role === "Employer" ? "/employer/dashboard" : "/jobseeker/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F7FAFC] text-[#111827] selection:bg-[#56CCF2]/30 selection:text-[#111827] overflow-x-hidden font-sans">
      
      {/* ========================================================================= */}
      {/* HOME PAGE DEDICATED HERO NAVBAR                                            */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-[0_4px_20px_rgb(0,0,0,0.03)] h-[80px]"
            : "bg-transparent h-[80px]"
        } flex items-center`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[14px] bg-[#2F80ED] flex items-center justify-center shadow-[0_4px_12px_rgba(47,128,237,0.3)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[20px] font-bold tracking-tight text-[#111827]">
              Jobnique<span className="text-[#2F80ED]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#6B7280]">
            <Link to="/jobs" className="hover:text-[#2F80ED] transition-colors">
              Find Jobs
            </Link>
            <Link to="/salary" className="hover:text-[#2F80ED] transition-colors flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[#9CA3AF]" />
              <span>Salary Calculator</span>
            </Link>
          </nav>

          {/* Right Action CTA Buttons: Dynamically switches based on Authentication Status */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Logged in User Pill */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
                  <span className="text-[15px] font-semibold text-[#111827]">
                    Hi, {user?.name}
                  </span>
                  {user?.role && (
                    <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-[10px] bg-[#EDF5FF] text-[#2F80ED] border border-[#2F80ED]/20">
                      {user.role}
                    </span>
                  )}
                </div>

                {/* Dashboard Button */}
                <Link
                  to={dashboardPath}
                  className="px-6 py-2.5 text-[15px] font-semibold text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] rounded-full shadow-[0_4px_14px_0_rgba(47,128,237,0.39)] hover:shadow-[0_6px_20px_rgba(47,128,237,0.23)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
              </div>
            ) : (
              /* Unauthenticated Auth Buttons */
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-[15px] font-medium text-[#111827] bg-white hover:bg-[#EDF5FF] hover:text-[#2F80ED] border border-[#E5E7EB] rounded-full transition-all shadow-[0_2px_8px_rgb(0,0,0,0.02)]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 text-[15px] font-semibold text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] rounded-full shadow-[0_4px_14px_0_rgba(47,128,237,0.39)] hover:shadow-[0_6px_20px_rgba(47,128,237,0.23)] hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-[14px] text-[#6B7280] hover:bg-[#EDF5FF] hover:text-[#2F80ED] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E5E7EB] px-6 pt-6 pb-8 space-y-4 absolute top-[80px] left-0 right-0 shadow-[0_20px_40px_rgb(0,0,0,0.1)] animate-fadeIn">
            <nav className="flex flex-col space-y-2 text-[15px] font-medium text-[#6B7280]">
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-[12px] hover:bg-[#EDF5FF] hover:text-[#2F80ED]"
              >
                <span>Find Jobs</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </Link>
              <Link
                to="/salary"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-[12px] hover:bg-[#EDF5FF] hover:text-[#2F80ED]"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#9CA3AF]" />
                  <span>Salary Calculator</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#E5E7EB] flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-[15px] font-semibold text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] rounded-full shadow-[0_4px_14px_0_rgba(47,128,237,0.39)] flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-[15px] font-medium text-[#111827] bg-[#F7FAFC] hover:bg-[#EDF5FF] rounded-full border border-[#E5E7EB]"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-[15px] font-semibold text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] rounded-full shadow-[0_4px_14px_0_rgba(47,128,237,0.39)]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center animate-fadeIn">
        
        {/* Release / Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDF5FF] border border-[#2F80ED]/20 text-[#2F80ED] text-[14px] font-medium mb-8 hover:bg-[#EDF5FF]/80 transition-colors cursor-pointer">
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen AI Matching Protocol V2.4 Live</span>
          <span className="w-2 h-2 rounded-full bg-[#2F80ED] animate-pulse ml-1" />
        </div>

        {/* Main Headline */}
        <h1 className="max-w-4xl text-[44px] sm:text-[60px] lg:text-[70px] font-extrabold tracking-tight text-[#111827] leading-[1.1] mb-6">
          Find your next career breakthrough with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2F80ED] to-[#56CCF2]">
            Jobnique
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-[16px] sm:text-[18px] text-[#6B7280] leading-relaxed mb-10">
          Eliminate noise and endless application queues. Jobnique leverages intelligent semantic parsing to connect top talent with verified global teams instantly.
        </p>

        {/* Search Box Component */}
        <div className="w-full max-w-3xl mb-8">
          <form 
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-full shadow-[0_10px_40px_rgb(0,0,0,0.06)] hover:shadow-[0_15px_50px_rgb(0,0,0,0.1)] focus-within:ring-2 focus-within:ring-[#2F80ED]/40 transition-all duration-300"
          >
            <div className="flex items-center flex-1 w-full px-6 py-2 sm:py-0">
              <Search className="w-5 h-5 text-[#9CA3AF] mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, keywords, or technology stack..."
                className="w-full bg-transparent text-[#111827] placeholder-[#9CA3AF] outline-none text-[16px] h-12"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-full font-semibold text-[16px] text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] shadow-[0_4px_14px_0_rgba(47,128,237,0.39)] hover:shadow-[0_6px_20px_rgba(47,128,237,0.23)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Tag Suggestion Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 text-[14px]">
            <span className="text-[#6B7280] font-medium mr-1">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-full hover:border-[#2F80ED]/40 hover:text-[#2F80ED] hover:bg-[#EDF5FF]/50 transition-all shadow-[0_2px_8px_rgb(0,0,0,0.02)]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Highlights Bar */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-[15px] text-[#6B7280] font-medium pt-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
            <span>Automated Resume Scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2F80ED]" />
            <span>Verified Tech Employers</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#56CCF2]" />
            <span>Real-time Market Salaries</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* METRICS SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
          <div className="p-8 text-center">
            <p className="text-[36px] sm:text-[42px] font-bold text-[#111827] tracking-tight">12k+</p>
            <p className="text-[15px] text-[#6B7280] mt-1 font-medium">Active Positions</p>
          </div>
          <div className="p-8 text-center">
            <p className="text-[36px] sm:text-[42px] font-bold text-[#111827] tracking-tight">3.2x</p>
            <p className="text-[15px] text-[#6B7280] mt-1 font-medium">Interview Rate</p>
          </div>
          <div className="p-8 text-center">
            <p className="text-[36px] sm:text-[42px] font-bold text-[#111827] tracking-tight">1.8k+</p>
            <p className="text-[15px] text-[#6B7280] mt-1 font-medium">Global Companies</p>
          </div>
          <div className="p-8 text-center">
            <p className="text-[36px] sm:text-[42px] font-bold text-[#111827] tracking-tight">&lt;48h</p>
            <p className="text-[15px] text-[#6B7280] mt-1 font-medium">Avg. Response Time</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FEATURED JOBS SECTION                                                     */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-[14px] font-semibold uppercase tracking-wider text-[#2F80ED] mb-2">Curated Opportunities</h2>
            <p className="text-[32px] sm:text-[36px] font-bold text-[#111827] tracking-tight">Featured High-Match Positions</p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-[16px] font-medium text-[#2F80ED] hover:text-[#2563EB] transition-colors group"
          >
            <span>Explore all listings</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_JOBS_PREVIEW.map((job) => (
            <div
              key={job.id}
              className="p-8 bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-[#2F80ED]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] rounded-full text-[13px] font-semibold">
                    {job.match}
                  </span>
                  <span className="text-[14px] font-medium text-[#6B7280]">{job.type}</span>
                </div>
                <h3 className="text-[20px] font-bold text-[#111827] group-hover:text-[#2F80ED] transition-colors mb-1 tracking-tight">
                  {job.title}
                </h3>
                <p className="text-[15px] text-[#6B7280] mb-6">{job.company}</p>

                <div className="space-y-3 mb-6 text-[15px] text-[#6B7280]">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#9CA3AF]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-[#9CA3AF]" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  {job.tags.map((t) => (
                    <span key={t} className="px-3 py-1 bg-[#F7FAFC] border border-[#E5E7EB] text-[#6B7280] text-[13px] font-medium rounded-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to="/jobs"
                className="w-full py-3.5 bg-[#EDF5FF] hover:bg-[#2F80ED] text-[#2F80ED] hover:text-white rounded-[16px] text-[15px] font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
              >
                <span>View Listing</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* WORKFLOW CARDS SECTION                                                    */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-[#E5E7EB]">
        <div className="text-center mb-16">
          <h2 className="text-[14px] font-semibold uppercase tracking-wider text-[#2F80ED] mb-2">The Jobnique Advantage</h2>
          <p className="text-[32px] sm:text-[36px] font-bold text-[#111827] tracking-tight">Engineered for modern candidates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center group hover:border-[#2F80ED]/30 transition-all">
            <div className="w-16 h-16 bg-[#EDF5FF] rounded-[20px] flex items-center justify-center text-[#2F80ED] mb-6 group-hover:scale-110 transition-transform shadow-[0_4px_14px_rgba(47,128,237,0.15)]">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-bold text-[#111827] mb-3 tracking-tight">Smart Semantic Matching</h3>
            <p className="text-[15px] text-[#6B7280] leading-relaxed">
              Our neural models parse experience vectors rather than exact keyword matches, revealing opportunities that align with true capabilities.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center group hover:border-[#2F80ED]/30 transition-all">
            <div className="w-16 h-16 bg-[#EDF5FF] rounded-[20px] flex items-center justify-center text-[#2F80ED] mb-6 group-hover:scale-110 transition-transform shadow-[0_4px_14px_rgba(47,128,237,0.15)]">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-bold text-[#111827] mb-3 tracking-tight">Automated Cover Notes</h3>
            <p className="text-[15px] text-[#6B7280] leading-relaxed">
              Generate job-tailored summary points with one click, highlighting exact skill overlaps that catch hiring managers' attention.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center group hover:border-[#2F80ED]/30 transition-all">
            <div className="w-16 h-16 bg-[#EDF5FF] rounded-[20px] flex items-center justify-center text-[#2F80ED] mb-6 group-hover:scale-110 transition-transform shadow-[0_4px_14px_rgba(47,128,237,0.15)]">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-bold text-[#111827] mb-3 tracking-tight">Verified Compensation</h3>
            <p className="text-[15px] text-[#6B7280] leading-relaxed">
              No guesswork. View transparent salary bands, equity packages, and workplace configurations prior to submitting your profile.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CTA BANNER SECTION                                                        */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="relative overflow-hidden p-10 sm:p-14 bg-white border border-[#E5E7EB] rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.08)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2F80ED] to-[#56CCF2]" />
          
          <div className="max-w-xl text-center md:text-left relative z-10">
            <h3 className="text-[28px] sm:text-[34px] font-bold text-[#111827] mb-3 tracking-tight">
              Ready to upgrade your recruitment experience?
            </h3>
            <p className="text-[16px] text-[#6B7280] leading-relaxed">
              Create an account in less than two minutes to unlock tailored recommendations, instant application tracking, and direct employer updates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0 relative z-10">
            <Link
              to={isAuthenticated ? dashboardPath : "/register"}
              className="px-8 py-4 bg-gradient-to-r from-[#2F80ED] to-[#2563EB] hover:opacity-95 text-white rounded-full text-[16px] font-semibold transition-all text-center shadow-[0_4px_14px_0_rgba(47,128,237,0.39)] active:scale-[0.98]"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-4 bg-[#F7FAFC] hover:bg-[#EDF5FF] text-[#111827] hover:text-[#2F80ED] rounded-full text-[16px] font-semibold transition-all text-center border border-[#E5E7EB] active:scale-[0.98]"
            >
              Browse Jobs First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;