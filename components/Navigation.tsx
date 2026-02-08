
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Início', path: '/' },
  { label: 'Livros', path: '/categoria/livros' },
  { label: 'Fotos', path: '/categoria/fotografias' },
  { label: 'Jornais', path: '/categoria/jornais' },
  { label: 'Docs', path: '/categoria/documentos' },
  { label: 'Artigos', path: '/categoria/artigos' },
  { label: 'Extra', path: '/categoria/outros' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-3 w-full">
        <nav className="flex flex-wrap gap-1.5 md:gap-2 justify-center lg:justify-end items-center px-2">
        {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
            <Link
                key={item.label}
                to={item.path}
                className={`
                px-3 md:px-6 py-3 text-[9px] md:text-sm font-black transition-all duration-200 border-2 text-center uppercase tracking-wider min-w-[75px] md:min-w-[100px] flex-1 sm:flex-none
                ${isActive 
                    ? 'bg-white text-slate-900 border-white shadow-xl scale-105 z-10' 
                    : 'bg-black/50 text-white border-white/20 hover:bg-white hover:text-black hover:border-white backdrop-blur-md active:bg-white/20'}
                `}
            >
                {item.label}
            </Link>
            );
        })}
        </nav>
        <Link 
            to="/admin" 
            className="text-[9px] text-white/30 hover:text-yellow-400 text-center lg:text-right font-black uppercase tracking-[0.3em] transition-colors py-1 px-4"
        >
            Administração
        </Link>
    </div>
  );
};
