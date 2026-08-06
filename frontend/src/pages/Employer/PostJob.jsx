import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Briefcase,
  FileText,
  Tag,
  Globe,
  Building2,
  MapPin,
  IndianRupee,
  PlusCircle,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

const CATEGORIES = [
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

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Full Stack",
    country: "India",
    city: "",
    location: "",
    salaryType: "fixed",
    fixedSalary: "",
    salaryFrom: "",
    salaryTo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      country: form.country,
      city: form.city,
      location: form.location,
      ...(form.salaryType === "fixed"
        ? { fixedSalary: Number(form.fixedSalary) }
        : { salaryFrom: Number(form.salaryFrom), salaryTo: Number(form.salaryTo) }),
    };

    try {
      await api.post("/jobs", payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish job posting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] text-slate-800 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#2F80ED] transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2F80ED] text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#2F80ED]" />
                <span>Employer Hiring Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Publish a New Role
              </h1>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              Reach thousands of verified software engineers, designers, and tech professionals instantly.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm relative overflow-hidden">
          
          {/* Error Display */}
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-700 font-medium leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Job Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Job Title <span className="text-[#2F80ED]">*</span>
              </label>
              <div className="relative flex items-center">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Full Stack Engineer (React & Node)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#2F80ED] text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Job Description <span className="text-[#2F80ED]">*</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Outline core responsibilities, tech stack requirements, team structure, and perks..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#2F80ED] text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm leading-relaxed resize-y min-h-[120px]"
                  required
                />
              </div>
            </div>

            {/* Category & Specific Location Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Category <span className="text-[#2F80ED]">*</span>
                </label>
                <div className="relative flex items-center">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none z-10" />
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-slate-200 focus:border-[#2F80ED] text-slate-800 rounded-2xl outline-none transition-all text-sm cursor-pointer"
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Worksite / Location Type
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Remote, Hybrid, or On-site"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#2F80ED] text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Country & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Country <span className="text-[#2F80ED]">*</span>
                </label>
                <div className="relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="e.g. India"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#2F80ED] text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  City <span className="text-[#2F80ED]">*</span>
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#2F80ED] text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Salary Setup Block */}
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Salary Structure <span className="text-[#2F80ED]">*</span>
                </label>
                
                {/* Salary Switcher Tabs */}
                <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, salaryType: "fixed" })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      form.salaryType === "fixed"
                        ? "bg-[#2F80ED] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Fixed Salary
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, salaryType: "range" })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      form.salaryType === "range"
                        ? "bg-[#2F80ED] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Salary Range
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs based on salary type */}
              {form.salaryType === "fixed" ? (
                <div>
                  <div className="relative flex items-center">
                    <IndianRupee className="w-4 h-4 text-emerald-600 absolute left-4 pointer-events-none" />
                    <input
                      type="number"
                      name="fixedSalary"
                      value={form.fixedSalary}
                      onChange={handleChange}
                      placeholder="e.g. 1200000"
                      className="w-full pl-11 pr-16 py-3 bg-white border border-slate-200 focus:border-[#2F80ED] text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm"
                      required
                    />
                    <span className="absolute right-4 text-xs font-semibold text-slate-400">INR / yr</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Minimum Annual (₹)</label>
                    <div className="relative flex items-center">
                      <IndianRupee className="w-4 h-4 text-emerald-600 absolute left-4 pointer-events-none" />
                      <input
                        type="number"
                        name="salaryFrom"
                        value={form.salaryFrom}
                        onChange={handleChange}
                        placeholder="e.g. 800000"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-[#2F80ED] text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Maximum Annual (₹)</label>
                    <div className="relative flex items-center">
                      <IndianRupee className="w-4 h-4 text-emerald-600 absolute left-4 pointer-events-none" />
                      <input
                        type="number"
                        name="salaryTo"
                        value={form.salaryTo}
                        onChange={handleChange}
                        placeholder="e.g. 1600000"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-[#2F80ED] text-slate-800 placeholder-slate-400 rounded-2xl outline-none transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Job Listing...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Job Listing</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Verification Footer Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Postings are instantly indexed across AI job match feeds</span>
        </div>

      </div>
    </div>
  );
};

export default PostJob;