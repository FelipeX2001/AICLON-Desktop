
import React, { useState, useEffect } from 'react';
import { ActiveClient, ACTIVE_CLIENT_STAGES, ActiveClientStage, DroppedClient } from '../types';
import { X, Save, Trash2, AlertTriangle, Building2, User, Calendar, DollarSign, CheckSquare, MapPin, Globe, MessageSquare, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface ActiveClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit: ActiveClient | null;
  onSave: (client: ActiveClient) => void;
  onDelete: (clientId: string) => void;
  onDrop?: (dropped: DroppedClient) => void;
  isAdmin?: boolean;
}

const ActiveClientModal: React.FC<ActiveClientModalProps> = ({
  isOpen,
  onClose,
  clientToEdit,
  onSave,
  onDelete,
  onDrop,
  isAdmin = false
}) => {
  const [formData, setFormData] = useState<Partial<ActiveClient>>({});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Drop (Baja) State
  const [isDropSectionOpen, setIsDropSectionOpen] = useState(false);
  const [isDroppedChecked, setIsDroppedChecked] = useState(false);
  const [dropReason, setDropReason] = useState('');
  const [dropDate, setDropDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen && clientToEdit) {
      setFormData({ ...clientToEdit });
      setIsDeleteConfirmOpen(false);
      setIsDropSectionOpen(false);
      setIsDroppedChecked(false);
      setDropReason('');
    }
  }, [isOpen, clientToEdit]);

  if (!isOpen || !clientToEdit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nombre_empresa) {
      onSave(formData as ActiveClient);
      onClose();
    }
  };

  const handleDeleteClick = () => {
      setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
      if (clientToEdit.activeId) {
          onDelete(clientToEdit.activeId);
          onClose();
      }
  };

  const handleConfirmDrop = () => {
      if (onDrop && clientToEdit && isDroppedChecked && dropReason) {
          const droppedClient: DroppedClient = {
              id: Date.now().toString(),
              originalId: clientToEdit.activeId,
              name: clientToEdit.nombre_empresa,
              type: 'active',
              reason: dropReason,
              droppedDate: dropDate,
              originalData: clientToEdit
          };
          onDrop(droppedClient);
          onClose();
      } else {
          alert("Por favor marca la casilla 'Dar de baja' y escribe un motivo.");
      }
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleteConfirmOpen) onClose();
        }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-3xl shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-xl font-designer text-mist uppercase tracking-wide">
            Detalle Cliente Activo
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <form id="active-client-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* SECTION 1: SERVICE DETAILS (Editable) */}
                <div className="bg-surface-low/50 p-5 rounded-xl border border-border-subtle">
                    <h4 className="text-neon font-bold uppercase text-sm mb-4 flex items-center">
                        <Activity size={16} className="mr-2" /> Datos del Servicio
                    </h4>
                    
                    {/* Cover Image Field */}
                    <div className="mb-6">
                        <ImageUploadField 
                            value={formData.coverUrl} 
                            onChange={(url) => setFormData(prev => ({...prev, coverUrl: url}))} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-mist-muted">Estado Servicio</label>
                            <select 
                                value={formData.estado_servicio}
                                onChange={(e) => setFormData({...formData, estado_servicio: e.target.value as ActiveClientStage})}
                                className="w-full bg-night border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                            >
                                {ACTIVE_CLIENT_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-1">
                                <DollarSign size={12}/> Valor Mensual
                            </label>
                            <input 
                                type="text" 
                                value={formData.valor_mensual_servicio || ''}
                                onChange={(e) => setFormData({...formData, valor_mensual_servicio: e.target.value})}
                                className="w-full bg-night border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-1">
                                <Calendar size={12}/> Fecha Inicio
                            </label>
                            <input 
                                type="date" 
                                value={formData.fecha_inicio_servicio || ''}
                                onChange={(e) => setFormData({...formData, fecha_inicio_servicio: e.target.value})}
                                className="w-full bg-night border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-1">
                                <Calendar size={12}/> Fecha Corte
                            </label>
                            <input 
                                type="text" 
                                value={formData.fecha_corte || ''}
                                onChange={(e) => setFormData({...formData, fecha_corte: e.target.value})}
                                className="w-full bg-night border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                                placeholder="Ej. Dia 5"
                            />
                        </div>
                        
                        <div className="md:col-span-2 pt-2">
                            <label className="flex items-center space-x-3 cursor-pointer p-3 rounded bg-surface-med/50 hover:bg-surface-med border border-border-subtle transition-colors w-fit">
                                <input 
                                    type="checkbox" 
                                    checked={formData.pago_mes_actual || false}
                                    onChange={(e) => setFormData({...formData, pago_mes_actual: e.target.checked})}
                                    className="w-5 h-5 rounded border-border-subtle bg-night checked:bg-neon checked:border-neon text-neon focus:ring-neon"
                                />
                                <span className={`text-sm font-bold ${formData.pago_mes_actual ? 'text-neon' : 'text-mist-muted'}`}>
                                    Pago del Mes Recibido
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: LEAD HISTORY (Read Only / Reference) */}
                <div className="space-y-6 opacity-90">
                    <h4 className="text-mist font-bold uppercase text-sm mb-2 border-b border-border-subtle pb-2 flex items-center">
                        <Building2 size={16} className="mr-2" /> Información de Lead (Historial)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div><label className="block text-[10px] text-mist-muted uppercase">Empresa</label><p className="text-mist font-medium">{formData.nombre_empresa}</p></div>
                            <div><label className="block text-[10px] text-mist-muted uppercase">Contacto</label><p className="text-mist">{formData.nombre_contacto}</p></div>
                            <div><label className="block text-[10px] text-mist-muted uppercase">Email</label><p className="text-mist text-sm">{formData.email}</p></div>
                            <div><label className="block text-[10px] text-mist-muted uppercase">Teléfono</label><p className="text-mist text-sm">{formData.telefono}</p></div>
                        </div>
                        <div className="space-y-3">
                            <div><label className="block text-[10px] text-mist-muted uppercase">Sector</label><p className="text-mist">{formData.sector}</p></div>
                            <div><label className="block text-[10px] text-mist-muted uppercase">Ciudad</label><p className="text-mist">{formData.ciudad}</p></div>
                            <div><label className="block text-[10px] text-mist-muted uppercase">Origen</label><p className="text-mist">{formData.fuente_origen}</p></div>
                            <div><label className="block text-[10px] text-mist-muted uppercase">Servicio Interés</label><p className="text-mist text-neon-blue">{formData.servicio_interes}</p></div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] text-mist-muted uppercase mb-1">Necesidad Original</label>
                        <div className="bg-night p-3 rounded border border-border-subtle text-sm text-mist italic">
                            "{formData.necesidad}"
                        </div>
                    </div>
                </div>

                {/* --- DAR DE BAJA SECTION --- */}
                <div className="mt-8 pt-6 border-t border-border-subtle">
                    <button 
                        type="button"
                        onClick={() => setIsDropSectionOpen(!isDropSectionOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-surface-low/50 hover:bg-surface-low border border-border-subtle rounded-lg group transition-all"
                    >
                        <span className="text-sm font-bold uppercase text-mist-muted group-hover:text-neon-orange transition-colors flex items-center">
                            <AlertTriangle size={16} className="mr-2" /> Dada de Baja
                        </span>
                        {isDropSectionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isDropSectionOpen && (
                        <div className="mt-2 p-4 bg-surface-low/20 border border-border-subtle border-t-0 rounded-b-lg animate-in slide-in-from-top-2">
                            <div className="space-y-4">
                                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-white/5 transition-colors w-fit">
                                    <input 
                                        type="checkbox" 
                                        checked={isDroppedChecked}
                                        onChange={(e) => setIsDroppedChecked(e.target.checked)}
                                        className="w-5 h-5 rounded border-border-subtle bg-night checked:bg-neon-orange checked:border-neon-orange text-neon-orange focus:ring-neon-orange"
                                    />
                                    <span className={`text-sm font-bold ${isDroppedChecked ? 'text-neon-orange' : 'text-mist-muted'}`}>
                                        Dar de baja
                                    </span>
                                </label>

                                {isDroppedChecked && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase font-bold text-mist-muted">Motivo</label>
                                            <textarea 
                                                value={dropReason}
                                                onChange={(e) => setDropReason(e.target.value)}
                                                className="w-full bg-night border border-border-subtle rounded p-2 text-mist focus:border-neon-orange focus:outline-none min-h-[60px]"
                                                placeholder="Escribe el motivo..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase font-bold text-mist-muted">Fecha de dada de baja</label>
                                            <input 
                                                type="date" 
                                                value={dropDate}
                                                onChange={(e) => setDropDate(e.target.value)}
                                                className="w-full bg-night border border-border-subtle rounded p-2 text-mist focus:border-neon-orange focus:outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex justify-end">
                                            <button 
                                                type="button"
                                                onClick={handleConfirmDrop}
                                                className="px-4 py-2 bg-neon-orange text-white text-xs font-bold uppercase rounded hover:bg-neon-orange/90 transition-colors shadow-[0_0_10px_rgba(240,96,0,0.3)]"
                                            >
                                                Confirmar Baja
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-subtle bg-surface-low flex justify-between items-center">
            <button 
                type="button"
                onClick={handleDeleteClick}
                className="text-neon-orange hover:bg-neon-orange/10 px-4 py-2 rounded-lg border border-neon-orange/30 hover:border-neon-orange text-sm font-bold uppercase flex items-center transition-all"
            >
                <Trash2 size={16} className="mr-2" /> Eliminar Cliente
            </button>

            <div className="flex space-x-3">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-4 py-2 rounded text-sm font-medium text-mist-muted hover:text-mist transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    type="submit"
                    form="active-client-form"
                    className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 transition-all flex items-center"
                >
                    <Save size={16} className="mr-2" />
                    Guardar Cambios
                </button>
            </div>
        </div>

      </div>

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 p-6 animate-in fade-in duration-200">
           <div className="bg-night border border-neon-orange rounded-xl w-full max-w-sm shadow-[0_0_30px_rgba(240,96,0,0.3)] overflow-hidden text-center p-6">
                <div className="w-16 h-16 rounded-full bg-neon-orange/10 flex items-center justify-center mb-4 text-neon-orange mx-auto">
                    <AlertTriangle size={32} />
                </div>
                <h4 className="text-neon-orange font-bold uppercase mb-2">¿Eliminar Cliente Activo?</h4>
                <p className="text-sm text-mist-muted mb-6">
                    Esta acción eliminará al cliente <strong>{clientToEdit.nombre_empresa}</strong> de la lista de activos.
                </p>
                <div className="flex justify-center space-x-3">
                    <button 
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="px-4 py-3 rounded-lg border border-border-subtle text-mist hover:bg-white/5 text-sm w-full"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleConfirmDelete}
                        className="px-4 py-3 rounded-lg bg-neon-orange text-white text-sm font-bold hover:bg-neon-orange/90 w-full"
                    >
                        Eliminar
                    </button>
                </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ActiveClientModal;
