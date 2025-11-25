
import React, { useState, useEffect } from 'react';
import { Lead, LeadMilestones, LEAD_STAGES, DroppedClient } from '../types';
import { X, Save, Trash2, AlertTriangle, CheckSquare, Calendar, DollarSign, User, Globe, MessageSquare, Building, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit: Lead | null;
  onSave: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onDrop?: (dropped: DroppedClient) => void;
  isAdmin?: boolean;
}

const DEFAULT_MILESTONES: LeadMilestones = {
  envio_propuesta: false,
  envio_contrato: false,
  pago_primer_50: false,
  envio_capacitaciones: false,
  envio_accesos: false,
  pago_50_final: false,
  ia_activada: false
};

const DEFAULT_LEAD: Partial<Lead> = {
  etapa: 'En Espera',
  hitos: DEFAULT_MILESTONES,
  servicio_interes: 'Agente IA'
};

interface InputFieldProps {
  label: React.ReactNode;
  value: string | number | undefined;
  onChange: (val: string) => void;
  type?: 'text' | 'number' | 'date' | 'textarea' | 'email';
  placeholder?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = 'text', placeholder, icon }) => (
  <div className="space-y-1 w-full">
    <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-1.5 min-h-[20px]">
      {icon} {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist text-sm focus:border-neon focus:outline-none min-h-[80px]"
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist text-sm focus:border-neon focus:outline-none"
        placeholder={placeholder}
      />
    )}
  </div>
);

const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  leadToEdit,
  onSave,
  onDelete,
  onDrop,
  isAdmin = false
}) => {
  const [formData, setFormData] = useState<Partial<Lead>>(DEFAULT_LEAD);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [showSecondaryEmail, setShowSecondaryEmail] = useState(false);
  
  // Drop (Baja) State
  const [isDropSectionOpen, setIsDropSectionOpen] = useState(false);
  const [isDroppedChecked, setIsDroppedChecked] = useState(false);
  const [dropReason, setDropReason] = useState('');
  const [dropDate, setDropDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen) {
      if (leadToEdit) {
        setFormData({ ...leadToEdit });
        if (leadToEdit.email_secundario) {
          setShowSecondaryEmail(true);
        } else {
          setShowSecondaryEmail(false);
        }
      } else {
        setFormData({ ...DEFAULT_LEAD, id: Date.now().toString() });
        setShowSecondaryEmail(false);
      }
      setIsDeleteConfirmOpen(false);
      setIsDropSectionOpen(false);
      setIsDroppedChecked(false);
      setDropReason('');
    }
  }, [isOpen, leadToEdit]);

  if (!isOpen) return null;

  // Milestone Progress Calculation
  const milestones = formData.hitos || DEFAULT_MILESTONES;
  const totalMilestones = Object.keys(milestones).length;
  const completedMilestones = Object.values(milestones).filter(Boolean).length;
  const progressPercent = Math.round((completedMilestones / totalMilestones) * 100);

  const handleInputChange = (field: keyof Lead, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMilestoneChange = (key: keyof LeadMilestones) => {
    setFormData(prev => ({
      ...prev,
      hitos: {
        ...prev.hitos!,
        [key]: !prev.hitos![key]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nombre_empresa) {
      onSave(formData as Lead);
      onClose();
    }
  };

  const handleConfirmDrop = () => {
      if (onDrop && leadToEdit && isDroppedChecked && dropReason) {
          const droppedClient: DroppedClient = {
              id: Date.now().toString(),
              originalId: leadToEdit.id,
              name: leadToEdit.nombre_empresa || leadToEdit.nombre_contacto,
              type: 'lead',
              reason: dropReason,
              droppedDate: dropDate,
              originalData: leadToEdit
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
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-4xl shadow-depth flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low rounded-t-xl">
          <h3 className="text-xl font-designer text-mist uppercase tracking-wide">
            {leadToEdit ? `Editar Lead` : 'Crear Nuevo Lead'}
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Stage Selector (Only for Edit) */}
            {leadToEdit && (
              <div className="bg-surface-med/50 p-4 rounded-lg border border-neon/20">
                <label className="text-xs uppercase font-bold text-neon mb-2 block">Etapa Actual del Proceso</label>
                <select 
                  value={formData.etapa}
                  onChange={(e) => handleInputChange('etapa', e.target.value)}
                  className="w-full bg-night border border-border-subtle rounded p-2 text-mist focus:border-neon focus:ring-1 focus:ring-neon outline-none"
                >
                  {LEAD_STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: Contact Info */}
              <div className="space-y-4">
                <h4 className="font-designer text-lg text-mist border-b border-border-subtle pb-2 mb-4">Contacto</h4>
                
                {/* Cover Image Field */}
                <ImageUploadField 
                    value={formData.coverUrl} 
                    onChange={(url) => handleInputChange('coverUrl', url)} 
                />

                <InputField label="Empresa / Cliente" value={formData.nombre_empresa} onChange={(v) => handleInputChange('nombre_empresa', v)} icon={<Building size={14}/>} placeholder="Ej. Tech Solutions SAS" />
                <InputField label="Nombre Contacto" value={formData.nombre_contacto} onChange={(v) => handleInputChange('nombre_contacto', v)} icon={<User size={14}/>} placeholder="Ej. Juan Pérez" />
                <InputField label="Sector / Industria" value={formData.sector} onChange={(v) => handleInputChange('sector', v)} icon={<Globe size={14}/>} placeholder="Ej. Inmobiliaria" />
                <InputField label="Ciudad / Depto" value={formData.ciudad} onChange={(v) => handleInputChange('ciudad', v)} icon={<Globe size={14}/>} placeholder="Ej. Bogotá" />
                <InputField label="Teléfono" value={formData.telefono} onChange={(v) => handleInputChange('telefono', v)} icon={<MessageSquare size={14}/>} placeholder="+57 300..." />
                
                {/* Email with Toggle */}
                <InputField 
                    label={
                        <div className="flex justify-between items-center w-full">
                            <span>Email</span>
                            <button 
                                type="button" 
                                onClick={() => setShowSecondaryEmail(!showSecondaryEmail)}
                                className="text-neon hover:text-white p-0.5 rounded transition-colors"
                                title={showSecondaryEmail ? "Quitar email secundario" : "Agregar email secundario"}
                            >
                                {showSecondaryEmail ? <Minus size={12}/> : <Plus size={12}/>}
                            </button>
                        </div>
                    }
                    value={formData.email} 
                    onChange={(v) => handleInputChange('email', v)} 
                    type="email" 
                    icon={<MessageSquare size={14}/>} 
                    placeholder="correo@empresa.com" 
                />
                
                {showSecondaryEmail && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                        <InputField 
                            label="Email Secundario" 
                            value={formData.email_secundario} 
                            onChange={(v) => handleInputChange('email_secundario', v)} 
                            type="email" 
                            icon={<MessageSquare size={14}/>} 
                            placeholder="alternativo@empresa.com" 
                        />
                    </div>
                )}

                <InputField label="Web / Redes" value={formData.web} onChange={(v) => handleInputChange('web', v)} icon={<Globe size={14}/>} />
                <InputField label="Fuente Origen" value={formData.fuente_origen} onChange={(v) => handleInputChange('fuente_origen', v)} icon={<Globe size={14}/>} placeholder="Ej. Instagram Ads" />
              </div>

              {/* Column 2: Service Info */}
              <div className="space-y-4">
                <h4 className="font-designer text-lg text-mist border-b border-border-subtle pb-2 mb-4">Servicio</h4>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-1.5">
                    <CheckSquare size={14} /> Servicio de Interés
                  </label>
                  <select
                    value={formData.servicio_interes || 'Agente IA'}
                    onChange={(e) => handleInputChange('servicio_interes', e.target.value)}
                    className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist text-sm focus:border-neon focus:outline-none"
                  >
                    <option value="Agente IA">Agente IA</option>
                    <option value="Pagina Web">Pagina Web</option>
                  </select>
                </div>
                <InputField label="Necesidad" value={formData.necesidad} onChange={(v) => handleInputChange('necesidad', v)} type="textarea" icon={<MessageSquare size={14}/>} />
                <div className="grid grid-cols-2 gap-4 items-start">
                  <InputField label="Valor Implem." value={formData.valor_implementacion} onChange={(v) => handleInputChange('valor_implementacion', v)} type="number" icon={<DollarSign size={14}/>} />
                  <InputField label="Valor Mensual" value={formData.valor_mensualidad} onChange={(v) => handleInputChange('valor_mensualidad', v)} type="number" icon={<DollarSign size={14}/>} />
                </div>
                <InputField label="Fecha Envío Propuesta" value={formData.fecha_envio_propuesta} onChange={(v) => handleInputChange('fecha_envio_propuesta', v)} type="date" icon={<Calendar size={14}/>} />
              </div>

              {/* Column 3: Status & Milestones */}
              <div className="space-y-4">
                <h4 className="font-designer text-lg text-mist border-b border-border-subtle pb-2 mb-4">Estado & Hitos</h4>
                <div className="bg-surface-low border border-border-subtle rounded-lg p-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-mist uppercase">Progreso</span>
                    <span className="text-lg font-bold text-neon">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-night rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-neon-blue to-neon transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    {Object.keys(DEFAULT_MILESTONES).map((key) => {
                      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      return (
                        <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            milestones[key as keyof LeadMilestones] 
                              ? 'bg-neon border-neon text-night' 
                              : 'bg-night border-mist-muted group-hover:border-neon'
                          }`}>
                            {milestones[key as keyof LeadMilestones] && <CheckSquare size={12} strokeWidth={3} />}
                          </div>
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={milestones[key as keyof LeadMilestones]}
                            onChange={() => handleMilestoneChange(key as keyof LeadMilestones)}
                          />
                          <span className={`text-xs ${milestones[key as keyof LeadMilestones] ? 'text-mist font-medium' : 'text-mist-muted'}`}>
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <InputField label="Fecha Primer Contacto" value={formData.fecha_primer_contacto} onChange={(v) => handleInputChange('fecha_primer_contacto', v)} type="date" icon={<Calendar size={14}/>} />
                <InputField label="Comentarios" value={formData.comentarios} onChange={(v) => handleInputChange('comentarios', v)} type="textarea" icon={<MessageSquare size={14}/>} />
                <InputField label="Resultado Final" value={formData.resultado_final} onChange={(v) => handleInputChange('resultado_final', v)} icon={<CheckSquare size={14}/>} />
                <InputField label="Fecha Cierre Real" value={formData.fecha_cierre_real} onChange={(v) => handleInputChange('fecha_cierre_real', v)} type="date" icon={<Calendar size={14}/>} />
              </div>
            </div>

            {/* --- DAR DE BAJA SECTION --- */}
            {leadToEdit && (
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
            )}

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-subtle bg-surface-low rounded-b-xl flex justify-between items-center">
          {leadToEdit && isAdmin ? (
            <button 
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="text-neon-orange hover:bg-neon-orange/10 px-4 py-2 rounded-lg border border-neon-orange/30 hover:border-neon-orange text-sm font-bold uppercase flex items-center transition-all"
            >
              <Trash2 size={16} className="mr-2" /> Eliminar Lead
            </button>
          ) : (
            <div></div> /* Spacer */
          )}

          <div className="flex space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded text-sm font-medium text-mist-muted hover:text-mist transition-colors"
            >
              {leadToEdit ? 'Cerrar' : 'Cancelar'}
            </button>
            <button 
              type="submit"
              form="lead-form"
              className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 transition-all flex items-center"
            >
              <Save size={16} className="mr-2" />
              {leadToEdit ? 'Guardar Cambios' : 'Guardar Lead'}
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal (Nested) */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-night border border-neon-orange rounded-xl w-full max-w-sm shadow-[0_0_30px_rgba(240,96,0,0.3)] overflow-hidden transform scale-100 transition-all">
                <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-neon-orange/10 flex items-center justify-center mb-4 text-neon-orange shadow-[0_0_20px_rgba(240,96,0,0.2)]">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-designer text-mist mb-2">¿Eliminar Lead?</h3>
                    <p className="text-mist-muted text-sm mb-6 leading-relaxed">
                        Esta acción no se puede deshacer. ¿Seguro que deseas eliminar el lead <strong>{leadToEdit?.nombre_empresa || leadToEdit?.nombre_contacto}</strong> y todo su historial?
                    </p>
                    
                    <div className="flex w-full space-x-3">
                        <button 
                            onClick={() => setIsDeleteConfirmOpen(false)}
                            className="flex-1 py-3 rounded-lg border border-border-subtle text-mist hover:bg-surface-med transition-colors font-medium text-sm"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => {
                              if(leadToEdit?.id) onDelete(leadToEdit.id);
                              setIsDeleteConfirmOpen(false);
                            }}
                            className="flex-1 py-3 rounded-lg bg-neon-orange text-white font-bold shadow-[0_0_15px_rgba(240,96,0,0.4)] hover:bg-neon-orange/90 transition-all transform hover:-translate-y-0.5 text-sm"
                        >
                            Eliminar definitivamente
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LeadModal;
