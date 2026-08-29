"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import { 
  User, 
  Users, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  HelpCircle, 
  Headphones, 
  Microscope, 
  Home, 
  FileText, 
  Shield, 
  ArrowLeft,
  Zap,
  KeyRound,
  X,
  Network,
  CheckCircle2,
  Phone,
  Dna,
  Droplets,
  Stethoscope,
  FlaskConical,
  Pill
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { switchRole } = useWorkflowStore()

  const [role, setRole] = useState<"customer" | "cra">("customer")
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password")
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState("suresh.m@example.com")
  const [password, setPassword] = useState("••••••••")
  const [rememberMe, setRememberMe] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(["4", "8", "2", "1", "9", "0"])
  const [loading, setLoading] = useState(false)

  // Separate Modal for CRA Member Sample Login Details
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  // 4 Real CRA Member Personas
  const CRA_MEMBERS = [
    {
      id: "sreeram",
      name: "THURAKA SREERAM",
      roleLabel: "Primary CRA Partner (C1)",
      code: "AVM-SREERAM-C1",
      mobile: "9845012345",
      password: "sreeram@123",
      city: "Hyderabad",
      desc: "Top root referrer • Gets 30% Direct + 10% Team override from Sudheer & Sai Mahendra",
      badgeColor: "bg-purple-100 text-[#382685] border-purple-200"
    },
    {
      id: "sudheer",
      name: "SUDHEER REDDY",
      roleLabel: "Secondary Partner (C2)",
      code: "AVM-SUDHEER-C2",
      mobile: "9886054321",
      password: "sudheer@123",
      city: "Bengaluru",
      desc: "Introduced by THURAKA SREERAM (C1) • Gets 30% Direct on customer referrals",
      badgeColor: "bg-blue-100 text-[#2F5FDE] border-blue-200"
    },
    {
      id: "mahendra",
      name: "SAI MAHENDRA",
      roleLabel: "Secondary Partner (C2 & Referrer)",
      code: "AVM-MAHENDRA-C2",
      mobile: "9740098765",
      password: "mahendra@123",
      city: "Pune",
      desc: "Introduced by THURAKA SREERAM • Introduced VISHNU • Gets 30% Direct + 10% override from Vishnu",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      id: "vishnu",
      name: "VISHNU VARDHAN",
      roleLabel: "Secondary Partner (C2 under Mahendra)",
      code: "AVM-VISHNU-C2",
      mobile: "9822077112",
      password: "vishnu@123",
      city: "Vijayawada",
      desc: "Introduced by SAI MAHENDRA • Gets 30% Direct • 2-level cap stops at Sai Mahendra (0% to Sreeram)",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200"
    }
  ]

  const handleRoleChange = (newRole: "customer" | "cra") => {
    setRole(newRole)
    if (newRole === "customer") {
      setIdentifier("suresh.m@example.com")
      setPassword("••••••••")
    } else {
      setIdentifier("9845012345")
      setPassword("sreeram@123")
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (role === "customer") {
        switchRole("customer")
        router.push("/customer/dashboard")
      } else {
        switchRole("sreeram")
        router.push("/cra/dashboard")
      }
    }, 350)
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier) {
      alert("Please enter your mobile number")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOtpSent(true)
    }, 400)
  }

  const handleOtpChange = (index: number, val: string) => {
    if (val.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = val
      setOtp(newOtp)
      if (val && index < 5) {
        document.getElementById(`otp-digit-${index + 1}`)?.focus()
      }
    }
  }

  const handleFastDemoLogin = (targetPersona?: "sreeram" | "sudheer" | "mahendra" | "vishnu" | "customer") => {
    setLoading(true)
    setIsDemoModalOpen(false)
    setTimeout(() => {
      setLoading(false)
      if (targetPersona === "customer" || (!targetPersona && role === "customer")) {
        switchRole("customer")
        router.push("/customer/dashboard")
      } else {
        switchRole(targetPersona || "sreeram")
        router.push("/cra/dashboard")
      }
    }, 250)
  }

  return (
    <div className="min-h-screen min-h-[100dvh] lg:h-screen w-full bg-gradient-to-br from-[#f8f9fd] via-[#f1f3fa] to-[#eaf0fc] flex flex-col justify-between font-sans text-slate-800 relative overflow-x-hidden overflow-y-auto lg:overflow-hidden select-none selection:bg-[#382685] selection:text-white">
      
      {/* ========================================================================= */}
      {/* SCATTERED LABORATORY ICONS & BIO-FORMULAS BACKGROUND PATTERN             */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Soft Ambient Breathing Glows */}
        <div className="absolute -top-20 -left-20 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-purple-300/25 rounded-full blur-[90px]" />
        <div className="absolute -bottom-20 -right-20 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] bg-blue-300/25 rounded-full blur-[100px]" />

        {/* Scattered Clinical Icons & Chemical Tags Matching Screenshot */}
        <div className="absolute top-16 left-12 p-3 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-purple-100/60 rotate-[-12deg] text-purple-400 opacity-65 hidden sm:block">
          <Microscope className="h-6 w-6" />
        </div>

        <div className="absolute top-44 left-10 text-[11.5px] font-mono font-bold text-slate-400/80 tracking-wider hidden sm:block">
          HbA1c ≤ 5.4%
        </div>

        <div className="absolute top-64 left-10 p-2.5 bg-white/60 backdrop-blur-xs rounded-xl shadow-2xs border border-blue-100 text-[#2F5FDE] opacity-60 hidden sm:block">
          <Dna className="h-5 w-5" />
        </div>

        <div className="absolute bottom-36 left-14 px-2.5 py-1 bg-rose-50/80 border border-rose-200/60 rounded-md font-mono text-[10.5px] font-bold text-rose-500/80 shadow-2xs hidden sm:block">
          CBC
        </div>

        <div className="absolute bottom-16 left-16 p-2.5 bg-white/60 backdrop-blur-xs rounded-xl text-rose-400 opacity-50 hidden sm:block">
          <Droplets className="h-5 w-5" />
        </div>

        {/* Right Side Icons */}
        <div className="absolute top-16 right-16 p-3 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-teal-100/60 rotate-[10deg] text-teal-500 opacity-65 hidden sm:block">
          <Stethoscope className="h-6 w-6" />
        </div>

        <div className="absolute top-36 right-14 text-[11.5px] font-mono font-bold text-slate-400/80 tracking-wider hidden sm:block">
          pH: 7.4
        </div>

        <div className="absolute top-60 right-12 p-2.5 bg-white/60 backdrop-blur-xs rounded-xl border border-amber-100 text-amber-500 opacity-60 hidden sm:block">
          <FlaskConical className="h-5 w-5" />
        </div>

        <div className="absolute bottom-40 right-14 font-mono text-[11.5px] font-bold text-cyan-600/70 hidden sm:block">
          SpO₂: 99%
        </div>

        <div className="absolute bottom-16 right-16 p-2.5 bg-white/60 backdrop-blur-xs rounded-xl text-purple-400 opacity-50 hidden sm:block">
          <Pill className="h-5 w-5" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER: Back to Home + Need Help + CRA Member Logins Modal Button      */}
      {/* ========================================================================= */}
      <header className="w-full py-2.5 sm:py-3 px-4 sm:px-8 flex items-center justify-between z-10 shrink-0">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Separate Button to View CRA Member Logins */}
          <button
            type="button"
            onClick={() => setIsDemoModalOpen(true)}
            className="h-8 px-3 rounded-full bg-gradient-to-r from-[#251b5c] to-[#382685] hover:from-[#1e1b4b] hover:to-[#2e1f74] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5 text-cyan-300" />
            <span>View CRA Member Logins</span>
          </button>

          <span className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Need help?</span>
          </span>

          <a 
            href="tel:18001234567" 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs text-xs font-bold text-slate-800 transition-all"
          >
            <Headphones className="h-3.5 w-3.5 text-[#382685]" />
            <span>1800 123 4567</span>
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN UNIFIED FLOATING CARD (MATCHING USER SCREENSHOT EXACTLY)             */}
      {/* ========================================================================= */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 z-10 my-auto">
        
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* ------------------------------------------------------------- */}
          {/* LEFT PANEL: Better Diagnostics. Stronger You. & 4 Features    */}
          {/* ------------------------------------------------------------- */}
          <div className="hidden md:flex md:col-span-6 bg-gradient-to-br from-[#faf9ff] via-[#f5f3ff]/80 to-[#eff4fe] p-6 lg:p-8 flex-col justify-between border-r border-slate-100 relative overflow-hidden">
            
            {/* Subtle brand glow behind logo */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-44 h-44 bg-purple-200/40 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 z-10">
              {/* Logo */}
              <div className="inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="AVMLabs Diagnostics"
                  className="h-12 w-auto max-w-[170px] object-contain mix-blend-multiply"
                />
              </div>

              {/* Tagline */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                  Better Diagnostics. <br />
                  <span className="text-[#E15241]">Stronger You.</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  Book tests, choose health profiles, and get trusted lab reports — all in one secure place.
                </p>
              </div>

              {/* 4 Feature Points */}
              <div className="space-y-3 pt-2">
                
                {/* Feature 1 */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-100/80 border border-purple-200/60 flex items-center justify-center text-purple-700 shrink-0">
                    <Microscope className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Wide Range of Tests</h4>
                    <p className="text-[11px] text-slate-500">Accurate results for every health need.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-rose-100/80 border border-rose-200/60 flex items-center justify-center text-rose-600 shrink-0">
                    <Home className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Home Collection</h4>
                    <p className="text-[11px] text-slate-500">Sample collection at your convenience.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-100/80 border border-blue-200/60 flex items-center justify-center text-[#2F5FDE] shrink-0">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Digital Reports</h4>
                    <p className="text-[11px] text-slate-500">Access your reports anytime, anywhere.</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
                    <Shield className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Secure &amp; Confidential</h4>
                    <p className="text-[11px] text-slate-500">Your data is protected with top security.</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-3 border-t border-purple-100/60 text-[10.5px] text-slate-400 font-mono flex items-center justify-between z-10">
              <span>AVMLabs Portal</span>
              <span>2-Level Referral System</span>
            </div>

          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT PANEL: Welcome Back! Login Form (Customer / CRA Tabs)   */}
          {/* ------------------------------------------------------------- */}
          <div className="md:col-span-6 p-6 sm:p-7 lg:p-8 flex flex-col justify-center space-y-4">
            
            {/* Header */}
            <div className="text-center space-y-0.5">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Welcome Back!
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Login to access your account
              </p>
            </div>

            {/* Role Switcher Tabs (Customer vs CRA Partner) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              
              {/* Customer Tab */}
              <button
                type="button"
                onClick={() => handleRoleChange("customer")}
                className={`py-2 px-2.5 rounded-xl transition-all text-left flex items-center gap-2 cursor-pointer ${
                  role === "customer"
                    ? "bg-purple-50/90 border border-purple-200 text-[#382685] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <User className={`h-4 w-4 shrink-0 ${role === "customer" ? "text-[#382685]" : "text-slate-400"}`} />
                <div className="min-w-0">
                  <div className="text-xs font-black leading-tight truncate">Customer</div>
                  <div className="text-[9.5px] text-slate-400 font-medium leading-tight truncate">Book tests &amp; health</div>
                </div>
              </button>

              {/* CRA Partner Tab */}
              <button
                type="button"
                onClick={() => handleRoleChange("cra")}
                className={`py-2 px-2.5 rounded-xl transition-all text-left flex items-center gap-2 cursor-pointer ${
                  role === "cra"
                    ? "bg-purple-50/90 border border-purple-200 text-[#382685] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users className={`h-4 w-4 shrink-0 ${role === "cra" ? "text-[#382685]" : "text-slate-400"}`} />
                <div className="min-w-0">
                  <div className="text-xs font-black leading-tight truncate">CRA Partner</div>
                  <div className="text-[9.5px] text-slate-400 font-medium leading-tight truncate">Refer &amp; earn rewards</div>
                </div>
              </button>

            </div>

            {/* Standard Form */}
            {loginMode === "password" ? (
              <form onSubmit={handleLogin} className="space-y-3.5">
                
                {/* Mobile / Identifier */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === "customer" ? "Mobile Number / Email" : "Mobile Number / CRA ID"}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#382685] focus:ring-1 focus:ring-[#382685] transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#382685] focus:ring-1 focus:ring-[#382685] transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-[#382685] focus:ring-[#382685]/30 cursor-pointer"
                    />
                    <span className="font-medium text-[11.5px]">Remember me</span>
                  </label>

                  <a href="#" className="font-bold text-[#382685] hover:underline text-[11.5px]">
                    Forgot Password?
                  </a>
                </div>

                {/* Main Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2e1f74] hover:bg-[#251860] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Login</span>
                  )}
                </button>

                {/* OR Divider */}
                <div className="relative flex py-0 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">OR</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Login with OTP Button */}
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("otp")
                    setOtpSent(false)
                  }}
                  className="w-full py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Smartphone className="h-4 w-4 text-[#382685]" />
                  <span>Login with OTP</span>
                </button>

              </form>
            ) : (
              /* OTP Form Mode */
              <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-3">
                {!otpSent ? (
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter 10-Digit Mobile Number"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#382685] focus:ring-1 focus:ring-[#382685] transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#2e1f74] hover:bg-[#251860] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Send Login OTP</span>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center text-[11px] text-slate-500">
                      Enter 6-digit OTP sent to <span className="font-bold text-slate-800">{identifier}</span>:
                    </div>
                    <div className="flex justify-between gap-1.5">
                      {otp.map((d, i) => (
                        <input
                          key={i}
                          id={`otp-digit-${i}`}
                          type="text"
                          maxLength={1}
                          value={d}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          className="w-9 h-10 text-center font-bold text-base border border-slate-300 rounded-xl text-slate-900 focus:border-[#382685] focus:outline-none bg-slate-50"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#2e1f74] hover:bg-[#251860] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Verify &amp; Login</span>
                      )}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => { setLoginMode("password"); setOtpSent(false); }}
                  className="w-full py-1 text-xs text-[#382685] font-bold hover:underline cursor-pointer"
                >
                  ← Back to Password Login
                </button>
              </form>
            )}

            {/* Instant Demo Pill Button Matching Screenshot */}
            <div className="pt-2 border-t border-slate-100 text-center flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleFastDemoLogin()}
                className="text-[11px] text-[#382685] font-bold hover:underline bg-[#f1effd] px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 cursor-pointer shadow-2xs transition-transform active:scale-98"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>
                  {role === "customer" ? "Instant Demo as Patient (Suresh M.)" : "Instant Demo as CRA (Thuraka S.)"}
                </span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* CLEAN SINGLE-LINE BOTTOM FOOTER                                           */}
      {/* ========================================================================= */}
      <footer className="w-full py-2 text-center text-[11px] text-slate-500 border-t border-slate-200/60 bg-white/70 backdrop-blur-xs shrink-0 z-10">
        <div className="container mx-auto px-4 flex flex-row items-center justify-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1 text-slate-600 font-semibold">
            <Lock className="h-3 w-3 text-[#382685]" /> Secure. Reliable. Confidential.
          </span>
          <span className="text-slate-300">|</span>
          <span>&copy; {new Date().getFullYear()} AVM Labs India.</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* SEPARATE POPUP MODAL: CRA MEMBER SAMPLE LOGIN CREDENTIALS & 2-LEVEL CHAIN */}
      {/* ========================================================================= */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-[#382685] border border-purple-200">
                    Demonstration Logins
                  </span>
                  <h3 className="font-black text-lg text-slate-900">CRA Partner Accounts</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click <strong>1-Click Login</strong> on any member card to instantly access their dashboard
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 4 Member Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CRA_MEMBERS.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#251b5c] transition-all space-y-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-black text-xs sm:text-sm text-slate-900">{p.name}</div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border mt-0.5 inline-block ${p.badgeColor}`}>
                        {p.roleLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFastDemoLogin(p.id as any)}
                      className="px-2.5 py-1 rounded-xl bg-[#251b5c] hover:bg-[#1e1b4b] text-white font-bold text-[10.5px] shadow-xs cursor-pointer"
                    >
                      1-Click Login ⚡
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    {p.desc}
                  </p>

                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10.5px] font-mono text-slate-700">
                    <span>Code: <strong className="text-slate-900">{p.code}</strong></span>
                    <span>Mobile: <strong className="text-slate-900">{p.mobile}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2-Level Chain Info */}
            <div className="bg-slate-950 text-white rounded-2xl p-3.5 border border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-blue-300 font-extrabold uppercase text-[10px]">
                <span className="flex items-center gap-1.5">
                  <Network className="h-3.5 w-3.5 text-cyan-300" />
                  <span>2-Level Referral Commission Structure</span>
                </span>
                <span className="text-emerald-400 font-mono">30% Direct • 10% Override</span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between flex-wrap gap-1 pt-1 border-t border-white/10">
                <span>👑 SREERAM</span>
                <span className="text-cyan-400 font-bold font-mono">➔ 10%</span>
                <span>🚀 SAI MAHENDRA</span>
                <span className="text-cyan-400 font-bold font-mono">➔ 30%</span>
                <span>🔬 VISHNU</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
