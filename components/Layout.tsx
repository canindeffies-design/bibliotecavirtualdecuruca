
import React from 'react';
import { Navigation } from './Navigation';
import { Link } from 'react-router-dom';
import { VisitorCounter } from './VisitorCounter';

interface LayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, backgroundImage }) => {
  const defaultBg = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=2000";

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden">
      {/* 
        Elemento de fundo fixo para compatibilidade total com iOS/Android.
        Evita o comportamento errático do CSS 'background-attachment: fixed'.
      */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${backgroundImage || defaultBg})` }}
      >
        {/* Camada de escurecimento para contraste */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Conteúdo sobreposto ao fundo */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header com ajuste de padding para mobile */}
        <header className="p-4 md:p-8 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6 md:gap-8">
          {/* Logo Centralizado no Mobile */}
          <Link to="/" className="flex flex-col items-center max-w-[280px] md:max-w-[320px] text-center group transition-transform active:scale-95">
            <div className="bg-white/95 p-3 rounded-full mb-3 shadow-2xl border-2 border-slate-200">
                <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-16 md:h-16 fill-slate-800">
                    <path d="M10,20 L50,10 L90,20 L90,80 L50,90 L10,80 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <path d="M50,15 L50,85" stroke="currentColor" strokeWidth="2"/>
                    <text x="50" y="55" fontSize="12" textAnchor="middle" fontWeight="bold">CHCA</text>
                </svg>
            </div>
            <div className="text-white text-[10px] md:text-xs leading-tight font-black tracking-widest uppercase drop-shadow-lg">
              Casa da História Curuçaense
              <br />
              <span className="font-medium text-[8px] md:text-[9px] opacity-70">Associação Civil Sem Fins Econômicos</span>
            </div>
          </Link>

          {/* Área de Navegação */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-5">
            <div className="order-2 lg:order-1 scale-90 md:scale-100">
              <VisitorCounter />
            </div>
            <div className="order-1 lg:order-2 w-full">
              <Navigation />
            </div>
          </div>
        </header>

        {/* Área de Conteúdo Flexível */}
        <main className="flex-grow flex flex-col w-full">
          {children}
        </main>
        
        {/* Rodapé Otimizado */}
        <footer className="p-6 md:p-10 text-center text-white/30 text-[9px] md:text-[11px] uppercase tracking-[0.2em] font-black leading-loose">
          © {new Date().getFullYear()} Biblioteca Virtual de Curuçá 
          <span className="hidden md:inline"> • </span>
          <br className="md:hidden" />
          Preservando a Memória da Terra do Folclore
        </footer>
      </div>
    </div>
  );
};
