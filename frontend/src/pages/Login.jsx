import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../store/slices/authSlice";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Briefcase, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  LogIn as LogInIcon,
  ShieldCheck
} from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "", role: "Job Seeker" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-16 sm:px-6 lg:px-8 font-sans animate-fadeIn">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 rounded-[16px] bg-[#2F80ED] flex items-center justify-center shadow-[0_4px_14px_rgba(47,128,237,0.3)] group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-[24px] font-bold tracking-tight text-white">
            Jobnique
          </span>
        </Link>
        <h1 className="text-[32px] font-bold tracking-tight text-white mb-2">
          Welcome back
        </h1>
        <p className="text-[16px] text-slate-400">
          Sign in to access your dashboard and applications
        </p>
      </div>

      {/* Main Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[460px]">
        <div className="bg-slate-900/80 backdrop-blur-xl py-10 px-6 sm:px-10 border border-slate-800 rounded-[28px] shadow-2xl">
          
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-[16px] flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-[14px] text-red-300 font-medium leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Interactive Segmented Role Toggle */}
            <div>
              <label className="block text-[14px] font-semibold text-slate-200 mb-2">
                I am logging in as
              </label>
              <div className="flex p-1.5 bg-slate-950/60 border border-slate-800 rounded-[18px]">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "Job Seeker" })}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 rounded-[14px] text-[15px] font-medium transition-all ${
                    form.role === "Job Seeker"
                      ? "bg-slate-800 text-blue-400 shadow-md font-semibold border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Job Seeker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "Employer" })}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 rounded-[14px] text-[15px] font-medium transition-all ${
                    form.role === "Employer"
                      ? "bg-slate-800 text-blue-400 shadow-md font-semibold border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Employer</span>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[14px] font-semibold text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]/40 focus:border-[#2F80ED] text-white placeholder-slate-500 text-[16px] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[14px] font-semibold text-slate-200">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[14px] font-semibold text-[#2F80ED] hover:text-blue-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-950/60 border border-slate-800 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]/40 focus:border-[#2F80ED] text-white placeholder-slate-500 text-[16px] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 p-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 px-6 rounded-full font-semibold text-[16px] text-white bg-gradient-to-r from-[#2F80ED] to-[#2563EB] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogInIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[14px]">
              <span className="px-4 bg-slate-900 text-slate-400">
                New to Jobnique?
              </span>
            </div>
          </div>

          {/* Register Callout */}
          <Link
            to="/register"
            className="w-full py-3.5 px-6 bg-slate-950/60 border border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200 hover:text-white rounded-full text-[15px] font-semibold transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span>Create a new account</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-2 mt-8 text-[14px] font-medium text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted 256-bit secure authentication</span>
        </div>

      </div>
    </div>
  );
};

export default Login;