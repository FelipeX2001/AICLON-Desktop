
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { X, Save, Shield, User as UserIcon, Mail, Trash2, AlertTriangle, Lock, ImageIcon } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  userToEdit: User | null;
  onSave: (updatedUser: User & { tempPassword?: string }) => void;
  onDelete?: (userId: string) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUser, 
  userToEdit, 
  onSave,
  onDelete 
}) => {
  const [formData, setFormData] = useState<Partial<User> & { tempPassword?: string }>({});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const isCreating = userToEdit && !userToEdit.id; 

  useEffect(() => {
    if (userToEdit) {
      setFormData({ ...userToEdit });
      setIsDeleteConfirmOpen(false);
    }
  }, [userToEdit]);

  if (!isOpen || !userToEdit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSave(formData as User & { tempPassword?: string });
      onClose();
    }
  };

  const isAdmin = currentUser.role === 'admin';
  const canDelete = isAdmin && !isCreating && onDelete && userToEdit.id !== currentUser.id;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-md shadow-depth overflow-hidden">
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
             {isCreating ? 'Crear Usuario' : 'Editar Perfil'}
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Banner Upload */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2"><ImageIcon size={14} /> Banner de Perfil</label>
            <div className="relative h-24 rounded-lg overflow-hidden border border-border-subtle">
              {formData.coverUrl ? (
                <img 
                  src={formData.coverUrl} 
                  alt="Banner" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon/20 via-neon-blue/20 to-night flex items-center justify-center">
                  <span className="text-xs text-mist-muted">Sin banner</span>
                </div>
              )}
            </div>
            <ImageUploadField 
              label="Cambiar Banner"
              value={formData.coverUrl || ''} 
              onChange={(url) => setFormData({...formData, coverUrl: url})}
            />
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-3">
             <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neon/50 shadow-[0_0_15px_rgba(0,200,255,0.3)] relative">
                 <img 
                    src={formData.avatarUrl || 'https://via.placeholder.com/150'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                 />
             </div>
             <div className="w-full">
                 <ImageUploadField 
                    label="Cambiar Foto de Perfil"
                    value={formData.avatarUrl || ''} 
                    onChange={(url) => setFormData({...formData, avatarUrl: url})}
                    className="text-center"
                 />
             </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2"><UserIcon size={14} /> Nombre</label>
              <input type="text" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-low border border-border-subtle rounded p-3 text-mist focus:border-neon focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2"><Mail size={14} /> Email</label>
              <input type="email" required value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-surface-low border border-border-subtle rounded p-3 text-mist focus:border-neon focus:outline-none" />
            </div>

            {isAdmin && (
              <div className="space-y-1 pt-2 border-t border-border-subtle">
                <label className="text-xs uppercase font-bold text-neon-orange flex items-center gap-2 mb-2"><Shield size={14} /> Rol</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={() => setFormData({...formData, role: 'admin'})} className="accent-neon-orange" /> <span className="text-sm text-mist">Admin</span></label>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="role" value="developer" checked={formData.role === 'developer'} onChange={() => setFormData({...formData, role: 'developer'})} className="accent-neon" /> <span className="text-sm text-mist">Developer</span></label>
                </div>
              </div>
            )}

            {/* Temp Password for New Users */}
            {isCreating && isAdmin && (
                <div className="space-y-1 pt-2">
                    <label className="text-xs uppercase font-bold text-neon flex items-center gap-2"><Lock size={14} /> Contraseña Temporal</label>
                    <input 
                        type="text" 
                        value={formData.tempPassword || ''} 
                        onChange={(e) => setFormData({...formData, tempPassword: e.target.value})} 
                        className="w-full bg-surface-low border border-neon/50 rounded p-3 text-mist focus:outline-none font-mono text-sm" 
                        placeholder="Generar o escribir..."
                    />
                    <p className="text-[10px] text-mist-muted">El usuario deberá cambiarla al iniciar sesión.</p>
                </div>
            )}
          </div>

          <div className="pt-4 flex justify-between space-x-3 border-t border-border-subtle mt-4">
            {canDelete ? (
                <button type="button" onClick={() => setIsDeleteConfirmOpen(true)} className="text-neon-orange hover:bg-neon-orange/10 px-3 py-2 rounded-lg border border-neon-orange/30 hover:border-neon-orange text-xs font-bold uppercase flex items-center transition-all"><Trash2 size={14} className="mr-1" /> Eliminar</button>
            ) : <div></div>}

            <div className="flex space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded text-sm font-medium text-mist-muted hover:text-mist transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 transition-all flex items-center"><Save size={16} className="mr-2" /> Guardar</button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirm */}
      {isDeleteConfirmOpen && (
        <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black/90 p-6">
           <div className="bg-night border border-neon-orange rounded-xl w-full max-w-sm p-6 text-center">
                <h4 className="text-neon-orange font-bold uppercase mb-2">¿Eliminar Usuario?</h4>
                <p className="text-sm text-mist-muted mb-6">Se desactivará el acceso de <strong>{userToEdit.name}</strong>.</p>
                <div className="flex justify-center space-x-3">
                    <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 border border-border-subtle text-mist rounded">Cancelar</button>
                    <button onClick={() => { if (onDelete && userToEdit.id) onDelete(userToEdit.id); }} className="px-4 py-2 bg-neon-orange text-white font-bold rounded">Eliminar</button>
                </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default UserEditModal;
