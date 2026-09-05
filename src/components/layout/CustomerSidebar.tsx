"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useWorkflowStore } from "@/lib/workflow-store"
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  LogOut,
  Search,
  HelpCircle,
  X,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react"

interface CustomerSidebarProps {
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
}

export function CustomerSidebar({ mobileOpen = false, setMobileOpen }: CustomerSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { customer, logoutCustomer } = useWorkflowStore()

  const handleLogout = () => {
    logoutCustomer()
    router.push("/login?role=customer")
  }

  const navLinks = [
    { name: "My Health Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Find Tests & Book", href: "/booking", icon: Search },
    { name: "Orders & Appointments", href: "/customer/dashboard#orders", icon: ClipboardList },
    { name: "Digital Lab Reports", href: "/customer/dashboard#reports", icon: FileText },
  ]

  const customerName = customer?.name || "Suresh M."
  const avatarInitials = customerName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false)
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP FIXED SIDEBAR                                                     */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200/80 fixed inset-y-0 left-0 top-0 z-40 shadow-xs">
        {/* Logo */}
        <div className="py-2 px-3 flex items-center justify-center border-b border-slate-100/90 bg-white">
          <Link href="/" className="inline-block hover:scale-102 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avmlabs-logo.svg"
              alt="AVMLabs Diagnostics"
              className="h-[76px] w-auto max-w-[225px] object-contain"
            />
          </Link>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto pt-2.5 pb-5 px-3.5 space-y-4">
          <div>
            <div className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Healthcare Portal
            </div>
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#1e3a8a] text-white shadow-sm shadow-blue-950/20"
                        : "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-sky-200 stroke-[2.5]" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Account &amp; Services
            </div>
            <nav className="space-y-1">
              <Link
                href="/customer/dashboard#beneficiaries"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Users className="h-4 w-4 text-slate-400" />
                <span>Family Beneficiaries</span>
              </Link>
              <Link
                href="/customer/dashboard#wallet"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Wallet className="h-4 w-4 text-slate-400" />
                <div className="flex items-center justify-between w-full">
                  <span>Wallet &amp; Cashback</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[5px] border border-emerald-200">
                    ₹{customer?.walletBalance || 350}
                  </span>
                </div>
              </Link>
              <Link
                href="/cra/dashboard/help"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-slate-400" />
                <span>Help &amp; FAQs</span>
              </Link>
              <Link
                href="/cra"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold text-[#1e3a8a] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/70 transition-colors mt-2"
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Become a CRA Partner</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {avatarInitials}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{customerName}</p>
                <p className="text-[10px] text-slate-500 font-mono">#AVM-PT-981</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MODAL                                                       */}
      {/* ========================================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={closeMobile}
          />

          <div className="relative flex-1 flex flex-col max-w-[310px] w-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <Link href="/customer/dashboard" onClick={closeMobile} className="inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/avmlabs-logo.svg"
                  alt="AVMLabs Diagnostics"
                  className="h-12 w-auto max-w-[160px] object-contain"
                />
              </Link>

              <button
                onClick={closeMobile}
                className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile Mini Card */}
            <div className="p-3.5 bg-gradient-to-br from-slate-50 to-indigo-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#251b5c] to-[#382685] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{customerName}</div>
                  <div className="text-[10px] font-semibold text-purple-700 mt-0.5">
                    Patient #{customer?.id || "AVM-PT-981"}
                  </div>
                </div>
              </div>

              <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                Wallet: ₹{customer?.walletBalance || 350}
              </span>
            </div>

            {/* Scrollable Nav List */}
            <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
              <div>
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Healthcare Services
                </div>
                <div className="space-y-1">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeMobile}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold transition-all ${
                          isActive
                            ? "bg-[#1e3a8a] text-white shadow-sm shadow-blue-950/20"
                            : "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-sky-200 stroke-[2.5]" : "text-slate-400"}`} />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Account &amp; Benefits
                </div>
                <div className="space-y-1">
                  <Link
                    href="/customer/dashboard#beneficiaries"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-semibold bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>Family Beneficiaries</span>
                  </Link>

                  <Link
                    href="/customer/dashboard#wallet"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-semibold bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    <span>Wallet &amp; Coupons (₹{customer?.walletBalance || 350})</span>
                  </Link>

                  <Link
                    href="/cra"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-[5px] text-xs font-bold text-[#1e3a8a] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/70 mt-2"
                  >
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>CRA Partner Portal</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  closeMobile()
                  handleLogout()
                }}
                className="w-full h-10 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout from Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
