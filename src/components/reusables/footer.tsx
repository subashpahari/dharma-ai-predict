function Footer() {
  return (
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                <img
                  src="/images/logo.png" // path to your logo
                  alt="Dharma Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>{" "}
              <span className="font-display font-bold text-lg">Dharma AI</span>
            </div>
            <p className="text-xs text-muted-foreground  tracking-widest font-medium">
              ©️ 2026 Dharma-AI.org
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-coral"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-coral"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-coral"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
  )
}

export default Footer