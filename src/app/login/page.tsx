"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  ArrowRight,
  Zap,
  FlaskConical,
  Dna,
  Stethoscope,
  Pill,
  Droplets
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<"customer" | "cra">("customer")
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password")
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(["4", "8", "2", "1", "9", "0"])
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (role === "customer") {
        router.push("/customer/dashboard")
      } else {
        router.push("/cra/dashboard")
      }
    }, 400)
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
    }, 500)
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

  const handleFastDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (role === "customer") {
        router.push("/customer/dashboard")
      } else {
        router.push("/cra/dashboard")
      }
    }, 300)
  }

  return (
    <div className="min-h-screen min-h-[100dvh] lg:h-screen w-full bg-gradient-to-br from-[#f8f9fd] via-[#f1f3fa] to-[#eaf0fc] flex flex-col justify-between font-sans text-slate-800 relative overflow-x-hidden lg:overflow-hidden select-none selection:bg-[#382685] selection:text-white">
      
      {/* ========================================================================= */}
      {/* SCATTERED LABORATORY ICONS & BIO-FORMULAS BACKGROUND PATTERN               */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Soft Ambient Breathing Glows */}
        <div className="absolute -top-24 -left-20 w-[450px] h-[450px] bg-purple-300/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute -bottom-24 -right-20 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[110px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

        {/* Subtle Clinical Dot-Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="medical-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#2e1f74" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-grid)" />
        </svg>

        {/* ======================================================================= */}
        {/* LEFT FLANK SCATTERED ICONS & FORMULAS (VISIBLE ON DESKTOP/TABLET)       */}
        {/* ======================================================================= */}
        
        {/* Icon 1: Microscope */}
        <div className="hidden sm:block absolute top-[12%] left-[4%] animate-float opacity-35 text-[#382685]">
          <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl shadow-xs border border-purple-100/60 rotate-[-10deg]">
            <Microscope className="h-7 w-7" />
          </div>
        </div>

        {/* Formula 1: HbA1c */}
        <div className="hidden md:block absolute top-[28%] left-[7%] animate-float-delayed opacity-30 text-slate-600 font-mono text-sm font-bold rotate-[6deg]">
          HbA1c ≤ 5.4%
        </div>

        {/* Icon 2: DNA Helix */}
        <div className="hidden sm:block absolute top-[44%] left-[3%] animate-float opacity-30 text-blue-600">
          <div className="p-2.5 bg-white/70 backdrop-blur-xs rounded-xl shadow-xs border border-blue-100/60 rotate-[15deg]">
            <Dna className="h-6 w-6" />
          </div>
        </div>

        {/* Pill Badge 1: CBC */}
        <div className="hidden md:block absolute top-[60%] left-[6%] animate-float-delayed opacity-35">
          <span className="px-3 py-1 rounded-lg bg-rose-50/80 border border-rose-200/60 text-rose-700 text-xs font-black rotate-[-8deg] shadow-xs inline-block">
            CBC • Platelets
          </span>
        </div>

        {/* Formula 2: Glucose formula */}
        <div className="hidden md:block absolute top-[72%] left-[4%] animate-float opacity-25 text-slate-500 font-mono text-xs font-semibold">
          C₆H₁₂O₆ (94 mg/dL)
        </div>

        {/* Icon 3: Blood Drop */}
        <div className="hidden sm:block absolute bottom-[10%] left-[6%] animate-float-delayed opacity-35 text-rose-500">
          <div className="p-2.5 bg-white/70 backdrop-blur-xs rounded-xl shadow-xs border border-rose-100/60 rotate-[-12deg]">
            <Droplets className="h-6 w-6" />
          </div>
        </div>

        {/* Formula 3: TSH */}
        <div className="hidden lg:block absolute top-[18%] left-[13%] animate-float opacity-25 text-purple-700 font-mono text-xs font-extrabold rotate-[4deg]">
          TSH = 2.18 µIU
        </div>

        {/* Pill Badge 2: Lipid */}
        <div className="hidden lg:block absolute top-[84%] left-[10%] animate-float opacity-30">
          <span className="px-2.5 py-1 rounded-md bg-cyan-50/80 border border-cyan-200/60 text-cyan-800 text-[11px] font-bold rotate-[10deg] inline-block shadow-xs">
            Lipid Profile
          </span>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT FLANK SCATTERED ICONS & FORMULAS                                  */}
        {/* ======================================================================= */}
        
        {/* Icon 4: Stethoscope */}
        <div className="hidden sm:block absolute top-[12%] right-[5%] animate-float opacity-35 text-teal-600">
          <div className="p-3 bg-white/70 backdrop-blur-xs rounded-2xl shadow-xs border border-teal-100/60 rotate-[12deg]">
            <Stethoscope className="h-7 w-7" />
          </div>
        </div>

        {/* Formula 4: pH */}
        <div className="hidden md:block absolute top-[26%] right-[7%] animate-float-delayed opacity-30 text-slate-600 font-mono text-sm font-bold rotate-[-6deg]">
          pH = 7.35-7.45
        </div>

        {/* Pill Badge 3: Master Health */}
        <div className="hidden md:block absolute top-[42%] right-[3%] animate-float opacity-40">
          <span className="px-3 py-1 rounded-xl bg-purple-50/90 border border-purple-200/60 text-[#382685] text-xs font-black rotate-[-10deg] shadow-xs inline-block">
            Master Health 85+
          </span>
        </div>

        {/* Icon 5: Flask / Test Tube */}
        <div className="hidden sm:block absolute top-[57%] right-[6%] animate-float-delayed opacity-35 text-amber-500">
          <div className="p-2.5 bg-white/70 backdrop-blur-xs rounded-xl shadow-xs border border-amber-100/60 rotate-[8deg]">
            <FlaskConical className="h-6 w-6" />
          </div>
        </div>

        {/* Formula 5: O2 Saturation */}
        <div className="hidden md:block absolute top-[70%] right-[4%] animate-float opacity-30 text-blue-600 font-mono text-xs font-bold rotate-[5deg]">
          SpO₂: 99% • Normal
        </div>

        {/* Icon 6: Pill & Wellness */}
        <div className="hidden sm:block absolute bottom-[12%] right-[6%] animate-float-delayed opacity-35 text-indigo-500">
          <div className="p-2.5 bg-white/70 backdrop-blur-xs rounded-xl shadow-xs border border-indigo-100/60 rotate-[14deg]">
            <Pill className="h-6 w-6" />
          </div>
        </div>

        {/* Pill Badge 4: Thyroid & Vit D */}
        <div className="hidden lg:block absolute top-[84%] right-[10%] animate-float opacity-30">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-[11px] font-bold rotate-[-8deg] inline-block shadow-xs">
            Vitamin D & B12
          </span>
        </div>

        {/* Formula 6: eGFR */}
        <div className="hidden lg:block absolute top-[18%] right-[14%] animate-float opacity-25 text-slate-500 font-mono text-xs font-extrabold rotate-[-4deg]">
          eGFR &gt; 90 mL/min
        </div>

        {/* Ambient Waveform on Bottom */}
        <div className="absolute bottom-5 left-0 right-0 h-10 opacity-15 overflow-hidden pointer-events-none">
          <svg className="w-full h-full stroke-[#382685] fill-none" viewBox="0 0 1200 40">
            <path
              className="animate-ecg"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M0,20 L150,20 L165,8 L175,32 L185,4 L195,36 L205,20 L400,20 L415,8 L425,32 L435,4 L445,36 L455,20 L700,20 L715,8 L725,32 L735,4 L745,36 L755,20 L950,20 L965,8 L975,32 L985,4 L995,36 L1005,20 L1200,20"
            />
          </svg>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER HELPER                                                         */}
      {/* ========================================================================= */}
      <header className="w-full px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex justify-between items-center z-20 shrink-0">
        <Link href="/" className="inline-block lg:hidden hover:scale-102 transition-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt="AVMLabs Diagnostics"
            className="h-12 sm:h-14 w-auto max-w-[170px] sm:max-w-[220px] object-contain mix-blend-multiply drop-shadow-xs"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5 text-xs font-semibold text-slate-600">
          <Link href="/#faq" className="hidden sm:flex items-center gap-1.5 hover:text-[#382685] transition-colors">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Need help?</span>
          </Link>
          <a href="tel:18001234567" className="flex items-center gap-1.5 hover:text-[#382685] transition-colors font-bold text-slate-900 bg-white/80 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-full border sm:border-0 border-slate-200 shadow-2xs sm:shadow-none">
            <Headphones className="h-4 w-4 text-[#382685]" />
            <span>1800 123 4567</span>
          </a>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN SPLIT SECTION: RESPONSIVE CONTAINER (CLEAN ON MOBILE & DESKTOP)      */}
      {/* ========================================================================= */}
      <main className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl flex-1 flex items-center justify-center py-4 sm:py-6 lg:py-2 relative z-10 min-h-0">
        
        {/* THE UNIFIED CONTAINER */}
        <div className="w-full max-w-md lg:max-w-5xl bg-white/95 rounded-3xl shadow-2xl shadow-indigo-950/10 border border-white/90 overflow-hidden flex flex-col lg:flex-row lg:max-h-[560px] lg:min-h-[500px]">
          
          {/* LEFT HALF: SHOWCASE & INTEGRATED LAB BACKGROUND (DESKTOP ONLY) */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center relative p-7 lg:p-8 bg-gradient-to-br from-slate-50 via-indigo-50/25 to-purple-50/20 border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden">
            
            {/* Background Laboratory Image overlay with soft gradient blend */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/lab-bg.jpg"
                alt="AVMLabs Pathology Laboratory"
                className="w-full h-full object-cover object-right opacity-30 mix-blend-multiply scale-105"
              />
              {/* Soft white gradient fade on top and left */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/60" />
              
              {/* Bottom-left curved wave accent */}
              <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-[#31237a] to-[#513db3] opacity-25 blur-2xl" />
            </div>

            {/* Left Content (Above background) */}
            <div className="relative z-10 space-y-3.5 my-auto">
              
              {/* Logo - Direct Clean Presentation without white box border */}
              <div>
                <Link href="/" className="inline-block hover:scale-105 transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt="AVMLabs Diagnostics"
                    className="h-16 md:h-18 w-auto object-contain mix-blend-multiply"
                  />
                </Link>
              </div>

              {/* Headline & Subtitle */}
              <div className="space-y-1 w-full">
                <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight text-[#251b5c] leading-[1.12]">
                  Better Diagnostics.<br />
                  <span className="text-[#e04838]">Stronger You.</span>
                </h1>
                <p className="text-slate-600 text-xs leading-relaxed w-full font-medium">
                  Book tests, choose health profiles, and get trusted lab reports — all in one secure place.
                </p>
              </div>

              {/* 4 Feature Items - Clean Transparent Style */}
              <div className="space-y-2.5 w-full pt-1">
                
                {/* Feature 1 */}
                <div className="w-full flex items-center gap-3.5 py-1 px-1">
                  <div className="h-9 w-9 rounded-xl bg-purple-100/80 border border-purple-200/60 flex items-center justify-center text-[#5538b5] shrink-0 shadow-xs">
                    <Microscope className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Wide Range of Tests</h4>
                    <p className="text-[11px] text-slate-500 truncate">Accurate results for every health need.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="w-full flex items-center gap-3.5 py-1 px-1">
                  <div className="h-9 w-9 rounded-xl bg-rose-100/80 border border-rose-200/60 flex items-center justify-center text-[#e04838] shrink-0 shadow-xs">
                    <Home className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Home Collection</h4>
                    <p className="text-[11px] text-slate-500 truncate">Sample collection at your convenience.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="w-full flex items-center gap-3.5 py-1 px-1">
                  <div className="h-9 w-9 rounded-xl bg-blue-100/80 border border-blue-200/60 flex items-center justify-center text-[#3056d3] shrink-0 shadow-xs">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Digital Reports</h4>
                    <p className="text-[11px] text-slate-500 truncate">Access your reports anytime, anywhere.</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="w-full flex items-center gap-3.5 py-1 px-1">
                  <div className="h-9 w-9 rounded-xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center text-[#e04838] shrink-0 shadow-xs">
                    <Shield className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Secure &amp; Confidential</h4>
                    <p className="text-[11px] text-slate-500 truncate">Your data is protected with top security.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT HALF: CLEAN AUTHENTICATION FORM */}
          <div className="w-full lg:w-1/2 p-6 sm:p-7 lg:p-8 flex flex-col justify-center bg-white space-y-3.5">
            
            {/* Header */}
            <div className="text-center space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Login to access your account
              </p>
            </div>

            {/* Segmented Dual-Role Switcher */}
            <div className="border border-slate-200 rounded-2xl p-1 grid grid-cols-2 gap-1 bg-slate-50/70">
              
              {/* Customer Tab */}
              <button
                type="button"
                onClick={() => {
                  setRole("customer")
                  setOtpSent(false)
                }}
                className={`p-2.5 sm:p-2 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                  role === "customer"
                    ? "bg-[#f1effd] border border-[#d3ccf7] text-[#2e1f74] shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <User className={`h-3.5 w-3.5 ${role === "customer" ? "text-[#382685]" : "text-slate-400"}`} />
                  <span className="font-bold text-xs">Customer</span>
                </div>
                <p className="text-[9.5px] sm:text-[9px] text-slate-500 leading-tight font-medium">Book tests &amp; health</p>
              </button>

              {/* CRA Tab */}
              <button
                type="button"
                onClick={() => {
                  setRole("cra")
                  setOtpSent(false)
                }}
                className={`p-2.5 sm:p-2 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                  role === "cra"
                    ? "bg-[#f1effd] border border-[#d3ccf7] text-[#2e1f74] shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Users className={`h-3.5 w-3.5 ${role === "cra" ? "text-[#e04838]" : "text-slate-400"}`} />
                  <span className="font-bold text-xs">CRA Partner</span>
                </div>
                <p className="text-[9.5px] sm:text-[9px] text-slate-500 leading-tight font-medium">Refer &amp; earn rewards</p>
              </button>

            </div>

            {/* Password Login Form */}
            {loginMode === "password" ? (
              <form onSubmit={handleLogin} className="space-y-2.5">
                
                {/* Identifier Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === "customer" ? "Mobile Number / Email" : "Mobile Number / CRA ID"}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#382685] focus:ring-1 focus:ring-[#382685] transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#382685] focus:ring-1 focus:ring-[#382685] transition-all text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#382685] focus:ring-[#382685]"
                    />
                    <span className="font-medium">Remember me</span>
                  </label>

                  <a href="#" className="font-bold text-[#382685] hover:underline">
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
                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">OR</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Login with OTP Button */}
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("otp")
                    setOtpSent(false)
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Smartphone className="h-4 w-4 text-[#382685]" />
                  <span>Login with OTP</span>
                </button>

              </form>
            ) : (
              /* OTP Login Form */
              <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-2.5">
                
                {!otpSent ? (
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter 10-Digit Mobile Number"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#382685] focus:ring-1 focus:ring-[#382685] transition-all text-slate-900"
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

            {/* Fast 1-Click Demo Login */}
            <div className="pt-1 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={handleFastDemoLogin}
                className="text-[11px] sm:text-[10px] text-[#382685] font-semibold hover:underline bg-[#f1effd] px-3.5 py-1.5 sm:py-1 rounded-full inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>Instant Demo as {role === "customer" ? "Patient (Suresh M.)" : "CRA (Rajesh J.)"}</span>
              </button>
            </div>

            {/* Register link */}
            <div className="text-center text-xs sm:text-[11px] pt-0">
              <span className="text-slate-500 font-medium">New to AVM Labs? </span>
              <Link
                href={role === "customer" ? "/booking" : "/cra"}
                className="font-bold text-[#e04838] hover:underline inline-flex items-center gap-1"
              >
                <span>Create an Account</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* CLEAN SINGLE-LINE BOTTOM FOOTER                                           */}
      {/* ========================================================================= */}
      <footer className="w-full py-2.5 text-center text-[11px] text-slate-500 border-t border-slate-200/60 bg-white/70 backdrop-blur-xs shrink-0 z-10">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3">
          <span className="flex items-center gap-1 text-slate-600 font-semibold">
            <Lock className="h-3 w-3 text-[#382685]" /> Secure. Reliable. Confidential.
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span>&copy; {new Date().getFullYear()} AVM Labs India. All rights reserved.</span>
        </div>
      </footer>

    </div>
  )
}
