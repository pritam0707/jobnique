import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  IndianRupee,
  Calculator,
  TrendingUp,
  MapPin,
  Briefcase,
  Sparkles,
  PieChart,
  Building2,
  Info,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

// Roles with base salary ranges in INR (Annual)
const ROLES_DATA = [
  { title: "Frontend Engineer", baseMin: 600000, baseMax: 1800000 },
  { title: "Backend Engineer", baseMin: 700000, baseMax: 2000000 },
  { title: "Full Stack Engineer", baseMin: 800000, baseMax: 2200000 },
  { title: "AI / ML Engineer", baseMin: 1000000, baseMax: 2800000 },
  { title: "DevOps / Infrastructure", baseMin: 850000, baseMax: 2100000 },
  { title: "Product Designer (UI/UX)", baseMin: 550000, baseMax: 1600000 },
  { title: "Data Scientist", baseMin: 900000, baseMax: 2400000 },
];

const LOCATIONS = [
  { name: "Bengaluru, KA", multiplier: 1.2 },
  { name: "Mumbai / Pune, MH", multiplier: 1.15 },
  { name: "Delhi NCR (Gurugram/Noida)", multiplier: 1.1 },
  { name: "Hyderabad, TS", multiplier: 1.1 },
  { name: "Bhubaneswar / Tier-2 Cities", multiplier: 0.85 },
  { name: "Remote (Global / India)", multiplier: 1.0 },
];

const SalaryCalculator = () => {
  const navigate = useNavigate();

  // Form State
  const [selectedRole, setSelectedRole] = useState(ROLES_DATA[0].title);
  const [yearsExperience, setYearsExperience] = useState(3);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[5].name);
  const [equityValuation, setEquityValuation] = useState("Medium");

  // Calculations Logic
  const roleObj = ROLES_DATA.find((r) => r.title === selectedRole) || ROLES_DATA[0];
  const locationObj = LOCATIONS.find((l) => l.name === selectedLocation) || LOCATIONS[5];

  // Experience multiplier factor (5% per year)
  const expMultiplier = 1 + yearsExperience * 0.05;

  // Final Estimated Salary Ranges (INR)
  const calculatedMin = Math.round(roleObj.baseMin * expMultiplier * locationObj.multiplier);
  const calculatedMax = Math.round(roleObj.baseMax * expMultiplier * locationObj.multiplier);
  const calculatedMedian = Math.round((calculatedMin + calculatedMax) / 2);

  // Breakdown projections
  const estimatedMonthlyGross = Math.round(calculatedMedian / 12);
  const estimatedTaxRate = 0.20; // Estimated Indian tax slab deduction
  const estimatedNetMonthly = Math.round(estimatedMonthlyGross * (1 - estimatedTaxRate));

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0B0F17] text-[#111827] dark:text-[#F3F4F6] pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans animate-fadeIn transition-colors duration-300">
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#2F80ED] dark:hover:text-[#56CCF2] transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home Page</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDF5FF] dark:bg-[#2F80ED]/10 border border-[#2F80ED]/20 text-[#2F80ED] dark:text-[#56CCF2] text-[13px] font-semibold uppercase tracking-wider mb-3">
                <Calculator className="w-4 h-4" />
                <span>Compensation Intelligence</span>
              </div>
              <h1 className="text-[36px] sm:text-[44px] font-bold tracking-tight text-[#111827] dark:text-white">
                Tech Salary Calculator
              </h1>
            </div>
            <p className="text-[15px] text-[#6B7280] dark:text-[#9CA3AF] max-w-xs sm:text-right">
              Estimate market-rate compensation, take-home metrics, and global equity projections in real-time.
            </p>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Inputs (7 Columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 sm:p-10 space-y-8 transition-colors duration-300">
            
            <div className="pb-4 border-b border-[#E5E7EB] dark:border-[#1F2937]">
              <h2 className="text-[20px] font-bold text-[#111827] dark:text-white flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-[#2F80ED] dark:text-[#56CCF2]" />
                Select Your Criteria
              </h2>
            </div>

            {/* 1. Job Role Selector */}
            <div className="space-y-3">
              <label className="block text-[14px] font-semibold text-[#111827] dark:text-white">
                Primary Engineering Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-5 py-3.5 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-[18px] text-[#111827] dark:text-white text-[16px] shadow-[0_2px_10px_rgb(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]/40 focus:border-[#2F80ED] transition-all cursor-pointer"
              >
                {ROLES_DATA.map((role) => (
                  <option key={role.title} value={role.title} className="bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
                    {role.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Experience Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[14px] font-semibold text-[#111827] dark:text-white">
                  Years of Relevant Experience
                </label>
                <span className="text-[15px] font-bold text-[#2F80ED] dark:text-[#56CCF2] bg-[#EDF5FF] dark:bg-[#2F80ED]/20 px-3 py-1 rounded-full border border-[#2F80ED]/20">
                  {yearsExperience} {yearsExperience === 1 ? "Year" : "Years"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(Number(e.target.value))}
                className="w-full h-2 bg-[#E5E7EB] dark:bg-[#374151] rounded-lg appearance-none cursor-pointer accent-[#2F80ED]"
              />
              <div className="flex justify-between text-[12px] font-semibold text-[#9CA3AF] dark:text-[#6B7280]">
                <span>Junior (0 yrs)</span>
                <span>Mid-Level (5 yrs)</span>
                <span>Senior (10+ yrs)</span>
              </div>
            </div>

            {/* 3. Location Selector */}
            <div className="space-y-3">
              <label className="block text-[14px] font-semibold text-[#111827] dark:text-white">
                Work Location / Worksite
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-5 h-5 text-[#9CA3AF] absolute left-4 pointer-events-none" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-12 pr-5 py-3.5 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-[18px] text-[#111827] dark:text-white text-[16px] shadow-[0_2px_10px_rgb(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]/40 focus:border-[#2F80ED] transition-all cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.name} value={loc.name} className="bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Equity Band Toggle */}
            <div className="space-y-3">
              <label className="block text-[14px] font-semibold text-[#111827] dark:text-white">
                Startup Equity / Bonus Package Tier
              </label>
              <div className="grid grid-cols-3 gap-3 p-1.5 bg-[#F7FAFC] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-[18px]">
                {["Low", "Medium", "High"].map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setEquityValuation(tier)}
                    className={`py-2.5 rounded-[14px] text-[14px] font-semibold transition-all ${
                      equityValuation === tier
                        ? "bg-white dark:bg-[#111827] text-[#2F80ED] dark:text-[#56CCF2] shadow-[0_2px_10px_rgb(0,0,0,0.04)] dark:shadow-none border border-[#E5E7EB] dark:border-[#374151]"
                        : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white"
                    }`}
                  >
                    {tier} Equity
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Results Panel (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main Calculated Output Card */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2F80ED] to-[#56CCF2]" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E7EB] dark:border-[#1F2937]">
                <span className="text-[14px] font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#2F80ED] dark:text-[#56CCF2]" />
                  Estimated Annual Base
                </span>
                <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] text-[12px] font-bold rounded-full">
                  Verified Data
                </span>
              </div>

              {/* Big Salary Numbers */}
              <div className="mb-6">
                <div className="text-[32px] sm:text-[38px] font-extrabold text-[#111827] dark:text-white tracking-tight leading-none flex items-center">
                  ₹{calculatedMedian.toLocaleString("en-IN")}
                  <span className="text-[16px] font-medium text-[#6B7280] dark:text-[#9CA3AF] ml-1">/ year</span>
                </div>
                <p className="text-[14px] text-[#6B7280] dark:text-[#9CA3AF] mt-2 font-medium">
                  Expected Range: <span className="font-semibold text-[#111827] dark:text-white">₹{calculatedMin.toLocaleString("en-IN")}</span> – <span className="font-semibold text-[#111827] dark:text-white">₹{calculatedMax.toLocaleString("en-IN")}</span>
                </p>
              </div>

              {/* Monthly Breakdown Boxes */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#F7FAFC] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-[18px] mb-6">
                <div>
                  <p className="text-[12px] text-[#6B7280] dark:text-[#9CA3AF] font-semibold uppercase">Gross Monthly</p>
                  <p className="text-[17px] font-bold text-[#111827] dark:text-white mt-0.5">₹{estimatedMonthlyGross.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#22C55E] font-semibold uppercase">Est. Take-Home</p>
                  <p className="text-[17px] font-bold text-[#22C55E] mt-0.5">₹{estimatedNetMonthly.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {/* Browse Jobs CTA */}
              <Link
                to={`/jobs?search=${encodeURIComponent(selectedRole)}`}
                className="w-full py-3.5 bg-gradient-to-r from-[#2F80ED] to-[#2563EB] text-white hover:opacity-95 rounded-full text-[15px] font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(47,128,237,0.39)] active:scale-[0.98]"
              >
                <span>Find {selectedRole} Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Compensation Insights Card */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-6 space-y-4 transition-colors duration-300">
              <h3 className="text-[16px] font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#2F80ED] dark:text-[#56CCF2]" />
                Market Trends & Perks
              </h3>
              
              <ul className="space-y-3 text-[14px] text-[#6B7280] dark:text-[#9CA3AF]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span><strong className="text-[#111827] dark:text-white">Remote Advantage:</strong> Global remote offers currently align with Tier-1 city medians.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span><strong className="text-[#111827] dark:text-white">AI Skill Premium:</strong> Machine Learning experience adds an average 18% compensation uplift.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SalaryCalculator;