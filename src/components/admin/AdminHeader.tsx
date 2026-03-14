import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Menu, 
  FileText, 
  ArrowLeft 
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from '@/components/ModeToggle';
import GoogleTranslate from '@/components/GoogleTranslate';
import React from 'react';

interface AdminHeaderProps {
  isUsersOpen: boolean;
  setIsUsersOpen: (open: boolean) => void;
  isReportsOpen: boolean;
  setIsReportsOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedUserId: string | null;
  selectedReport: any | null;
  userSidebarContent: React.ReactNode;
  reportsSidebarContent: React.ReactNode;
}

export function AdminHeader({
  isUsersOpen,
  setIsUsersOpen,
  isReportsOpen,
  setIsReportsOpen,
  searchTerm,
  setSearchTerm,
  selectedUserId,
  selectedReport,
  userSidebarContent,
  reportsSidebarContent
}: AdminHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-5 flex-shrink-0 bg-sidebar z-30">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="lg:hidden">
          <Sheet open={isUsersOpen} onOpenChange={setIsUsersOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              {userSidebarContent}
            </SheetContent>
          </Sheet>
        </div>

        <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-coral" />
        </div>
        <div>
          <h1 className="font-display font-bold text-sm sm:text-lg text-gradient truncate max-w-[120px] sm:max-w-none">Admin Center</h1>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest hidden sm:block">User-Centric Oversight</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search users by email or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-coral/40 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <GoogleTranslate />
        <div className="hidden sm:block">
          <ModeToggle />
        </div>
        
        <div className="lg:hidden">
          <Sheet open={isReportsOpen} onOpenChange={setIsReportsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
                <FileText className="w-5 h-5 text-muted-foreground" />
                {selectedUserId && !selectedReport && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-72">
              {reportsSidebarContent}
            </SheetContent>
          </Sheet>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs bg-secondary hover:bg-secondary/80 rounded-lg text-muted-foreground items-center gap-2 transition-all border border-border flex shrink-0"
        >
          <ArrowLeft className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <span className="hidden xs:inline">Exit Admin</span>
        </button>
      </div>
    </header>
  );
}
