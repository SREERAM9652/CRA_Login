"use client"

import { useState, useRef } from "react"
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
  Crown,
  Sparkles,
  UserPlus,
  AlertCircle
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { switchRole, setCustomerReferral, loginCustomer } = useWorkflowStore()

  const [role, setRole] = useState<"customer" | "cra">("customer")
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password")
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [referralCode, setReferralCode] = useState("")

  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ identifier?: boolean; password?: boolean }>({})
  const identifierInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  const CRA_MEMBERS = [
    {
      id: "sreeram",
      name: "THURAKA SREERAM",
      roleLabel: "Primary CRA Partner (C1)",
      code: "AVM-SREERAM-C1",
      mobile: "9845012345",
      password: "sreeram@123",
      tagline: "Top Regional Super-Partner",
      desc: "Top root referrer • Gets 30% Direct + 10% Team override from Sudheer & Sai Mahendra",
      badgeColor: "bg-purple-100 text-[#382685] border-purple-200",
      teamSize: "3 Active Sub-Partners",
      walletBalance: "₹1,440 (Credited)",
      icon: Crown
    },
    {
      id: "sudheer",
      name: "SUDHEER REDDY",
      roleLabel: "Tier-2 Sub Partner (C2)",
      code: "AVM-SUDHEER-C2",
      mobile: "9886054321",
      password: "sudheer@123",
      tagline: "Introduced by Thuraka Sreeram",
      desc: "Introduced by THURAKA SREERAM (C1) • Gets 30% Direct on customer referrals",
      badgeColor: "bg-blue-100 text-[#2F5FDE] border-blue-200",
      teamSize: "Direct Referral Specialist",
      walletBalance: "₹912 (Credited)",
      icon: Users
    },
    {
      id: "mahendra",
      name: "SAI MAHENDRA",
      roleLabel: "Tier-2 Partner & Introducer",
      code: "AVM-MAHENDRA-C2",
      mobile: "9877011223",
      password: "mahendra@123",
      tagline: "Direct Partner & Sub-Agency Builder",
      desc: "Introduced by THURAKA SREERAM • Introduced VISHNU • Gets 30% Direct + 10% override from Vishnu",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      teamSize: "1 Sub-Partner (Vishnu)",
      walletBalance: "₹984 (Credited)",
      icon: Sparkles
    },
    {
      id: "vishnu",
      name: "VISHNU VARDHAN",
      roleLabel: "Tier-3 Partner (C2 Sub)",
      code: "AVM-VISHNU-C2",
      mobile: "9866033445",
      password: "vishnu@123",
      tagline: "Introduced by Sai Mahendra",
      desc: "Introduced by SAI MAHENDRA • Gets 30% Direct • 2-level cap stops at Sai Mahendra (0% to Sreeram)",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      teamSize: "Active Field Partner",
      walletBalance: "₹528 (Credited)",
      icon: Shield
    }
  ]

  const validateIdentifier = (val: string, currentRole?: "customer" | "cra"): string => {
    const trimmed = val.trim()
    const isCra = (currentRole ?? role) === "cra"

    if (!trimmed) {
      return isCra
        ? "Mobile Number / CRA ID is required."
        : "Mobile No (or) Email ID is required."
    }

    if (trimmed.includes("@")) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(trimmed)) {
        return "Please enter a valid email address (e.g. name@example.com)."
      }
      return ""
    }

    if (/^AVM-[A-Za-z0-9-]+$/i.test(trimmed) || ["sreeram", "sudheer", "mahendra", "vishnu"].includes(trimmed.toLowerCase())) {
      return ""
    }

    let digits = trimmed.replace(/[\s\-()]/g, "")
    if (digits.startsWith("+91")) {
      digits = digits.slice(3)
    } else if (digits.length === 12 && digits.startsWith("91")) {
      digits = digits.slice(2)
    } else if (digits.length === 11 && digits.startsWith("0")) {
      digits = digits.slice(1)
    }

    if (/^\d+$/.test(digits)) {
      if (digits.length < 10) {
        return `Mobile number must be 10 digits (currently ${digits.length}).`
      }
      if (digits.length > 10) {
        return "Mobile number cannot exceed 10 digits."
      }
      if (!/^[6-9]/.test(digits)) {
        return "Indian mobile number must begin with 6, 7, 8, or 9."
      }
      return ""
    }

    return isCra
      ? "Enter a valid 10-digit mobile number or CRA ID."
      : "Enter a valid 10-digit mobile number or email ID."
  }

  const validatePassword = (val: string): string => {
    if (!val || !val.trim()) {
      return "Password is required."
    }
    if (val.length < 6) {
      return "Password must be at least 6 characters."
    }
    return ""
  }

  const handleIdentifierChange = (val: string) => {
    setIdentifier(val)
    if (touched.identifier) {
      setErrors((prev) => ({ ...prev, identifier: validateIdentifier(val, role) }))
    }
  }

  const handleIdentifierBlur = () => {
    setTouched((prev) => ({ ...prev, identifier: true }))
    setErrors((prev) => ({ ...prev, identifier: validateIdentifier(identifier, role) }))
  }

  const handlePasswordChange = (val: string) => {
    setPassword(val)
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(val) }))
    }
  }

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }))
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }))
  }

  const handleRoleChange = (newRole: "customer" | "cra") => {
    setRole(newRole)
    setReferralCode("")
    setErrors({})
    setTouched({})
    setIdentifier("")
    setPassword("")
  }

  const detectedAccountType = (() => {
    const trimmed = identifier.trim().toLowerCase()
    if (!trimmed) return null
    if (trimmed.startsWith("avm-")) return "cra"
    const digits = trimmed.replace(/\D/g, "").slice(-10)
    if (CRA_MEMBERS.some((m) => m.mobile === digits || m.code.toLowerCase() === trimmed || m.id === trimmed)) {
      return "cra"
    }
    if (trimmed.includes("@")) return "customer"
    return null
  })()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const idError = validateIdentifier(identifier, role)
    const passError = validatePassword(password)

    setTouched({ identifier: true, password: true })
    setErrors({ identifier: idError, password: passError })

    if (idError || passError) {
      if (idError) {
        identifierInputRef.current?.focus()
      } else if (passError) {
        passwordInputRef.current?.focus()
      }
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      const cleanId = identifier.trim()
      const cleanDigits = cleanId.replace(/[\s\-()]/g, "").replace(/^(\+91|91|0)/, "")

      const matchedCra = CRA_MEMBERS.find(
        (m) =>
          m.code.toLowerCase() === cleanId.toLowerCase() ||
          m.mobile === cleanDigits ||
          m.id.toLowerCase() === cleanId.toLowerCase()
      )

      const isCraLogin = Boolean(
        matchedCra ||
        /^AVM-[A-Za-z0-9-]+$/i.test(cleanId) ||
        (role === "cra" && !cleanId.includes("@"))
      )

      if (isCraLogin) {
        const persona = matchedCra ? (matchedCra.id as "sreeram" | "sudheer" | "mahendra" | "vishnu") : "sreeram"
        switchRole(persona)
        router.push("/cra/dashboard")
      } else {
        const customerName = cleanId.includes("@")
          ? cleanId.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : "Suresh M."

        loginCustomer({
          name: customerName,
          mobile: cleanDigits.length === 10 ? cleanDigits : "+91 98450 12345"
        })
        switchRole("customer")
        router.push("/customer/dashboard")
      }
    }, 350)
  }

  const handleQuickRegister = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      loginCustomer({ name: "New Registered Patient", mobile: identifier || "+91 98450 12345" })
      switchRole("customer")
      router.push("/customer/dashboard")
    }, 350)
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
        loginCustomer({ name: "Suresh M.", mobile: "+91 98450 12345" })
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

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/login-bg.png"
          alt="AVMLabs Clinical Diagnostics"
          className="w-full h-full object-cover object-[20%_center] sm:object-center transition-all duration-300"
        />
      </div>

      <div className="hidden lg:flex flex-col items-center absolute top-14 xl:top-18 left-[13%] xl:left-[16%] z-[2] pointer-events-none select-none">
        <div className="font-signature font-bold text-2xl xl:text-3xl text-[#1e3a8a] tracking-wide -rotate-6 text-center leading-tight drop-shadow-xs">
          Your Health<br />Our Priority
        </div>
        <svg className="w-24 xl:w-28 h-3.5 text-[#1e3a8a] mt-0.5 -rotate-6" viewBox="0 0 160 20" fill="none">
          <path d="M5 14C45 3 115 2 155 12C120 7 70 8 20 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <div className="hidden lg:flex flex-col items-center absolute top-14 xl:top-18 right-[6%] xl:right-[8%] z-[2] pointer-events-none select-none">
        <div className="font-signature font-bold text-2xl xl:text-3xl text-[#1e3a8a] tracking-wide -rotate-6 text-center leading-tight drop-shadow-xs">
          Accurate Care<br />for a Healthier Tomorrow
        </div>
        <svg className="w-32 xl:w-36 h-3.5 text-[#1e3a8a] mt-0.5 -rotate-6" viewBox="0 0 160 20" fill="none">
          <path d="M5 14C45 3 115 2 155 12C120 7 70 8 20 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <header className="w-full py-3 px-4 sm:px-8 flex items-center justify-between z-10 shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 h-8 px-3 sm:px-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:shadow-xs text-xs font-semibold text-slate-800 hover:text-slate-950 transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-slate-600" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setIsDemoModalOpen(true)}
            className="hidden sm:inline-flex h-8 px-3.5 rounded-full bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] hover:from-[#0f172a] hover:to-[#312e81] text-white text-xs font-semibold items-center gap-1.5 shadow-2xs border border-indigo-300/30 transition-all cursor-pointer active:scale-98 whitespace-nowrap shrink-0"
          >
            <KeyRound className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
            <span>View CRA Member Logins</span>
          </button>

          <span className="text-[11px] text-slate-500 font-medium hidden sm:flex items-center gap-1 whitespace-nowrap">
            <HelpCircle className="h-3 w-3 text-slate-400" />
            <span>Need help?</span>
          </span>

          <a
            href="tel:18001234567"
            className="inline-flex items-center gap-1.5 h-8 px-3 sm:px-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-800 transition-all active:scale-98 whitespace-nowrap shrink-0"
          >
            <Headphones className="h-3.5 w-3.5 text-[#1e40af] shrink-0" />
            <span>1800 123 4567</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6 z-10 my-auto">

        <div className="w-full max-w-[820px] xl:max-w-[860px] bg-white/15 backdrop-blur-md rounded-2xl shadow-[0_20px_45px_-12px_rgba(0,0,0,0.18)] border border-white/50 ring-1 ring-white/30 overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-all duration-300">

          <div className="hidden md:flex md:col-span-6 bg-transparent p-6 sm:p-7 flex-col justify-between border-r border-white/25 relative overflow-hidden">

            <div className="space-y-3.5 z-10">
              <div className="inline-block">
                <img
                  src="/AVMLabs%20-%20Logo%20-%20WL%20.svg"
                  alt="AVMLabs Diagnostics"
                  className="h-16 sm:h-18 w-auto max-w-[210px] object-contain mix-blend-multiply drop-shadow-xs"
                />
              </div>

              <div>
                <h2 className="text-2xl sm:text-[25px] font-black text-slate-900 leading-tight tracking-tight">
                  Better Diagnostics. <br />
                  <span className="bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#e11d48] bg-clip-text text-transparent drop-shadow-xs">Stronger You.</span>
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Book tests, choose health profiles, and get trusted lab reports — all in one secure place.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">

                <div className="flex items-center gap-2.5 py-0.5 px-0.5 transition-all">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#1e40af] shrink-0">
                    <Microscope className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Wide Range of Tests</h4>
                    <p className="text-[10.5px] text-slate-500 font-medium">Accurate results for every health need.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 py-0.5 px-0.5 transition-all">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-700 shrink-0">
                    <Home className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Home Collection</h4>
                    <p className="text-[10.5px] text-slate-500 font-medium">Sample collection at your convenience.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 py-0.5 px-0.5 transition-all">
                  <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-700 shrink-0">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Digital Reports</h4>
                    <p className="text-[10.5px] text-slate-500 font-medium">Access your reports anytime, anywhere.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 py-0.5 px-0.5 transition-all">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                    <Shield className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Secure &amp; Confidential</h4>
                    <p className="text-[10.5px] text-slate-500 font-medium">Your data is protected with top security.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-center space-y-3.5 bg-white/10 md:bg-white/5">

            <div className="md:hidden flex items-center justify-center text-center pb-2.5">
              <img
                src="/AVMLabs%20-%20Logo%20-%20WL%20.svg"
                alt="AVMLabs Diagnostics"
                className="h-18 sm:h-20 w-auto max-w-[240px] sm:max-w-[260px] object-contain mix-blend-multiply drop-shadow-xs mx-auto"
              />
            </div>

            {role === "customer" ? (
              <div className="space-y-3.5">
                <div className="text-center space-y-0.5">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    Welcome to AVMLabs
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Book wellness tests and manage your reports
                  </p>
                </div>

                <form onSubmit={handleLogin} noValidate className="space-y-3 pt-0.5">
                  <div className="space-y-0.5 text-left">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>
                        Mobile No (or) Email ID <span className="text-rose-500">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        ref={identifierInputRef}
                        type="text"
                        value={identifier}
                        onChange={(e) => handleIdentifierChange(e.target.value)}
                        onBlur={handleIdentifierBlur}
                        placeholder="Enter 10-digit mobile or email"
                        className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs ${touched.identifier && errors.identifier
                            ? "bg-rose-50/30 border-2 border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                            : touched.identifier && !errors.identifier && identifier.trim()
                              ? "bg-emerald-50/20 border-2 border-emerald-400/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                              : "bg-white/60 hover:bg-white/80 focus:bg-white border border-slate-200/80 focus:border-[#251b5c] focus:ring-4 focus:ring-indigo-500/15"
                          }`}
                      />
                    </div>
                    {touched.identifier && errors.identifier && (
                      <div className="flex items-center gap-1.5 text-[10.5px] text-rose-600 font-semibold mt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        <AlertCircle className="h-3 w-3 shrink-0 text-rose-500" />
                        <span>{errors.identifier}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 text-left">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <a
                        href="#forgot-password"
                        onClick={(e) => {
                          e.preventDefault()
                          alert("A password reset link has been sent to your registered Mobile / Email.")
                        }}
                        className="text-[11px] font-semibold text-[#251b5c] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        ref={passwordInputRef}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onBlur={handlePasswordBlur}
                        placeholder="Enter your password (min. 6 characters)"
                        className={`w-full px-3.5 pr-9 py-2.5 text-xs sm:text-sm rounded-xl transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs ${touched.password && errors.password
                            ? "bg-rose-50/30 border-2 border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                            : touched.password && !errors.password && password.length >= 6
                              ? "bg-emerald-50/20 border-2 border-emerald-400/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                              : "bg-white/60 hover:bg-white/80 focus:bg-white border border-slate-200/80 focus:border-[#251b5c] focus:ring-4 focus:ring-indigo-500/15"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {touched.password && errors.password && (
                      <div className="flex items-center gap-1.5 text-[10.5px] text-rose-600 font-semibold mt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        <AlertCircle className="h-3 w-3 shrink-0 text-rose-500" />
                        <span>{errors.password}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#251b5c] via-[#31237a] to-[#251b5c] hover:from-[#1b1344] hover:to-[#251b5c] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#251b5c]/25 hover:shadow-lg hover:shadow-[#251b5c]/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99] mt-1"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Login</span>
                    )}
                  </button>

                  <div className="pt-2 border-t border-slate-200/70 space-y-2 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
                      <span>I don&apos;t have an Account?</span>
                      <button
                        type="button"
                        onClick={handleQuickRegister}
                        className="font-bold text-[#251b5c] hover:underline cursor-pointer"
                      >
                        Register Now
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleQuickRegister}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#251b5c] hover:text-[#1b1344] border-2 border-[#251b5c] font-black text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <UserPlus className="h-3.5 w-3.5 text-[#251b5c]" />
                      <span>Register Now</span>
                    </button>
                  </div>

                </form>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="text-center space-y-0.5">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    CRA Partner Login
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Access referral dashboard, team network &amp; wallet
                  </p>
                </div>

                <form onSubmit={handleLogin} noValidate className="space-y-2.5">

                  <div className="space-y-0.5 text-left">
                    <label className="text-xs font-bold text-slate-700">
                      Mobile Number / CRA ID <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => handleIdentifierChange(e.target.value)}
                        onBlur={handleIdentifierBlur}
                        placeholder="Mobile Number / CRA ID"
                        className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs ${touched.identifier && errors.identifier
                            ? "bg-rose-50/30 border-2 border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                            : touched.identifier && !errors.identifier && identifier.trim()
                              ? "bg-emerald-50/20 border-2 border-emerald-400/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                              : "bg-white/50 hover:bg-white/75 focus:bg-white/90 border border-white/60 focus:border-[#4338ca] focus:ring-4 focus:ring-indigo-500/15"
                          }`}
                      />
                    </div>
                    {touched.identifier && errors.identifier && (
                      <div className="flex items-center gap-1.5 text-[10.5px] text-rose-600 font-semibold mt-0.5">
                        <AlertCircle className="h-3 w-3 shrink-0 text-rose-500" />
                        <span>{errors.identifier}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 text-left">
                    <label className="text-xs font-bold text-slate-700">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onBlur={handlePasswordBlur}
                        placeholder="Password"
                        className={`w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-2xs ${touched.password && errors.password
                            ? "bg-rose-50/30 border-2 border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15"
                            : touched.password && !errors.password && password.length >= 6
                              ? "bg-emerald-50/20 border-2 border-emerald-400/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                              : "bg-white/60 hover:bg-white/80 focus:bg-white border border-slate-200/80 focus:border-[#251b5c] focus:ring-4 focus:ring-indigo-500/15"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {touched.password && errors.password && (
                      <div className="flex items-center gap-1.5 text-[10.5px] text-rose-600 font-semibold mt-0.5">
                        <AlertCircle className="h-3 w-3 shrink-0 text-rose-500" />
                        <span>{errors.password}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#251b5c] via-[#31237a] to-[#251b5c] hover:from-[#1b1344] hover:to-[#251b5c] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#251b5c]/25 hover:shadow-lg hover:shadow-[#251b5c]/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Sign In as CRA Partner</span>
                    )}
                  </button>

                  <div className="pt-0.5 text-center">
                    <button
                      type="button"
                      onClick={handleQuickRegister}
                      className="text-[11px] text-slate-600 font-medium hover:text-[#251b5c] cursor-pointer"
                    >
                      Don&apos;t have an Account? <span className="font-bold text-[#251b5c] underline">Register Now</span>
                    </button>
                  </div>
                </form>

                <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                  <div className="text-[9.5px] font-black uppercase tracking-widest text-slate-400 text-center">
                    QUICK DEMO PERSONA LOGINS
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFastDemoLogin("sreeram")}
                      className="p-1.5 rounded-lg bg-white/50 hover:bg-white/80 backdrop-blur-md border border-white/70 hover:border-indigo-300 text-left transition-all shadow-2xs cursor-pointer"
                    >
                      <div className="font-extrabold text-[10.5px] text-[#312e81]">Sreeram (C1)</div>
                      <div className="text-[9px] text-slate-500 font-medium">Root Partner • 30%+10%</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFastDemoLogin("sudheer")}
                      className="p-1.5 rounded-lg bg-white/50 hover:bg-white/80 backdrop-blur-md border border-white/70 hover:border-blue-300 text-left transition-all shadow-2xs cursor-pointer"
                    >
                      <div className="font-extrabold text-[10.5px] text-[#1e40af]">Sudheer (C2)</div>
                      <div className="text-[9px] text-slate-500 font-medium">Sub-Partner • 30%</div>
                    </button>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-200/60 text-center flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleFastDemoLogin("sreeram")}
                    className="text-[10.5px] text-amber-900 font-bold hover:underline bg-white/60 hover:bg-white/90 backdrop-blur-md px-3 py-0.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer shadow-2xs border border-amber-200/80 transition-transform active:scale-98"
                  >
                    <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span>Instant Demo as CRA (Thuraka Sreeram)</span>
                  </button>
                </div>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("customer")}
                    className="text-[11px] font-medium text-slate-600 hover:text-[#251b5c] transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>&larr; Return to</span>
                    <span className="font-bold underline text-[#251b5c]">Customer Login</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      <footer className="w-full py-2 text-center text-[11px] text-slate-500 border-t border-slate-200/60 bg-white/70 backdrop-blur-xs shrink-0 z-10">
        <div className="container mx-auto px-4 flex flex-row items-center justify-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1 text-slate-600 font-semibold">
            <Lock className="h-3 w-3 text-[#1e40af]" /> Secure. Reliable. Confidential.
          </span>
          <span className="text-slate-300">|</span>
          <span>&copy; {new Date().getFullYear()} AVM Labs India.</span>
        </div>
      </footer>

      {isDemoModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-200 max-h-[90vh] overflow-y-auto">

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
