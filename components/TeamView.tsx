
import React, { useState } from 'react';
import { User, Task, MeetingEvent, ActiveClient, Lead } from '../types';
import { Shield, Mail, Plus } from 'lucide-react';
import UserProfileDetailModal from './UserProfileDetailModal';

interface TeamViewProps {
  users: User[];
  currentUser: User;
  onEditUser: (user: User) => void;
  tasks?: Task[];
  meetings?: MeetingEvent[];
  activeClients?: ActiveClient[];
  leads?: Lead[];
}

const TeamView: React.FC<TeamViewProps> = ({ 
  users, 
  currentUser, 
  onEditUser,
  tasks = [],
  meetings = [],
  activeClients = [],
  leads = []
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreateUser = () => {
      // Pass a skeleton user to trigger "Create Mode" in the parent modal
      onEditUser({} as User);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-end border-b border-border-subtle pb-4">
        <div className="flex items-center space-x-4">
            {currentUser.role === 'admin' && (
                <button 
                    onClick={handleCreateUser}
                    className="px-4 py-2 bg-gradient-primary rounded-lg text-mist font-bold text-xs shadow-neon-glow hover:brightness-110 flex items-center"
                >
                    <Plus size={14} className="mr-2"/> Agregar Miembro
                </button>
            )}
            <div className="px-3 py-1 rounded bg-surface-med border border-border-subtle text-xs text-mist-muted">
                Total: <span className="text-neon font-bold">{users.length}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => {
          const isMe = user.id === currentUser.id;

          return (
            <div 
              key={user.id} 
              onClick={() => setSelectedUser(user)}
              className="relative group bg-surface-low border border-border-subtle rounded-2xl p-8 hover:bg-surface-med hover:border-neon/30 transition-all duration-300 shadow-lg hover:shadow-neon-glow/20 cursor-pointer flex flex-col items-center text-center"
            >
              {/* Role Badge */}
              <div className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                user.role === 'admin' 
                  ? 'bg-neon-orange/10 border-neon-orange/30 text-neon-orange' 
                  : 'bg-neon/10 border-neon/30 text-neon'
              }`}>
                {user.role}
              </div>

              <div className="relative mb-6">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-40 h-40 rounded-full object-cover border-4 border-surface-low shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-neon/50 group-hover:scale-105 transition-all duration-500"
                />
                {user.role === 'admin' && (
                  <div className="absolute bottom-1 right-1 bg-night rounded-full p-2 border border-border-subtle shadow-sm">
                    <Shield size={16} className="text-neon-orange fill-neon-orange/20" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-mist group-hover:text-white transition-colors mb-1">
                {user.name} {isMe && <span className="text-mist-muted text-xs font-normal ml-1">(Tú)</span>}
              </h3>
              
              <div className="flex items-center text-mist-muted text-sm">
                <Mail size={12} className="mr-1.5" />
                {user.email}
              </div>
            </div>
          );
        })}
      </div>

      {selectedUser && (
        <UserProfileDetailModal 
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          currentUser={currentUser}
          onEditProfile={(u) => {
              setSelectedUser(null);
              onEditUser(u);
          }}
          tasks={tasks}
          meetings={meetings}
          activeClients={activeClients}
          leads={leads}
        />
      )}
    </div>
  );
};

export default TeamView;
