
import React, { useState, useMemo } from 'react';
import { ActiveClient, Lead, DroppedClient, LEAD_STAGES, User } from '../types';
import ActiveClientViewModal from './ActiveClientViewModal';
import ActiveClientModal from './ActiveClientModal';
import LeadViewModal from './LeadViewModal';
import LeadModal from './LeadModal';
import DroppedClientsView from './DroppedClientsView';
import { Users, TrendingUp, AlertCircle, Briefcase, MapPin, DollarSign, ChevronDown, ChevronUp, Search, X } from 'lucide-react';

interface ClientsDashboardProps {
  users: User[];
  currentUser?: User;
  activeClients: ActiveClient[];
  leads: Lead[];
  droppedClients: DroppedClient[];
  onSaveActiveClient: (client: ActiveClient) => void;
  onDeleteActiveClient: (id: string) => void;
  onSaveLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onSaveDroppedClient: (client: DroppedClient) => void;
  onDeleteDroppedClient: (id: string) => void;
  onRecoverClient: (client: DroppedClient) => void;
}

const ClientsDashboard: React.FC<ClientsDashboardProps> = ({
  users,
  currentUser,
  activeClients,
  leads,
  droppedClients,
  onSaveActiveClient,
  onDeleteActiveClient,
  onSaveLead,
  onDeleteLead,
  onSaveDroppedClient,
  onDeleteDroppedClient,
  onRecoverClient
}) => {
  const isAdmin = currentUser?.role === 'admin';
  const [showDroppedClients, setShowDroppedClients] = useState(false);

  const [clientToView, setClientToView] = useState<ActiveClient | null>(null);
  const [isClientViewModalOpen, setIsClientViewModalOpen] = useState(false);
  const [isClientEditModalOpen, setIsClientEditModalOpen] = useState(false);

  const [leadToView, setLeadToView] = useState<Lead | null>(null);
  const [isLeadViewModalOpen, setIsLeadViewModalOpen] = useState(false);
  const [isLeadEditModalOpen, setIsLeadEditModalOpen] = useState(false);

  const [searchClients, setSearchClients] = useState('');
  const [searchLeads, setSearchLeads] = useState('');

  const filteredActiveClients = useMemo(() => {
    if (!searchClients.trim()) return activeClients;
    const term = searchClients.toLowerCase();
    return activeClients.filter(c => 
      c.nombre_empresa?.toLowerCase().includes(term) ||
      c.nombre_contacto?.toLowerCase().includes(term)
    );
  }, [activeClients, searchClients]);

  const filteredLeads = useMemo(() => {
    const activeLeads = leads.filter(l => l.etapa !== 'Lead Cerrado');
    if (!searchLeads.trim()) return activeLeads;
    const term = searchLeads.toLowerCase();
    return activeLeads.filter(l => 
      l.nombre_empresa?.toLowerCase().includes(term) ||
      l.nombre_contacto?.toLowerCase().includes(term)
    );
  }, [leads, searchLeads]);

  const totalActiveClients = activeClients.filter(c => c.estado_servicio === 'En servicio' || c.estado_servicio === 'Desarrollos extra').length;
  
  const totalMonthlyIncome = activeClients.reduce((acc, client) => {
     const valStr = client.valor_mensual_servicio?.toString().replace(/[^0-9.]/g, '') || '0';
     const val = parseFloat(valStr);
     return acc + (isNaN(val) ? 0 : val);
  }, 0);
  
  const totalActiveLeads = leads.filter(l => l.etapa !== 'Lead Cerrado').length;
  
  const leadsClosingSoon = leads.filter(l => {
      const stageIndex = LEAD_STAGES.indexOf(l.etapa);
      const capIndex = LEAD_STAGES.indexOf('Reunión de Capacitación');
      const closedIndex = LEAD_STAGES.indexOf('Lead Cerrado');
      return stageIndex >= capIndex && stageIndex < closedIndex;
  }).length;

  const handleOpenClient = (client: ActiveClient) => {
    setClientToView(client);
    setIsClientViewModalOpen(true);
  };

  const handleEditClient = () => {
    setIsClientViewModalOpen(false);
    setIsClientEditModalOpen(true);
  };

  const handleOpenLead = (lead: Lead) => {
    setLeadToView(lead);
    setIsLeadViewModalOpen(true);
  };

  const handleEditLead = () => {
    setIsLeadViewModalOpen(false);
    setIsLeadEditModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col pb-2 relative">
      
      <div className={`flex-1 flex flex-col md:flex-row gap-6 transition-all duration-500 min-h-0 ${showDroppedClients ? 'opacity-20 pointer-events-none scale-95 origin-top' : 'opacity-100'}`}>
          <div className="flex-1 flex flex-col space-y-6 min-w-0 h-full">
             <div className="flex justify-between items-center flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-designer text-mist">Clientes Actuales</h2>
                  <p className="text-mist-muted text-xs mt-1">Resumen de activos y facturación.</p>
                </div>
             </div>

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

             <div className="flex-1 bg-surface-low border border-border-subtle rounded-xl overflow-hidden flex flex-col min-h-[200px]">
                <div className="p-4 border-b border-border-subtle bg-surface-med/50 space-y-3">
                   <h3 className="text-sm font-bold text-mist uppercase">Listado Reciente</h3>
                   <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-muted" />
                     <input
                       type="text"
                       value={searchClients}
                       onChange={(e) => setSearchClients(e.target.value)}
                       placeholder="Buscar por nombre..."
                       className="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-night border border-border-subtle focus:border-neon focus:outline-none text-mist placeholder-mist-faint"
                     />
                     {searchClients && (
                       <button
                         onClick={() => setSearchClients('')}
                         className="absolute right-2 top-1/2 -translate-y-1/2 text-mist-muted hover:text-mist"
                       >
                         <X size={14} />
                       </button>
                     )}
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                   {filteredActiveClients.length === 0 ? (
                      <div className="h-32 flex items-center justify-center text-mist-faint text-sm italic">
                         {searchClients ? 'No se encontraron clientes.' : 'No hay clientes activos registrados.'}
                      </div>
                   ) : (
                      <div className="divide-y divide-border-subtle">
                         {filteredActiveClients.map(client => (
                            <div key={client.activeId} onClick={() => handleOpenClient(client)} className="p-4 hover:bg-surface-med transition-colors cursor-pointer group">
                               <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-mist group-hover:text-neon">{client.nombre_empresa}</h4>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                     client.estado_servicio === 'En servicio' ? 'bg-neon/10 text-neon' : 
                                     client.estado_servicio === 'Pendiente de factura' ? 'bg-neon-orange/10 text-neon-orange' : 'bg-blue-500/10 text-blue-500'
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

          <div className="flex-1 flex flex-col space-y-6 min-w-0 border-l border-border-subtle pl-0 md:pl-6 h-full">
             <div className="flex justify-between items-center flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-designer text-mist">Clientes en Proceso</h2>
                  <p className="text-mist-muted text-xs mt-1">Pipeline comercial y leads activos.</p>
                </div>
             </div>

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

             <div className="flex-1 bg-surface-low border border-border-subtle rounded-xl overflow-hidden flex flex-col min-h-[200px]">
                <div className="p-4 border-b border-border-subtle bg-surface-med/50 space-y-3">
                   <div className="flex justify-between items-center">
                     <h3 className="text-sm font-bold text-mist uppercase">Pipeline Actual</h3>
                     <span className="text-[10px] text-mist-muted italic">Solo leads activos</span>
                   </div>
                   <div className="relative">
                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-muted" />
                     <input
                       type="text"
                       value={searchLeads}
                       onChange={(e) => setSearchLeads(e.target.value)}
                       placeholder="Buscar por nombre..."
                       className="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-night border border-border-subtle focus:border-neon focus:outline-none text-mist placeholder-mist-faint"
                     />
                     {searchLeads && (
                       <button
                         onClick={() => setSearchLeads('')}
                         className="absolute right-2 top-1/2 -translate-y-1/2 text-mist-muted hover:text-mist"
                       >
                         <X size={14} />
                       </button>
                     )}
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="divide-y divide-border-subtle">
                       {filteredLeads.map(lead => (
                          <div key={lead.id} onClick={() => handleOpenLead(lead)} className="p-4 hover:bg-surface-med transition-colors cursor-pointer flex items-center justify-between">
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
                       {filteredLeads.length === 0 && (
                          <div className="h-32 flex items-center justify-center text-mist-faint text-sm italic">
                             {searchLeads ? 'No se encontraron leads.' : 'No hay leads activos en este momento.'}
                          </div>
                       )}
                    </div>
                </div>
             </div>
          </div>
      </div>

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

      {showDroppedClients && (
          <div className="mt-4 animate-in slide-in-from-bottom-4 duration-300">
              <DroppedClientsView 
                droppedClients={droppedClients}
                currentUser={currentUser}
                onRecover={onRecoverClient}
                onDelete={onDeleteDroppedClient}
              />
          </div>
      )}

      {clientToView && (
        <ActiveClientViewModal
          isOpen={isClientViewModalOpen}
          onClose={() => { setIsClientViewModalOpen(false); setClientToView(null); }}
          client={clientToView}
          users={users}
          currentUser={currentUser}
          onEdit={handleEditClient}
        />
      )}

      {clientToView && (
        <ActiveClientModal 
          isOpen={isClientEditModalOpen}
          onClose={() => { setIsClientEditModalOpen(false); setClientToView(null); }}
          clientToEdit={clientToView}
          onSave={(updated) => {
            onSaveActiveClient(updated);
            setIsClientEditModalOpen(false);
            setClientToView(null);
          }}
          onDelete={(id) => {
            onDeleteActiveClient(id);
            setIsClientEditModalOpen(false);
            setClientToView(null);
          }}
          onDrop={(dropped) => {
            onSaveDroppedClient(dropped);
            onDeleteActiveClient(dropped.originalId);
            setIsClientEditModalOpen(false);
            setClientToView(null);
          }}
        />
      )}

      {leadToView && (
        <LeadViewModal
          isOpen={isLeadViewModalOpen}
          onClose={() => { setIsLeadViewModalOpen(false); setLeadToView(null); }}
          lead={leadToView}
          users={users}
          currentUser={currentUser}
          onEdit={handleEditLead}
        />
      )}

      {leadToView && (
        <LeadModal 
          isOpen={isLeadEditModalOpen}
          onClose={() => { setIsLeadEditModalOpen(false); setLeadToView(null); }}
          leadToEdit={leadToView}
          users={users}
          onSave={(updated) => {
            onSaveLead(updated);
            setIsLeadEditModalOpen(false);
            setLeadToView(null);
          }}
          onDelete={(id) => {
            onDeleteLead(id);
            setIsLeadEditModalOpen(false);
            setLeadToView(null);
          }}
        />
      )}
    </div>
  );
};

export default ClientsDashboard;
