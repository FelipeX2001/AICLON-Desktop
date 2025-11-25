
import React, { useState, useEffect } from 'react';
import { Tutorial, TutorialMedia } from '../types';
import { X, Save, Trash2, AlertTriangle, Link as LinkIcon, FileText, Calendar, Image as ImageIcon, Video, Plus } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorialToEdit: Tutorial | null;
  onSave: (tutorial: Tutorial) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  tutorialToEdit,
  onSave,
  onDelete,
  isAdmin = false
}) => {
  const [formData, setFormData] = useState<Partial<Tutorial>>({});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newMediaLink, setNewMediaLink] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (tutorialToEdit) {
        setFormData({ ...tutorialToEdit });
      } else {
        setFormData({
          title: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          link: '',
          media: []
        });
      }
      setIsDeleteConfirmOpen(false);
      setNewMediaLink('');
    }
  }, [isOpen, tutorialToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.date) {
      onSave({
        ...formData,
        id: tutorialToEdit?.id || Date.now().toString(),
        media: formData.media || []
      } as Tutorial);
      onClose();
    }
  };

  const handleAddMedia = (type: 'image' | 'video_link') => {
      if (!newMediaLink) return;
      const newMedia: TutorialMedia = {
          id: Date.now().toString(),
          type,
          url: newMediaLink,
          name: type === 'image' ? 'Imagen adjunta' : 'Video adjunto'
      };
      setFormData(prev => ({
          ...prev,
          media: [...(prev.media || []), newMedia]
      }));
      setNewMediaLink('');
  };

  const handleRemoveMedia = (id: string) => {
      setFormData(prev => ({
          ...prev,
          media: (prev.media || []).filter(m => m.id !== id)
      }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleteConfirmOpen) onClose();
      }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-2xl shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
            {tutorialToEdit ? 'Editar Tutorial' : 'Nuevo Tutorial'}
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>

        <form id="tutorial-form" onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Cover Image */}
          <ImageUploadField 
             label="Imagen de Portada Principal"
             value={formData.coverUrl} 
             onChange={(url) => setFormData(prev => ({...prev, coverUrl: url}))} 
          />

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted">Nombre del Tutorial</label>
            <input 
              type="text" 
              required 
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
              placeholder="Ej. Configuración de Flujos de Venta"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                    <Calendar size={14} /> Fecha Creación
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
                    <LinkIcon size={14} /> Link Importante
                </label>
                <input 
                    type="text" 
                    value={formData.link || ''}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                    placeholder="https://docs.aiclon.io/..."
                />
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <FileText size={14} /> Explicación / Descripción
            </label>
            <textarea 
              required
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none min-h-[120px]"
              placeholder="Describe el contenido del tutorial..."
            />
          </div>

          {/* Multimedia Section */}
          <div className="space-y-3 pt-4 border-t border-border-subtle">
             <h4 className="text-sm font-bold text-mist uppercase">Galería Multimedia</h4>
             
             <div className="flex space-x-2">
                 <input 
                    type="text" 
                    value={newMediaLink}
                    onChange={(e) => setNewMediaLink(e.target.value)}
                    placeholder="Pegar URL de imagen o video..."
                    className="flex-1 bg-surface-low border border-border-subtle rounded p-2 text-xs text-mist focus:border-neon focus:outline-none"
                 />
                 <button 
                    type="button"
                    onClick={() => handleAddMedia('image')}
                    className="px-3 py-1 bg-surface-med border border-border-subtle rounded hover:text-neon transition-colors"
                    title="Agregar Imagen"
                 >
                     <ImageIcon size={16} />
                 </button>
                 <button 
                    type="button"
                    onClick={() => handleAddMedia('video_link')}
                    className="px-3 py-1 bg-surface-med border border-border-subtle rounded hover:text-neon-orange transition-colors"
                    title="Agregar Video Link"
                 >
                     <Video size={16} />
                 </button>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                 {formData.media?.map(m => (
                     <div key={m.id} className="relative group aspect-video bg-night rounded border border-border-subtle overflow-hidden">
                         {m.type === 'image' ? (
                             <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center bg-black">
                                 <Video size={24} className="text-mist-muted" />
                             </div>
                         )}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button 
                                type="button"
                                onClick={() => handleRemoveMedia(m.id)}
                                className="text-red-500 hover:text-red-400 p-1"
                             >
                                 <Trash2 size={20} />
                             </button>
                         </div>
                         <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-[10px] text-mist truncate px-2">
                             {m.url}
                         </div>
                     </div>
                 ))}
             </div>
          </div>

        </form>

        <div className="p-4 border-t border-border-subtle bg-surface-low flex justify-between items-center">
            {tutorialToEdit && isAdmin ? (
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
                <button form="tutorial-form" type="submit" className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 flex items-center">
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
                <h4 className="text-neon-orange font-bold uppercase mb-2">¿Eliminar Tutorial?</h4>
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
                            if (tutorialToEdit?.id) onDelete(tutorialToEdit.id);
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

export default TutorialModal;
