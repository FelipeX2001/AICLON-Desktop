
import React, { useState, useEffect } from 'react';
import { ActiveClient, Lead, LEAD_STAGES } from '../types';
import ActiveClientModal from './ActiveClientModal';
import DroppedClientsView from './DroppedClientsView';
import { Plus, Users, TrendingUp, AlertCircle, Search, Building2, Briefcase, MapPin, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

const ClientsDashboard: React.FC = () => {
  // --- ACTIVE CLIENTS STATE (Unified Source) ---
  const [activeClients, setActiveClients] = useState<ActiveClient[]>(() => {
    try {
        const saved = localStorage.getItem('aiclon_active_clients');
        return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });

  // --- LEADS STATE (Read-only for summary) ---
  const [leads, setLeads] = useState<Lead[]>(() => {
     try {
        const saved = localStorage.getItem('aiclon_leads');
        return saved ? JSON.parse(saved) : [];
     } catch(e) { return []; }
  });

  // --- VIEW STATE ---
  const [showDroppedClients, setShowDroppedClients] = useState(false);

  // --- MODAL STATE ---
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToView, setClientToView] = useState<ActiveClient | null>(null);

  // --- KPI CALCULATIONS ---
  const totalActiveClients = activeClients.filter(c => c.estado_servicio === 'En servicio' || c.estado_servicio === 'Desarrollos extra').length;
  
  // Ingresos Mensuales: Sum of valor_mensual_servicio
  const totalMonthlyIncome = activeClients.reduce((acc, client) => {
     // Remove non-numeric chars except dot
     const valStr = client.valor_mensual_servicio?.toString().replace(/[^0-9.]/g, '') || '0';
     const val = parseFloat(valStr);
     return acc + (isNaN(val) ? 0 : val);
  }, 0);
  
  const totalActiveLeads = leads.filter(l => l.etapa !== 'Lead Cerrado').length;
  
  // Cierre Próximo
  const leadsClosingSoon = leads.filter(l => {
      const stageIndex = LEAD_STAGES.indexOf(l.etapa);
      const capIndex = LEAD_STAGES.indexOf('Reunión de Capacitación');
      const closedIndex = LEAD_STAGES.indexOf('Lead Cerrado');
      return stageIndex >= capIndex && stageIndex < closedIndex;
  }).length;

  const handleOpenClient = (client: ActiveClient) => {
      setClientToView(client);
      setIsClientModalOpen(true);
  };

  // Function to refresh data after changes (passed to modals/components if needed, or rely on re-mount/localstorage events)
  const refreshData = () => {
      const savedActive = localStorage.getItem('aiclon_active_clients');
      if (savedActive) setActiveClients(JSON.parse(savedActive));
      
      const savedLeads = localStorage.getItem('aiclon_leads');
      if (savedLeads) setLeads(JSON.parse(savedLeads));
  };

  // Watch for local storage changes (optional simple mechanism)
  useEffect(() => {
      // This effect only runs on mount/update, real-time across components needs custom event or context. 
      // For simplicity, we assume navigation or modal close triggers re-renders or we poll.
      const interval = setInterval(refreshData, 2000); // Simple polling for data sync
      return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col pb-2 relative">
      
      {/* Main Content (Flex Grow to fill space) */}
      <div className={`flex-1 flex flex-col md:flex-row gap-6 transition-all duration-500 min-h-0 ${showDroppedClients ? 'opacity-20 pointer-events-none scale-95 origin-top' : 'opacity-100'}`}>
          {/* --- LEFT COLUMN: CLIENTES ACTUALES --- */}
          <div className="flex-1 flex flex-col space-y-6 min-w-0 h-full">
             <div className="flex justify-between items-center flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-designer text-mist">Clientes Actuales</h2>
                  <p className="text-mist-muted text-xs mt-1">Resumen de activos y facturación.</p>
                </div>
             </div>

             {/* KPIs */}
             <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                <div className="bg-surface-low border border-border-subtle rounded-xl p-4 flex flex-col">
                   <div className="flex items-center text-neon mb-2">
                      <Users size={18} className="mr-2" />
                      <span className="text-xs font-bold uppercase">Total Activos</span>
                   </div>
                   <span className="text-3xl font-designer text-mist">{totalActiveClients}</span>
                </div>
                <div className="bg-surface-low border border-border-subtle rounded-xl p-4 flex flex-col">
                   <div className="flex items-center text-neon-blue mb-2">
                      <DollarSign size={18} className="mr-2" />
                      <span className="text-xs font-bold uppercase">Ingresos Mensuales</span>
                   </div>
                   <span className="text-2xl font-designer text-mist">${totalMonthlyIncome.toLocaleString()}</span>
                </div>
             </div>

             {/* List */}
             <div className="flex-1 bg-surface-low border border-border-subtle rounded-xl overflow-hidden flex flex-col min-h-[200px]">
                <div className="p-4 border-b border-border-subtle bg-surface-med/50">
                   <h3 className="text-sm font-bold text-mist uppercase">Listado Reciente</h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                   {activeClients.length === 0 ? (
                      <div className="h-32 flex items-center justify-center text-mist-faint text-sm italic">
                         No hay clientes activos registrados.
                      </div>
                   ) : (
                      <div className="divide-y divide-border-subtle">
                         {activeClients.map(client => (
                            <div key={client.activeId} onClick={() => handleOpenClient(client)} className="p-4 hover:bg-surface-med transition-colors cursor-pointer group">
                               <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-mist group-hover:text-neon">{client.nombre_empresa}</h4>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                     client.estado_servicio === 'En servicio' ? 'bg-neon/10 text-neon' : 
                                     client.estado_servicio === 'Pendiente de pago' ? 'bg-neon-orange/10 text-neon-orange' : 'bg-blue-500/10 text-blue-500'
                                  }`}>
                                     {client.estado_servicio}
                                  </span>
                               </div>
                               <div className="flex items-center text-xs text-mist-muted space-x-3">
                                  <span className="flex items-center"><Briefcase size={10} className="mr-1"/> {client.sector}</span>
                                  <span className="flex items-center"><MapPin size={10} className="mr-1"/> {client.ciudad}</span>
                                  <span className="flex items-center text-neon-blue font-mono"><DollarSign size={10} className="mr-1"/> {client.valor_mensual_servicio}</span>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* --- RIGHT COLUMN: LEADS SUMMARY --- */}
          <div className="flex-1 flex flex-col space-y-6 min-w-0 border-l border-border-subtle pl-0 md:pl-6 h-full">
             <div className="flex justify-between items-center flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-designer text-mist">Clientes en Proceso</h2>
                  <p className="text-mist-muted text-xs mt-1">Pipeline comercial y leads activos.</p>
                </div>
             </div>

              {/* KPIs */}
             <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                <div className="bg-surface-low border border-border-subtle rounded-xl p-4 flex flex-col">
                   <div className="flex items-center text-neon-orange mb-2">
                      <TrendingUp size={18} className="mr-2" />
                      <span className="text-xs font-bold uppercase">Leads Activos</span>
                   </div>
                   <span className="text-3xl font-designer text-mist">{totalActiveLeads}</span>
                </div>
                <div className="bg-surface-low border border-border-subtle rounded-xl p-4 flex flex-col">
                   <div className="flex items-center text-neon mb-2">
                      <AlertCircle size={18} className="mr-2" />
                      <span className="text-xs font-bold uppercase">Cierre Próximo</span>
                   </div>
                   <span className="text-3xl font-designer text-mist">{leadsClosingSoon}</span>
                </div>
             </div>

             {/* Pipeline Summary List */}
             <div className="flex-1 bg-surface-low border border-border-subtle rounded-xl overflow-hidden flex flex-col min-h-[200px]">
                <div className="p-4 border-b border-border-subtle bg-surface-med/50 flex justify-between items-center">
                   <h3 className="text-sm font-bold text-mist uppercase">Pipeline Actual</h3>
                   <span className="text-[10px] text-mist-muted italic">Solo leads activos</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="divide-y divide-border-subtle">
                       {leads.filter(l => l.etapa !== 'Lead Cerrado').map(lead => (
                          <div key={lead.id} className="p-4 hover:bg-surface-med transition-colors flex items-center justify-between">
                             <div className="min-w-0 flex-1 mr-4">
                                <h4 className="font-bold text-mist text-sm truncate">{lead.nombre_empresa || lead.nombre_contacto}</h4>
                                <p className="text-xs text-mist-muted">{lead.etapa}</p>
                             </div>
                             <div className="w-24 h-1.5 bg-night rounded-full overflow-hidden border border-white/5">
                                <div 
                                  className="h-full bg-neon" 
                                  style={{ width: `${Math.round((Object.values(lead.hitos).filter(Boolean).length / 7) * 100)}%` }}
                                />
                             </div>
                          </div>
                       ))}
                       {leads.filter(l => l.etapa !== 'Lead Cerrado').length === 0 && (
                          <div className="h-32 flex items-center justify-center text-mist-faint text-sm italic">
                             No hay leads activos en este momento.
                          </div>
                       )}
                    </div>
                </div>
             </div>
          </div>
      </div>

      {/* --- DROPPED CLIENTS TOGGLE (FOOTER) --- */}
      <div className="relative mt-auto pt-8">
          <div className="absolute inset-0 flex items-center top-8" aria-hidden="true">
            <div className="w-full border-t border-border-subtle"></div>
          </div>
          <div className="relative flex justify-center">
            <button 
                onClick={() => setShowDroppedClients(!showDroppedClients)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border-subtle rounded-full shadow-sm text-sm font-medium text-mist bg-night hover:bg-surface-med hover:text-neon hover:border-neon transition-all"
            >
                {showDroppedClients ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span className="uppercase text-xs font-bold tracking-wide">
                    {showDroppedClients ? 'Ocultar Bajas' : 'Bajas'}
                </span>
            </button>
          </div>
      </div>

      {/* --- DROPPED CLIENTS VIEW --- */}
      {showDroppedClients && (
          <div className="mt-4 animate-in slide-in-from-bottom-4 duration-300">
              <DroppedClientsView />
          </div>
      )}

      <ActiveClientModal 
         isOpen={isClientModalOpen}
         onClose={() => setIsClientModalOpen(false)}
         clientToEdit={clientToView}
         onSave={(updated) => {
             setActiveClients(prev => prev.map(c => c.activeId === updated.activeId ? updated : c));
             setIsClientModalOpen(false);
         }}
         onDelete={(id) => {
             setActiveClients(prev => prev.filter(c => c.activeId !== id));
             setIsClientModalOpen(false);
         }}
         onDrop={(dropped) => {
             // Remove from active list immediately
             setActiveClients(prev => prev.filter(c => c.activeId !== dropped.originalId));
             setIsClientModalOpen(false);
         }}
      />
    </div>
  );
};

export default ClientsDashboard;
