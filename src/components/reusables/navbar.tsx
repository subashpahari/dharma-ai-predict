import { ModeToggle } from "@/components/ModeToggle";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/useAuth";



function Nabvar() {
      const { user } = useAuth();
      const navigate = useNavigate();
  return (
        <nav className="fixed top-0 w-full z-50 glass-border bg-background/80 backdrop-blur-md border-b">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                 <img
                   src="/images/logo.png" // path to your logo
                   alt="Dharma Logo"
                   className="w-7 h-7 object-contain"
                 />
               </div>
               <span className="font-display font-bold text-xl tracking-tight hidden sm:inline">
                 Dharma <span className="text-coral">AI</span>
               </span>
             </div>
   
             <div className="hidden md:flex items-center gap-8">
               <a
                 href="#how-it-works"
                 className="text-sm font-medium text-muted-foreground hover:text-coral transition-colors"
               >
                 How it Works
               </a>
               <a
                 href="#comparison"
                 className="text-sm font-medium text-muted-foreground hover:text-coral transition-colors"
               >
                 Comparison
               </a>
               <a
                 href="#research"
                 className="text-sm font-medium text-muted-foreground hover:text-coral transition-colors"
               >
                 Research
               </a>
             </div>
   
             <div className="flex items-center gap-1.5 sm:gap-4">
               <ModeToggle />
               {!user ? (
                 <>
                   <button
                     onClick={() => navigate("/auth")}
                     className="text-xs sm:text-sm font-medium hover:text-coral transition-colors px-1"
                   >
                     Log In
                   </button>
                   <button
                     onClick={() => navigate("/app")}
                     className="px-3 sm:px-5 py-1.5 sm:py-2 bg-coral text-white rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-coral/20 hover:scale-105 transition-all whitespace-nowrap"
                   >
                     Get Started
                   </button>
                 </>
               ) : (
                 <button
                   onClick={() => navigate("/app")}
                   className="px-4 sm:px-5 py-2 bg-coral text-white rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-coral/20 hover:scale-105 transition-all"
                 >
                   Go to App
                 </button>
               )}
             </div>
           </div>
         </nav>
  )
}

export default Nabvar
