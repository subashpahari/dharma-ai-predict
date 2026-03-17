import { ChevronRight, Stethoscope } from 'lucide-react'
import React from 'react'

function ResearchRedirection() {
  return (
      <section
        id="research"
        className="py-24 bg-primary text-primary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-8">
          <Stethoscope className="w-12 h-12 mx-auto text-coral" />
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Grounded in Peer-Reviewed Research
          </h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto italic font-serif">
            "Dharma: A novel, clinically grounded machine learning framework for
            pediatric appendicitis - Diagnosis, severity assessment and
            evidence-based clinical decision support"
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <div className="text-left bg-coral   border border-white/10 p-6 rounded-2xl backdrop-blur-md">
             
              <p className="font-small">Thapa Kshetri, A. et al.</p>
            </div>
            <a
              href="https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0000908"
              target="_blank"
              className="group flex items-center gap-3 px-8 py-5 bg-coral rounded-2xl font-display font-bold text-white hover:scale-105 transition-all shadow-2xl shadow-coral/40"
            >
              Access Publication{" "}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
  )
}

export default ResearchRedirection
