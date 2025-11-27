import React, { useState } from 'react';
import { Tutorial, TutorialStep, User, StepMediaType } from '../types';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, X } from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import StepMediaUpload from './StepMediaUpload';

interface TutorialEditPageProps {
  tutorial: Tutorial;
  currentUser?: User;
  onBack: () => void;
  onSave: (tutorial: Tutorial) => void;
  onDelete: (id: string) => void;
}

const TutorialEditPage: React.FC<TutorialEditPageProps> = ({ tutorial, currentUser, onBack, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Tutorial>({ ...tutorial });
  const [steps, setSteps] = useState<TutorialStep[]>(tutorial.steps || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (field: keyof Tutorial, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addStep = () => {
    const newStep: TutorialStep = {
      id: `step_${Date.now()}`,
      title: '',
      content: '',
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (index: number, field: keyof TutorialStep, value: string | number) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const updateStepMedia = (index: number, url: string, type: StepMediaType | undefined) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], mediaUrl: url, mediaType: type };
    setSteps(updated);
  };

  const removeStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) {
      return;
    }
    const updated = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setSteps(updated.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const handleSave = () => {
    const updatedTutorial: Tutorial = {
      ...formData,
      steps: steps.length > 0 ? steps : undefined,
      media: []
    };
    onSave(updatedTutorial);
  };

  const handleDelete = () => {
    onDelete(tutorial.id);
  };

  return (
    <div className="h-full flex flex-col bg-night">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-low/50">
        <button
          onClick={onBack}
          className="flex items-center text-mist-muted hover:text-neon transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-sm font-medium">Cancelar</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Eliminar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-gradient-primary text-mist font-bold text-sm shadow-neon-glow hover:brightness-110 transition-all flex items-center"
          >
            <Save size={16} className="mr-2" />
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-6 md:px-8 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-surface-low border border-border-subtle rounded-xl p-6">
              <h2 className="text-lg font-designer text-mist mb-4">Información Básica</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-mist-muted uppercase mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-surface-med border border-border-subtle focus:border-neon focus:outline-none text-mist"
                    placeholder="Nombre del tutorial"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-mist-muted uppercase mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => handleChange('date', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-surface-med border border-border-subtle focus:border-neon focus:outline-none text-mist"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-mist-muted uppercase mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={e => handleChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-surface-med border border-border-subtle focus:border-neon focus:outline-none text-mist resize-none"
                    placeholder="Descripción general del tutorial..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-mist-muted uppercase mb-2">
                    Enlace Principal
                  </label>
                  <input
                    type="url"
                    value={formData.link || ''}
                    onChange={e => handleChange('link', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-surface-med border border-border-subtle focus:border-neon focus:outline-none text-mist"
                    placeholder="https://..."
                  />
                </div>

                <ImageUploadField
                  value={formData.coverUrl || ''}
                  onChange={url => handleChange('coverUrl', url)}
                  label="Imagen de Portada (Banner)"
                  maxWidth={1920}
                />
              </div>
            </div>

            <div className="bg-surface-low border border-border-subtle rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-designer text-mist">Pasos del Tutorial</h2>
                <button
                  onClick={addStep}
                  className="px-3 py-1.5 rounded-lg bg-neon/10 border border-neon/30 text-neon text-sm font-medium hover:bg-neon/20 transition-all flex items-center"
                >
                  <Plus size={14} className="mr-1" />
                  Agregar Paso
                </button>
              </div>

              {steps.length === 0 ? (
                <div className="text-center py-8 text-mist-faint italic border-2 border-dashed border-border-subtle rounded-lg">
                  No hay pasos definidos. Agrega pasos para crear una guía paso a paso.
                </div>
              ) : (
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className="bg-surface-med border border-border-subtle rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-mist-muted hover:text-neon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <GripVertical size={16} className="rotate-180" />
                          </button>
                          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-mist font-bold text-sm">
                            {index + 1}
                          </div>
                          <button
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === steps.length - 1}
                            className="p-1 text-mist-muted hover:text-neon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <GripVertical size={16} />
                          </button>
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={step.title}
                            onChange={e => updateStep(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-night border border-border-subtle focus:border-neon focus:outline-none text-mist text-sm"
                            placeholder="Título del paso"
                          />
                          <textarea
                            value={step.content}
                            onChange={e => updateStep(index, 'content', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg bg-night border border-border-subtle focus:border-neon focus:outline-none text-mist text-sm resize-none"
                            placeholder="Contenido del paso..."
                          />
                          <StepMediaUpload
                            mediaUrl={step.mediaUrl}
                            mediaType={step.mediaType}
                            onMediaChange={(url, type) => updateStepMedia(index, url, type)}
                          />
                        </div>
                        
                        <button
                          onClick={() => removeStep(index)}
                          className="p-2 text-mist-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-night border border-border-subtle rounded-xl w-full max-w-sm shadow-depth overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
              <h3 className="text-sm font-designer text-mist uppercase">Confirmar Eliminación</h3>
              <button onClick={() => setShowDeleteConfirm(false)}>
                <X size={18} className="text-mist-muted" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-mist-muted text-sm mb-6">
                ¿Estás seguro de que deseas eliminar este tutorial? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-border-subtle text-mist-muted hover:text-mist transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all text-sm font-medium"
                >
                  Eliminar Tutorial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialEditPage;
