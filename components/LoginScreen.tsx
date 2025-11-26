
import React, { useState } from 'react';
import AiclonLogo from './Logo';

interface LoginScreenProps {
  onLogin: (email: string, pass: string) => void;
  onForgotPassword: () => void;
  authError?: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onForgotPassword, authError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-gradient-bg">
      <div className="relative z-10 w-full max-w-md p-8 m-4 rounded-2xl bg-night/80 backdrop-blur-xl border border-border-subtle shadow-depth">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 drop-shadow-[0_0_10px_rgba(0,200,255,0.5)]">
            <AiclonLogo className="w-20 h-20 text-neon" />
          </div>
          <h1 className="text-5xl font-designer text-mist tracking-wide mb-2 text-center">
            AICLON Desktop
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {authError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center animate-in fade-in">
                  {authError}
              </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-mist-muted uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-night/90 border border-white/10 rounded-lg px-4 py-3 text-mist placeholder-mist-faint focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all duration-300"
              placeholder="nombre@aiclon.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-mist-muted uppercase tracking-wider">Contraseña</label>
              <button type="button" onClick={onForgotPassword} className="text-xs text-neon hover:text-mist transition-colors">¿Olvidaste tu contraseña?</button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-night/90 border border-white/10 rounded-lg px-4 py-3 text-mist placeholder-mist-faint focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-gradient-primary text-mist font-bold shadow-lg hover:shadow-neon-glow transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
