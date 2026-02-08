
import { Category } from './types';

export const LIBRARY_BG = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000';

export const CATEGORIES: Record<string, Category> = {
  livros: {
    id: 'livros',
    title: 'Livros',
    bgImage: LIBRARY_BG,
    subCategories: [
      { id: 'historia', title: 'Autores Curuçaenses (História)' },
      { id: 'poesias', title: 'Autores Curuçaenses (Poesias e Contos)' },
      { id: 'cronistas', title: 'Autores e Cronistas (História)' },
    ]
  },
  jornais: {
    id: 'jornais',
    title: 'Jornais',
    bgImage: LIBRARY_BG,
    subCategories: [
      { id: 'curucaense', title: 'Jornais Curuçaenses (O Curuçaense)' },
      { id: 'narrativas', title: 'Jornais sobre Curuçá (Narrativas e imagens)' },
    ]
  },
  fotografias: {
    id: 'fotografias',
    title: 'Fotografias',
    bgImage: LIBRARY_BG,
    subCategories: [
      { id: 'originais', title: 'Fotografias Antigas (Originais)' },
      { id: 'ia', title: 'Fotografias Antigas (Melhoradas por IA)' },
    ]
  },
  documentos: {
    id: 'documentos',
    title: 'Documentos',
    bgImage: LIBRARY_BG,
    subCategories: [
      { id: 'palacete', title: 'Documentos (Originais no Palacete)' },
      { id: 'digitais', title: 'Documentos (Fontes externas e digitais)' },
    ]
  },
  artigos: {
    id: 'artigos',
    title: 'Artigos',
    bgImage: LIBRARY_BG,
    subCategories: [
      { id: 'nacionais', title: 'Artigos Acadêmicos (Nacionais)' },
      { id: 'internacionais', title: 'Artigos Acadêmicos (Internacionais)' },
    ]
  },
  outros: {
    id: 'outros',
    title: 'Outros',
    bgImage: LIBRARY_BG,
    subCategories: [
      { id: 'alfarrabios', title: 'Alfarrábios' },
      { id: 'videos', title: 'Vídeos' },
    ]
  }
};

// Site agora inicia sem nenhum arquivo. O administrador deve carregar tudo.
export const SAMPLE_ITEMS: Record<string, any[]> = {};
