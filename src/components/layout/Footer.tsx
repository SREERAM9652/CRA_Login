import Link from "next/link"
import { Activity, Mail, Phone, MapPin, Sparkles, Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900" id="contact">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-block bg-white p-2 rounded-xl shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="AVMLabs Diagnostics"
                className="h-10 w-auto object-contain rounded-md"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              India&apos;s premier diagnostic laboratory network. Delivering automated, barcoded pathology precision with 100% painless home sample collection and rapid digital reports.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/50 p-2.5 rounded-xl max-w-sm">
              <Shield className="h-4 w-4 shrink-0" />
              <span>NABL Accredited Reference Pathology Laboratory</span>
            </div>
          </div>

          {/* Diagnostic Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Diagnostics</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/booking?search=Master%20Health" className="hover:text-cyan-400 transition-colors">Master Health Checkup</Link></li>
              <li><Link href="/booking?search=CBC" className="hover:text-cyan-400 transition-colors">Complete Blood Count (CBC)</Link></li>
              <li><Link href="/booking?search=Thyroid" className="hover:text-cyan-400 transition-colors">Thyroid Profile (T3, T4, TSH)</Link></li>
              <li><Link href="/booking?search=Diabetes" className="hover:text-cyan-400 transition-colors">HbA1c & Fasting Glucose</Link></li>
              <li><Link href="/booking?search=Vitamin" className="hover:text-cyan-400 transition-colors">Vitamin D3 & B12 Panel</Link></li>
              <li><Link href="/booking?search=Lipid" className="hover:text-cyan-400 transition-colors">Lipid Cardiac Profile</Link></li>
            </ul>
          </div>

          {/* Portals & Workflows */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Portals & Partners</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/cra" className="text-accent hover:text-accent/90 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Become a CRA Partner
                </Link>
              </li>
              <li><Link href="/cra/dashboard" className="hover:text-white transition-colors">CRA Dashboard</Link></li>
              <li><Link href="/cra/dashboard/add-lead" className="hover:text-white transition-colors">Submit Client Lead</Link></li>
              <li><Link href="/customer/dashboard" className="hover:text-white transition-colors">Patient Portal & Reports</Link></li>
              <li><Link href="/booking" className="hover:text-white transition-colors">Book Test Online</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support & Hubs</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs">100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, 560038</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs">+91 80 4912 8800 (24/7)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs">care@avmlabs.in</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} AVMLabs Diagnostic Laboratories India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">Quality Control NABL</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
