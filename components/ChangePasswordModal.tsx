
import React, { useState } from 'react';
import { Save, Lock } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPass: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onSave }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass === confirmPass && newPass.length >= 4) {
      onSave(newPass);
    } else {
      alert("Las contraseñas no coinciden o son muy cortas.");
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-night border border-neon rounded-xl w-full max-w-md shadow-depth p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mb-4 text-neon mx-auto border border-neon/30">
            <Lock size={32} />
        </div>
        <h2 className="text-2xl font-designer text-mist mb-2">Cambio Obligatorio</h2>
        <p className="text-mist-muted text-sm mb-6">
            Por seguridad, debes cambiar tu contraseña temporal antes de continuar.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted">Nueva Contraseña</label>
                <input 
                    type="password" 
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-surface-low border border-border-subtle rounded p-3 text-mist focus:border-neon focus:outline-none"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted">Confirmar Contraseña</label>
                <input 
                    type="password" 
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full bg-surface-low border border-border-subtle rounded p-3 text-mist focus:border-neon focus:outline-none"
                />
            </div>
            <button 
                type="submit"
                className="w-full py-3 rounded bg-gradient-primary text-mist font-bold shadow-neon-glow mt-4"
            >
                Actualizar y Entrar
            </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
