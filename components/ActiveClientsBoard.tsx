
import React, { useState, useRef } from 'react';
import { ActiveClient, ACTIVE_CLIENT_STAGES, ActiveClientStage, DroppedClient, User, Lead } from '../types';
import ActiveClientModal from './ActiveClientModal';
import ActiveClientViewModal from './ActiveClientViewModal';
import { GripVertical, Building2, Clock, CheckSquare, User as UserIcon } from 'lucide-react';

interface ActiveClientsBoardProps {
  user?: User;
  users?: User[];
  activeClients: ActiveClient[];
  leads: Lead[];
  droppedClients: DroppedClient[];
  onSaveActiveClient: (client: ActiveClient) => void;
  onDeleteActiveClient: (clientId: string) => void;
  onSaveDroppedClient: (dropped: DroppedClient) => void;
}

const ActiveClientsBoard: React.FC<ActiveClientsBoardProps> = ({ 
  user, 
  users, 
  activeClients,
  leads,
  droppedClients,
  onSaveActiveClient, 
  onDeleteActiveClient,
  onSaveDroppedClient
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<ActiveClient | null>(null);
  const [clientToView, setClientToView] = useState<ActiveClient | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingScroll = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const togglePayment = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const client = activeClients.find(c => c.activeId === id);
    if (client) {
      onSaveActiveClient({ ...client, pago_mes_actual: !client.pago_mes_actual });
    }
  };

  const handleSaveClient = (updatedClient: ActiveClient) => {
    onSaveActiveClient(updatedClient);
    setIsModalOpen(false);
    setClientToEdit(null);
  };

  const handleDeleteClient = (clientId: string) => {
    onDeleteActiveClient(clientId);
    setIsModalOpen(false);
    setClientToEdit(null);
  };

  const handleDropClient = (dropped: DroppedClient) => {
    onSaveDroppedClient(dropped);
    onDeleteActiveClient(dropped.originalId);
    setIsModalOpen(false);
    setClientToEdit(null);
  };

  const openViewModal = (client: ActiveClient) => {
    setClientToView(client);
    setIsViewModalOpen(true);
  };

  const openEditModal = (client: ActiveClient) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleEditFromView = () => {
    if (clientToView) {
      setClientToEdit(clientToView);
      setIsViewModalOpen(false);
      setIsModalOpen(true);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('activeClientId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: ActiveClientStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('activeClientId');
    const client = activeClients.find(c => c.activeId === id);
    
    if (client && client.estado_servicio !== stage) {
      onSaveActiveClient({ ...client, estado_servicio: stage });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.client-card')) return;
    isDraggingScroll.current = true;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grabbing';
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeftPos.current = scrollContainerRef.current.scrollLeft;
    }
  };
  const handleMouseLeave = () => {
    isDraggingScroll.current = false;
    if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = 'grab';
  };
  const handleMouseUp = () => {
    isDraggingScroll.current = false;
    if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = 'grab';
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingScroll.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; 
    scrollContainerRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const validClients = activeClients.filter(c => !c.isDeleted);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="h-full flex flex-col">
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex h-full space-x-4 px-1 md:min-w-0 min-w-max">
          {ACTIVE_CLIENT_STAGES.map((stage) => {
            const stageClients = validClients.filter(c => c.estado_servicio === stage);
            
            return (
              <div 
                key={stage}
                className="w-80 md:w-auto md:flex-1 md:min-w-[280px] flex flex-col bg-surface-low/50 border border-border-subtle rounded-xl overflow-hidden"
                onDragOver={isAdmin ? handleDragOver : undefined}
                onDrop={isAdmin ? (e) => handleDrop(e, stage) : undefined}
              >
                <div className="p-3 bg-surface-med border-b border-border-subtle flex justify-between items-center sticky top-0 z-10">
                  <span className="font-bold text-sm text-mist uppercase tracking-wide truncate" title={stage}>
                    {stage}
                  </span>
                  <span className="bg-night border border-border-subtle text-neon text-xs font-bold px-2 py-0.5 rounded-full">
                    {stageClients.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {stageClients.map((client) => (
                    <div
                      key={client.activeId}
                      draggable={isAdmin}
                      onDragStart={isAdmin ? (e) => handleDragStart(e, client.activeId) : undefined}
                      onClick={() => openViewModal(client)}
                      className="client-card bg-night border border-border-subtle rounded-lg hover:border-neon/50 hover:shadow-card-glow transition-all group relative flex flex-col overflow-hidden cursor-pointer min-h-[200px]"
                    >
                      {/* Full background image */}
                      {client.coverUrl && (
                        <div className="absolute inset-0">
                          <img src={client.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {isAdmin && (
                        <div className="absolute top-2 right-2 text-white/50 group-hover:text-white cursor-grab z-20 drop-shadow-lg">
                          <GripVertical size={14} />
                        </div>
                      )}

                      {/* Glassmorphism content overlay */}
                      <div className={`relative z-10 flex-1 flex flex-col p-4 ${client.coverUrl ? 'bg-night/70 backdrop-blur-md' : ''}`}>
                        <h4 className="font-montserrat font-bold text-mist text-lg pr-6 mb-1 truncate drop-shadow-sm">
                          {client.nombre_empresa || 'Cliente Sin Nombre'}
                        </h4>
                        <p className="text-[10px] uppercase font-bold text-neon-blue mb-3 drop-shadow-sm">
                          {client.sector || 'Sector N/A'}
                        </p>

                        <div className="space-y-2 mb-3 text-xs">
                          <div className="flex items-center text-mist/90">
                            <UserIcon size={12} className="mr-2" />
                            <span className="truncate">{client.nombre_contacto || 'Sin encargado'}</span>
                          </div>
                          <div className="flex items-center text-mist/90">
                            <Building2 size={12} className="mr-2" />
                            <span className="truncate">
                              {Array.isArray(client.servicio_interes) 
                                ? (client.servicio_interes.length > 0 ? client.servicio_interes.join(', ') : 'Servicio N/A')
                                : (client.servicio_interes || 'Servicio N/A')}
                            </span>
                          </div>
                          <div className="flex items-center text-mist/90">
                            <Clock size={12} className="mr-2 text-neon-orange" />
                            <span>Corte: <span className="text-mist font-mono">{client.fecha_corte}</span></span>
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between bg-night/60 backdrop-blur-sm rounded p-2 border border-white/10">
                          <div className="text-neon font-bold text-sm drop-shadow-sm">
                            ${client.valor_mensual_servicio}
                          </div>
                          {isAdmin ? (
                            <button 
                              onClick={(e) => togglePayment(e, client.activeId)}
                              className={`flex items-center space-x-2 px-2 py-1 rounded border transition-colors ${
                                client.pago_mes_actual 
                                ? 'bg-neon/20 border-neon text-neon' 
                                : 'bg-night/50 border-white/20 text-mist/80 hover:bg-white/10'
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
                                client.pago_mes_actual ? 'border-neon bg-neon text-night' : 'border-white/30'
                              }`}>
                                {client.pago_mes_actual && <CheckSquare size={10} strokeWidth={4} />}
                              </div>
                              <span className="text-[10px] font-bold uppercase">Pago Mes</span>
                            </button>
                          ) : (
                            <div className={`flex items-center space-x-2 px-2 py-1 rounded border ${
                              client.pago_mes_actual 
                              ? 'bg-neon/20 border-neon text-neon' 
                              : 'bg-night/50 border-white/20 text-mist/80'
                            }`}>
                              <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
                                client.pago_mes_actual ? 'border-neon bg-neon text-night' : 'border-white/30'
                              }`}>
                                {client.pago_mes_actual && <CheckSquare size={10} strokeWidth={4} />}
                              </div>
                              <span className="text-[10px] font-bold uppercase">Pago Mes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {stageClients.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-border-subtle rounded-lg flex items-center justify-center text-xs text-mist-faint bg-night/30 italic">
                      Arrastra clientes aquí
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {clientToView && (
        <ActiveClientViewModal
          isOpen={isViewModalOpen}
          onClose={() => { setIsViewModalOpen(false); setClientToView(null); }}
          client={clientToView}
          users={users || []}
          currentUser={user}
          onEdit={handleEditFromView}
        />
      )}

      <ActiveClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientToEdit={clientToEdit}
        onSave={handleSaveClient}
        onDelete={handleDeleteClient}
        onDrop={handleDropClient}
        isAdmin={user?.role === 'admin'}
      />
    </div>
  );
};

export default ActiveClientsBoard;
