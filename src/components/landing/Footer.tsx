import { Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Dharma Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="font-display font-semibold text-gradient">DharmaAI</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#comparison" className="hover:text-foreground transition-colors">Our Approach</a>
            <a href="#paper" className="hover:text-foreground transition-colors">Research</a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="mailto:contact@dharmaai.com"
              className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 text-center text-xs text-muted-foreground">
          ©️ {new Date().getFullYear()} DharmaAI — All rights reserved.
        </div>
      </div>
    </footer>
  );
}