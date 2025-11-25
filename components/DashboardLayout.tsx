
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, CheckSquare, Users, Bot, BookOpen, ChevronDown, Bell, Menu, LogOut, 
  Sun, Moon, User as UserIcon, ChevronLeft, ChevronRight, Building2, Calendar, X
} from 'lucide-react';
import { User, SidebarItem, Notification } from '../types';
import AiclonLogo from './Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentTheme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigate: (view: any) => void;
  currentView: string;
  onEditProfile: () => void;
  notifications?: Notification[];
  onMarkNotificationRead?: (id: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  currentTheme, 
  onToggleTheme,
  onNavigate,
  currentView,
  onEditProfile,
  notifications = [],
  onMarkNotificationRead
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Apply theme class to body
  useEffect(() => {
      if (currentTheme === 'light') {
          document.body.classList.add('light-theme');
      } else {
          document.body.classList.remove('light-theme');
      }
  }, [currentTheme]);

  const menuItems: SidebarItem[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'Tareas', label: 'Tareas', icon: <CheckSquare size={20} /> },
    { id: 'Reuniones', label: 'Reuniones', icon: <Calendar size={20} /> },
    { id: 'Clientes', label: 'Clientes', icon: <Building2 size={20} />, subItems: ['Todos', 'Actuales', 'En proceso'] },
    { id: 'Equipo', label: 'Equipo', icon: <Users size={20} /> },
    { id: 'Bot versions', label: 'Bot versions', icon: <Bot size={20} /> },
    { id: 'Tutoriales', label: 'Tutoriales', icon: <BookOpen size={20} /> },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleMenuClick = (item: SidebarItem) => {
    if (item.subItems) {
        if (isCollapsed) {
            setIsCollapsed(false);
            setExpandedMenu(item.id);
        } else {
            setExpandedMenu(expandedMenu === item.id ? null : item.id);
        }
        return; 
    }
    if (item.id === 'Dashboard') onNavigate('dashboard');
    if (item.id === 'Equipo') onNavigate('team');
    if (item.id === 'Tareas') onNavigate('tasks');
    if (item.id === 'Reuniones') onNavigate('meetings');
    if (item.id === 'Bot versions') onNavigate('bot-versions');
    if (item.id === 'Tutoriales') onNavigate('tutorials');
    
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const handleSubMenuClick = (parentItem: string, subItem: string) => {
    if (parentItem === 'Clientes') {
        if (subItem === 'En proceso') onNavigate('clients-process');
        if (subItem === 'Todos') onNavigate('clients-general');
        if (subItem === 'Actuales') onNavigate('clients-active'); 
    }
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-night">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-50 h-full bg-night border-r border-border-subtle transition-all duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-6'} h-20 border-b border-border-subtle cursor-pointer hover:bg-surface-low transition-colors`} onClick={() => onNavigate('dashboard')} title="Ir al Dashboard">
          <AiclonLogo className="w-8 h-8 text-neon" />
          {!isCollapsed && <span className="text-3xl font-designer text-mist pt-1 animate-in fade-in duration-200">AICLON</span>}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            let isActive = false;
            if (currentView === 'dashboard' && item.id === 'Dashboard') isActive = true;
            if (currentView === 'team' && item.id === 'Equipo') isActive = true;
            if (currentView === 'tasks' && item.id === 'Tareas') isActive = true;
            if (currentView === 'meetings' && item.id === 'Reuniones') isActive = true;
            if (currentView === 'bot-versions' && item.id === 'Bot versions') isActive = true;
            if (currentView === 'tutorials' && item.id === 'Tutoriales') isActive = true;
            if ((currentView.startsWith('clients')) && item.id === 'Clientes') isActive = true;

            return (
              <div key={item.id}>
                <button onClick={() => handleMenuClick(item)} className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-3'} py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isActive ? 'bg-surface-med text-neon border border-neon/30 shadow-[0_0_15px_rgba(0,200,255,0.1)]' : 'text-mist-muted hover:bg-surface-low hover:text-mist'}`} title={isCollapsed ? item.label : ''}>
                  <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                    <span className={isActive ? 'text-neon drop-shadow-[0_0_5px_rgba(0,200,255,0.8)]' : 'group-hover:text-neon transition-colors'}>{item.icon}</span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && item.subItems && <div className="p-1"><ChevronDown size={16} className={`transition-transform duration-200 ${expandedMenu === item.id ? 'rotate-180' : ''}`} /></div>}
                </button>
                {!isCollapsed && expandedMenu === item.id && item.subItems && (
                  <div className="mt-1 ml-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.subItems.map((subItem) => (
                        <button key={subItem} onClick={() => handleSubMenuClick(item.id, subItem)} className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors text-mist-muted hover:text-neon`}>{subItem}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border-subtle relative">
           <button onClick={toggleCollapse} className="hidden lg:flex absolute -top-3 -right-3 w-6 h-6 bg-surface-med border border-border-subtle rounded-full items-center justify-center text-mist hover:text-neon hover:border-neon transition-colors shadow-lg z-10">
             {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
           </button>
           <div className="p-4">
             <button onClick={onLogout} className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-3'} py-2 w-full text-mist-muted hover:text-neon-orange transition-colors rounded-lg group`} title={isCollapsed ? "Cerrar Sesión" : ""}>
               <LogOut size={18} className="group-hover:text-neon-orange transition-colors" />
               {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
             </button>
           </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-night/80 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="p-2 rounded-lg text-mist hover:bg-surface-low lg:hidden"><Menu size={24} /></button>
            <h2 className="hidden md:block text-4xl font-designer text-mist pt-1 uppercase">{currentView.replace(/-/g, ' ')}</h2>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            <button onClick={onToggleTheme} className="p-2 text-mist-muted hover:text-neon transition-colors rounded-lg hover:bg-surface-low">
              {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Notifications */}
            <div className="relative">
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 text-mist-muted hover:text-neon transition-colors">
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-orange rounded-full shadow-[0_0_8px_#F06000]"></span>}
                </button>
                {isNotifOpen && (
                    <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-night border border-border-subtle rounded-xl shadow-depth z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 border-b border-border-subtle flex justify-between items-center">
                            <h4 className="text-xs font-bold uppercase text-mist">Notificaciones</h4>
                            {unreadCount > 0 && <span className="text-[10px] text-neon-orange">{unreadCount} nuevas</span>}
                        </div>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-xs text-mist-muted italic">No tienes notificaciones.</div>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} onClick={() => { if(onMarkNotificationRead) onMarkNotificationRead(n.id); setIsNotifOpen(false); }} className={`p-3 border-b border-border-subtle hover:bg-surface-low cursor-pointer transition-colors ${!n.read ? 'bg-surface-med/50 border-l-2 border-l-neon-orange' : ''}`}>
                                        <p className="text-sm text-mist">{n.message}</p>
                                        <p className="text-[10px] text-mist-muted mt-1">{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    </>
                )}
            </div>

            <div className="h-8 w-[1px] bg-border-subtle"></div>
            
            {/* User Menu */}
            <div className="relative">
              <div className="flex items-center space-x-3 cursor-pointer p-1 rounded-lg hover:bg-surface-low transition-colors" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-mist">{user.name}</p>
                  <p className="text-xs text-mist-muted uppercase font-bold tracking-wide">{user.role}</p>
                </div>
                <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full border border-border-subtle shadow-card-glow object-cover"/>
                <ChevronDown size={16} className={`text-mist-muted hidden sm:block transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-night border border-border-subtle rounded-xl shadow-depth z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => { setIsUserMenuOpen(false); onEditProfile(); }} className="w-full text-left px-4 py-3 text-sm text-mist hover:bg-surface-med hover:text-neon flex items-center transition-colors"><UserIcon size={16} className="mr-2" /> Editar Perfil</button>
                    <div className="h-1 w-full bg-border-subtle my-1"></div>
                    <button onClick={() => { setIsUserMenuOpen(false); onLogout(); }} className="w-full text-left px-4 py-3 text-sm text-mist hover:bg-neon-orange/10 hover:text-neon-orange flex items-center transition-colors"><LogOut size={16} className="mr-2" /> Cerrar Sesión</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
