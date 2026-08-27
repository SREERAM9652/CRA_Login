"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How do I book a home collection?",
    answer: "You can book a home collection by selecting your desired test or package, choosing the 'Home Collection' method, and picking a convenient date and time slot. Our trained phlebotomist will visit your home at the scheduled time."
  },
  {
    question: "How long does it take to get the reports?",
    answer: "Most routine tests (like CBC, blood sugar) are processed and reported within 12-24 hours. Specialized tests might take longer. The exact Turn Around Time (TAT) is mentioned against each test on our website."
  },
  {
    question: "Are my online reports secure?",
    answer: "Yes, absolutely. Your health data is encrypted and stored securely. You can only access your reports through your verified account dashboard."
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer: "Yes, you can easily reschedule or cancel your booking through your dashboard up to 2 hours before the scheduled collection time without any cancellation fee."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-600">
            Find answers to common questions about our diagnostic services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 shadow-sm"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left font-medium text-slate-900 hover:bg-slate-50 focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  className={cn(
                    "h-5 w-5 text-slate-400 transition-transform duration-200",
                    openIndex === index && "rotate-180 text-primary"
                  )} 
                />
              </button>
              
              <div 
                className={cn(
                  "px-6 text-slate-600 text-sm overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === index ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
