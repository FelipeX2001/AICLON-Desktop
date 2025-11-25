
import React, { useState } from 'react';
import { CurrentClient } from '../types';
import { X, Save, Building, MapPin, DollarSign, Activity } from 'lucide-react';

interface CurrentClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: CurrentClient) => void;
}

const CurrentClientModal: React.FC<CurrentClientModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<CurrentClient>>({
    status: 'Activo'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.monthlyValue) {
      onSave({
        ...formData,
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split('T')[0]
      } as CurrentClient);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-md shadow-depth overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase">Nuevo Cliente Actual</h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2"><Building size={14}/> Nombre Cliente</label>
            <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2"><Building size={14}/> Sector</label>
            <input type="text" value={formData.sector || ''} onChange={e => setFormData({...formData, sector: e.target.value})} className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2"><MapPin size={14}/> Ciudad</label>
            <input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2"><DollarSign size={14}/> Valor Mensual (MRR)</label>
            <input type="text" required value={formData.monthlyValue || ''} onChange={e => setFormData({...formData, monthlyValue: e.target.value})} className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2"><Activity size={14}/> Estado</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none">
                <option value="Activo">Activo</option>
                <option value="En Pausa">En Pausa</option>
                <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-mist-muted">Cancelar</button>
            <button type="submit" className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 flex items-center"><Save size={16} className="mr-2"/> Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CurrentClientModal;
