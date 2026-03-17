import React from 'react'
import OrbitAnimation from "@/components/SvgOrbit";
import {  ArrowRight,
  Brain,

  ExternalLink} from 'lucide-react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';


function Landing() {
      const navigate = useNavigate();
    
  return (
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid text-center lg:text-left lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 border border-coral/20 text-coral text-xs font-bold uppercase tracking-widest">
              <Brain className="w-3.5 h-3.5" />
              Clinically Grounded AI 
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-black leading-[1.1] tracking-tight">
              Evaluating Appendicitis with{" "}
              <span className="text-coral">Intelligence</span>.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Dharma is a modern clinical–AI hybrid scoring system for the
              diagnosis and prognostic assessment of pediatric appendicitis.
              Built for real-world clinical environments, it incorporates a
              clinically grounded imputation framework to handle missing
              clinical data, including common scenarios such as
              non-visualization of the appendix on ultrasound.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/app")}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/10"
              >
                Run Analysis <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0000908"
                target="_blank"
                className="px-8 py-4 bg-secondary border border-border rounded-2xl font-bold flex items-center gap-2 hover:bg-secondary/80 transition-all"
              >
                Evidence <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
          <div className='hidden lg:flex'>         
            <OrbitAnimation/>
             </div>
        
        </div> 
         <div className="absolute lg:hidden too-0 left-0 blur-sm"> 
          <OrbitAnimation/>
          </div>
         
      </section>
  )
}

export default Landing



