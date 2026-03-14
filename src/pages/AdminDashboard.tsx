import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAdmin, type AdminReport } from '@/hooks/useAdmin';

// Modular Components
import { AdminHeader } from '@/components/admin/AdminHeader';
import { UserDirectory } from '@/components/admin/UserDirectory';
import { ReportsLog } from '@/components/admin/ReportsLog';
import { ClinicalDetail } from '@/components/admin/ClinicalDetail';

export default function AdminDashboard() {
  const { reports, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  // Group reports by user
  const userGroups = useMemo(() => {
    return reports.reduce((acc, report) => {
      if (!acc[report.user_id]) acc[report.user_id] = [];
      acc[report.user_id].push(report);
      return acc;
    }, {} as Record<string, AdminReport[]>);
  }, [reports]);

  const userIds = useMemo(() => Object.keys(userGroups).sort(), [userGroups]);
  
  const filteredUserIds = useMemo(() => {
    return userIds.filter(id => {
      const email = userGroups[id][0].user_email || id;
      return email.toLowerCase().includes(searchTerm.toLowerCase()) || 
             id.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [userIds, userGroups, searchTerm]);

  const currentUserReports = selectedUserId ? userGroups[selectedUserId] : [];

  const handleSelectUser = (uid: string) => {
    setSelectedUserId(uid);
    setSelectedReport(null);
    setIsUsersOpen(false);
    // Auto-open reports drawer on mobile after selecting a user
    if (window.innerWidth < 1024) {
      setTimeout(() => setIsReportsOpen(true), 300);
    }
  };

  const handleSelectReport = (report: AdminReport) => {
    setSelectedReport(report);
    setIsReportsOpen(false);
  };

  const userSidebar = (
    <UserDirectory 
      userIds={userIds}
      userGroups={userGroups}
      selectedUserId={selectedUserId}
      loading={loading}
      onSelectUser={handleSelectUser}
      filteredUserIds={filteredUserIds}
    />
  );

  const reportsSidebar = (
    <ReportsLog 
      selectedUserId={selectedUserId}
      currentUserReports={currentUserReports}
      selectedReport={selectedReport}
      onSelectReport={handleSelectReport}
    />
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <AdminHeader 
        isUsersOpen={isUsersOpen}
        setIsUsersOpen={setIsUsersOpen}
        isReportsOpen={isReportsOpen}
        setIsReportsOpen={setIsReportsOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedUserId={selectedUserId}
        selectedReport={selectedReport}
        userSidebarContent={userSidebar}
        reportsSidebarContent={reportsSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Column 1: Users (Desktop) */}
        <aside className="w-64 flex-shrink-0 border-r border-border bg-sidebar hidden lg:flex flex-col">
          {userSidebar}
        </aside>

        {/* Column 2: User Reports (Desktop) */}
        <aside className="w-72 flex-shrink-0 border-r border-border bg-sidebar/30 hidden lg:flex flex-col">
          {reportsSidebar}
        </aside>

        {/* Column 3: Detail View */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 bg-background/50 relative">
          <AnimatePresence mode="wait">
            <ClinicalDetail selectedReport={selectedReport} />
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
