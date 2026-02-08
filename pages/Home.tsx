
import React from 'react';
import { Layout } from '../components/Layout';

export const Home: React.FC = () => {
  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="max-w-4xl w-full text-center lg:text-left flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 space-y-6 md:space-y-8">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif-library font-bold text-white drop-shadow-lg uppercase tracking-wider leading-tight">
                    BIBLIOTECA VIRTUAL DE CURUÇÁ
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl text-white font-serif-library leading-relaxed drop-shadow-md bg-black/30 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                    Bem-vindos! Aqui você terá um acervo sobre o município de Curuçá 
                    de livros, jornais, fotografias antigas, documentos, artigos 
                    científicos e outros para baixar gratuitamente. Boa pesquisa para você!
                </p>
            </div>
            
            {/* Image shown only on desktop for better mobile focus on text */}
            <div className="hidden lg:block w-1/3">
                 <img 
                    src="https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=800" 
                    alt="Clássico" 
                    className="rounded-2xl shadow-2xl border-4 border-white/20 transform hover:scale-105 transition-transform duration-500"
                 />
            </div>
        </div>
      </div>
    </Layout>
  );
};
