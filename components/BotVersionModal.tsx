
import React, { useState, useEffect } from 'react';
import { BotVersion, BotType } from '../types';
import { X, Save, Calendar, MessageSquare, Bot, Tag, Trash2, AlertTriangle } from 'lucide-react';

interface BotVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionToEdit: BotVersion | null;
  botType: BotType;
  onSave: (version: BotVersion) => void;
  onDelete: (id: string) => void;
}

const BotVersionModal: React.FC<BotVersionModalProps> = ({
  isOpen,
  onClose,
  versionToEdit,
  botType,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Partial<BotVersion>>({});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (versionToEdit) {
        setFormData({ ...versionToEdit });
      } else {
        setFormData({
          type: botType,
          name: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
      }
      setIsDeleteConfirmOpen(false);
    }
  }, [isOpen, versionToEdit, botType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.date) {
      onSave({
        ...formData,
        id: versionToEdit?.id || Date.now().toString(),
        type: botType
      } as BotVersion);
      onClose();
    }
  };

  const botNameMap = {
    'evolution': 'Bot Evolution',
    'meta': 'Bot Meta',
    'chatwoot': 'Bot Chatwoot'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleteConfirmOpen) onClose();
      }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-md shadow-depth overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
            {versionToEdit ? 'Editar Versión' : 'Nueva Versión'}
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>

        <form id="bot-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="flex items-center space-x-2 mb-4 text-neon font-bold uppercase text-xs tracking-wider border-b border-border-subtle pb-2">
             <Bot size={14} />
             <span>{botNameMap[botType]}</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
              <Tag size={14} /> Nombre de la Versión
            </label>
            <input 
              type="text" 
              required 
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="v1.0.5 - Beta"
              className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
              <Calendar size={14} /> Fecha de Actualización
            </label>
            <input 
              type="date" 
              required 
              value={formData.date || ''}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
              <MessageSquare size={14} /> Notas y Comentarios
            </label>
            <textarea 
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none min-h-[120px]"
              placeholder="Descripción de cambios, fixes, etc..."
            />
          </div>
        </form>

        <div className="p-4 border-t border-border-subtle bg-surface-low flex justify-between items-center">
            {versionToEdit ? (
                 <button 
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="text-neon-orange hover:bg-neon-orange/10 px-3 py-2 rounded-lg border border-neon-orange/30 hover:border-neon-orange text-xs font-bold uppercase flex items-center transition-all"
                 >
                     <Trash2 size={14} className="mr-2" /> Eliminar
                 </button>
             ) : (
                 <div></div>
             )}

            <div className="flex space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-mist-muted hover:text-mist">Cancelar</button>
                <button form="bot-form" type="submit" className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 flex items-center">
                    <Save size={16} className="mr-2"/> Guardar
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
                <h4 className="text-neon-orange font-bold uppercase mb-2">¿Eliminar Versión?</h4>
                <p className="text-sm text-mist-muted mb-6">Esta acción no se puede deshacer.</p>
                <div className="flex justify-center space-x-3">
                    <button 
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="px-4 py-3 rounded-lg border border-border-subtle text-mist hover:bg-white/5 text-sm w-full"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => {
                            if (versionToEdit?.id) onDelete(versionToEdit.id);
                            setIsDeleteConfirmOpen(false);
                            onClose();
                        }}
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

export default BotVersionModal;
