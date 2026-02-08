
export interface Item {
  id: string;
  title: string;
  author?: string;
  coverImage: string;
  downloadUrl: string;
  originalName?: string;
  fileType?: string; // Armazena o tipo MIME (ex: application/pdf)
  uploadDate: number; // Para ordenação e indexação temporal
}

export interface SubCategory {
  id: string;
  title: string;
  items?: Item[];
}

export interface Category {
  id: string;
  title: string;
  bgImage: string;
  subCategories: SubCategory[];
}

export type MainCategoryType = 'home' | 'livros' | 'fotografias' | 'jornais' | 'documentos' | 'artigos' | 'outros';
