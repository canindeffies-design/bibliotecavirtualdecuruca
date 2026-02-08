
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { CATEGORIES, LIBRARY_BG } from '../constants';
import { getItemsBySubCategory } from '../services/storage';
import { Item } from '../types';

export const ItemListing: React.FC = () => {
  const { categoryId, subId } = useParams<{ categoryId: string; subId: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const category = categoryId ? CATEGORIES[categoryId] : null;
  const subCategory = category?.subCategories.find(s => s.id === subId);

  useEffect(() => {
    const fetchItems = async () => {
      if (subId) {
        setIsLoading(true);
        try {
          const fetchedItems = await getItemsBySubCategory(subId);
          setItems(fetchedItems);
        } catch (err) {
          console.error("Erro ao carregar itens:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchItems();
  }, [subId]);

  // Sistema de Indexação/Busca interna
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.author?.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  // Função de download otimizada para Android/iOS
  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>, item: Item) => {
    // Em alguns navegadores mobile (iOS), downloads de grandes base64 podem falhar.
    // Como fallback, tentamos abrir em nova aba para o sistema gerir o PDF.
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<iframe src="${item.downloadUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
      }
    }
  };

  if (!category || !subCategory) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center text-white p-6 text-center">
          <h2 className="text-2xl md:text-4xl font-serif-library">Conteúdo não encontrado</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backgroundImage={LIBRARY_BG}>
      <div className="flex-grow p-4 md:p-8 lg:p-12 w-full max-w-[1920px] mx-auto">
        <div className="mb-10 md:mb-16 text-center">
            <h1 className="text-3xl md:text-6xl font-serif-library font-bold text-white drop-shadow-2xl px-4 uppercase leading-tight tracking-tight mb-6">
                {subCategory.title}
            </h1>
            
            {/* Barra de Busca para Indexação e Reconhecimento */}
            <div className="max-w-md mx-auto relative group px-4">
                <input 
                    type="text"
                    placeholder="Pesquisar no acervo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border-2 border-white/20 rounded-full py-3 px-6 text-white text-sm outline-none focus:border-yellow-400 focus:bg-black/60 transition-all placeholder:text-white/30"
                />
                <div className="absolute right-8 top-3.5 text-white/30 group-focus-within:text-yellow-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
            </div>
        </div>

        {isLoading ? (
            <div className="text-center py-24">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-yellow-400"></div>
                <p className="text-white mt-6 font-black uppercase tracking-widest text-[10px] opacity-50">Sincronizando Banco de Dados...</p>
            </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-4 gap-y-10 px-2">
              {filteredItems.map((item) => (
                  <div key={item.id} className="flex flex-col items-center group animate-in fade-in zoom-in duration-500">
                      <div className="w-full aspect-[3/4] mb-3 relative overflow-hidden rounded-lg shadow-2xl border border-white/5 bg-black/40">
                          <img 
                              src={item.coverImage} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                          />
                          <div className="absolute inset-0 bg-slate-900/95 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4 text-center">
                              <span className="text-white text-[10px] md:text-[11px] font-black uppercase mb-2 leading-snug">{item.title}</span>
                              {item.author && <span className="text-yellow-400 text-[8px] md:text-[9px] font-bold uppercase tracking-wider">{item.author}</span>}
                          </div>
                      </div>
                      
                      <div className="w-full text-center mb-2 lg:hidden">
                           <p className="text-white/90 text-[10px] font-bold uppercase truncate px-1">{item.title}</p>
                      </div>

                      <a 
                          href={item.downloadUrl}
                          download={item.originalName || `${item.title}.pdf`}
                          onClick={(e) => handleDownload(e, item)}
                          className="w-full bg-[#001f5c] border-2 border-yellow-400 py-3 text-center transition-all hover:bg-yellow-400 hover:text-[#001f5c] active:scale-95 shadow-2xl rounded-sm"
                      >
                          <span className="text-white group-hover:text-inherit font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                              Download
                          </span>
                      </a>
                  </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-24 md:py-40 bg-black/30 backdrop-blur-xl rounded-[40px] border-2 border-dashed border-white/5 max-w-xl mx-auto px-10">
              <span className="text-4xl md:text-6xl block mb-6 grayscale opacity-30">📚</span>
              <h2 className="text-white font-serif-library text-xl md:text-2xl mb-2 font-bold">Nenhum resultado</h2>
              <p className="text-white/40 text-[9px] uppercase tracking-[0.4em] font-black">A busca não retornou documentos para este critério.</p>
              {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-8 text-yellow-400 text-[10px] font-black uppercase tracking-widest border-b border-yellow-400/30 hover:text-white hover:border-white transition-all"
                >
                    Limpar Pesquisa
                </button>
              )}
          </div>
        )}
      </div>
    </Layout>
  );
};
