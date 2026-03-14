import { Users } from 'lucide-react';
import { AdminReport } from '@/hooks/useAdmin';

interface UserDirectoryProps {
  userIds: string[];
  userGroups: Record<string, AdminReport[]>;
  selectedUserId: string | null;
  loading: boolean;
  onSelectUser: (uid: string) => void;
  filteredUserIds: string[];
}

export function UserDirectory({
  userIds,
  userGroups,
  selectedUserId,
  loading,
  onSelectUser,
  filteredUserIds
}: UserDirectoryProps) {
  return (
    <div className="h-full flex flex-col bg-sidebar">
      <div className="p-4 border-b border-border bg-sidebar/50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-coral" />
          <h2 className="text-xs font-bold text-sidebar-foreground uppercase tracking-wider">Active Users ({userIds.length})</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        {filteredUserIds.map((uid) => (
          <button
            key={uid}
            onClick={() => onSelectUser(uid)}
            className={`w-full text-left p-3 rounded-lg transition-all group flex items-center justify-between ${
              selectedUserId === uid ? 'bg-coral/10 text-coral border border-coral/20' : 'hover:bg-sidebar-accent/50 text-muted-foreground'
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className={`w-2 h-2 rounded-full ${selectedUserId === uid ? 'bg-coral animate-pulse' : 'bg-border'}`} />
              <span className="text-xs font-medium truncate">
                {userGroups[uid][0].user_email || uid.slice(0, 12) + '...'}
              </span>
            </div>
            <span className="text-[10px] tabular-nums bg-secondary px-1.5 py-0.5 rounded-md border border-border">
              {userGroups[uid].length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
