import Link from "next/link"
import { Mail, Phone, MapPin, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white text-slate-600 pt-16 pb-12 border-t border-slate-200" id="contact">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3.5 sm:gap-4 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/AVMLabs - Logo - WL .svg"
                alt="AVMLabs Diagnostics"
                className="h-14 sm:h-16 md:h-18 w-auto max-w-[170px] sm:max-w-[200px] object-contain"
              />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#1e1b4b] tracking-tight">AVMLabs</span>
                  <span className="bg-[#dc2626] text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    INDIA
                  </span>
                </div>
                <span className="text-[9px] sm:text-[9.5px] font-semibold text-slate-500 tracking-wider uppercase mt-1">
                  NEXT-GEN DIAGNOSTICS &amp; PREVENTIVE HEALTH
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              India&apos;s premier diagnostic laboratory network. Delivering automated, barcoded pathology precision with 100% painless home sample collection and rapid digital reports.
            </p>
          </div>

          {/* Diagnostic Services */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4">Diagnostics</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link href="/booking?search=Master%20Health" className="hover:text-primary transition-colors">Master Health Checkup</Link></li>
              <li><Link href="/booking?search=CBC" className="hover:text-primary transition-colors">Complete Blood Count (CBC)</Link></li>
              <li><Link href="/booking?search=Thyroid" className="hover:text-primary transition-colors">Thyroid Profile (T3, T4, TSH)</Link></li>
              <li><Link href="/booking?search=Diabetes" className="hover:text-primary transition-colors">HbA1c & Fasting Glucose</Link></li>
              <li><Link href="/booking?search=Vitamin" className="hover:text-primary transition-colors">Vitamin D3 & B12 Panel</Link></li>
              <li><Link href="/booking?search=Lipid" className="hover:text-primary transition-colors">Lipid Cardiac Profile</Link></li>
            </ul>
          </div>

          {/* Portals & Workflows */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4">Portals & Partners</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/cra" className="text-accent hover:text-accent/90 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Become a CRA Partner
                </Link>
              </li>
              <li><Link href="/cra/dashboard" className="hover:text-primary transition-colors">CRA Dashboard</Link></li>
              <li><Link href="/cra/dashboard/add-lead" className="hover:text-primary transition-colors">Submit Client Lead</Link></li>
              <li><Link href="/customer/dashboard" className="hover:text-primary transition-colors">Patient Portal & Reports</Link></li>
              <li><Link href="/booking" className="hover:text-primary transition-colors">Book Test Online</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4">Support & Hubs</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, 560038</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs text-slate-600">+91 80 4912 8800 (24/7)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs text-slate-600">info@avmlabs.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} AVMLabs Diagnostic Laboratories India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
