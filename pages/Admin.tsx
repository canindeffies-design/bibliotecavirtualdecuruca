
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { CATEGORIES, LIBRARY_BG } from '../constants';
import { saveItem, deleteItem, getAllStoredItems } from '../services/storage';
import { Item } from '../types';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'gerenciar' | 'publicar'>('publicar');

  const [formCat, setFormCat] = useState(Object.keys(CATEGORIES)[0]);
  const [formSub, setFormSub] = useState(CATEGORIES[Object.keys(CATEGORIES)[0]].subCategories[0].id);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverBase64, setCoverBase64] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [fileType, setFileType] = useState('');
  const [originalFileName, setOriginalFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [filterSub, setFilterSub] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = async () => {
    const stored = await getAllStoredItems();
    setItems(stored);
  };

  useEffect(() => {
    if (isAuthenticated) loadItems();
  }, [isAuthenticated]);

  useEffect(() => {
    setFormSub(CATEGORIES[formCat].subCategories[0].id);
  }, [formCat]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Bingo111@') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, isMainFile = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isMainFile) {
        setOriginalFileName(file.name);
        setFileType(file.type);
      }
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !coverBase64 || !fileBase64) {
      alert("⚠️ Preencha o Título e anexe Capa + Arquivo.");
      return;
    }
    
    setIsProcessing(true);
    const newItem: Item = { 
      id: Date.now().toString(), 
      title, 
      author: author || 'Acervo Curuçaense',
      coverImage: coverBase64, 
      downloadUrl: fileBase64,
      originalName: originalFileName,
      fileType: fileType,
      uploadDate: Date.now()
    };

    try {
      await saveItem(formSub, newItem);
      
      setTitle(''); 
      setAuthor('');
      setCoverBase64(''); 
      setFileBase64('');
      setOriginalFileName('');
      setFileType('');
      const fileInputs = document.querySelectorAll('input[type="file"]');
      (fileInputs as any).forEach((input: any) => input.value = "");
      
      setSaveStatus('success');
      loadItems();
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      alert("Erro ao publicar.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (itemId: string, subId: string) => {
    if (!confirm("Excluir permanentemente?")) return;
    setDeletingId(itemId);
    try {
      await deleteItem(itemId);
      loadItems();
    } catch (err) {
      alert("Falha ao excluir.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItemsList = useMemo(() => {
    const list: (Item & { subId: string })[] = [];
    Object.entries(items).forEach(([subId, subItems]) => {
      if (filterSub === 'all' || filterSub === subId) {
        (subItems as Item[]).forEach(item => {
          list.push({ ...item, subId });
        });
      }
    });
    return list.sort((a, b) => b.uploadDate - a.uploadDate);
  }, [items, filterSub]);

  const getSubName = (subId: string) => {
    for (const cat of Object.values(CATEGORIES)) {
      const sub = cat.subCategories.find(s => s.id === subId);
      if (sub) return sub.title;
    }
    return "Geral";
  };

  if (!isAuthenticated) {
    return (
      <Layout backgroundImage={LIBRARY_BG}>
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white p-8 md:p-14 rounded-[40px] md:rounded-[50px] shadow-2xl max-w-sm w-full text-center">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase mb-8 tracking-tighter">Acesso Restrito</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-5 border-2 border-slate-100 rounded-2xl text-center text-xl outline-none focus:border-blue-600 font-bold bg-slate-50 appearance-none" 
                placeholder="SENHA" 
              />
              {error && <p className="text-red-500 text-[10px] font-bold uppercase">{error}</p>}
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl">Acessar Painel</button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backgroundImage={LIBRARY_BG}>
      <div className="flex-grow p-3 md:p-10 lg:max-w-[1440px] mx-auto w-full">
        <div className="bg-white/95 rounded-[30px] md:rounded-[60px] shadow-2xl overflow-hidden border-4 md:border-8 border-white/20">
          
          <div className="bg-slate-900 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <h1 className="text-white font-black text-sm md:text-xl uppercase tracking-tighter text-center md:text-left">Gestão de Acervo Digital</h1>
            <div className="flex flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
                <button onClick={() => setActiveTab('publicar')} className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-[9px] uppercase transition-all ${activeTab === 'publicar' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>Upload</button>
                <button onClick={() => setActiveTab('gerenciar')} className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-[9px] uppercase transition-all ${activeTab === 'gerenciar' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>Acervo</button>
                <button onClick={() => setIsAuthenticated(false)} className="px-4 py-3 bg-red-500/10 text-red-400 font-black text-[9px] uppercase transition-all ml-1 rounded-xl">Sair</button>
            </div>
          </div>

          <div className="p-4 md:p-12 lg:p-20">
            {activeTab === 'publicar' ? (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg font-black text-slate-900 uppercase mb-8 text-center">Publicar Novo Conteúdo</h2>
                <form onSubmit={handleAddItem} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 ml-3 uppercase">Categoria Pai</label>
                            <select className="w-full p-4 md:p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-xs appearance-none" value={formCat} onChange={e => setFormCat(e.target.value)}>
                                {Object.entries(CATEGORIES).map(([id, cat]) => <option key={id} value={id}>{cat.title}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 ml-3 uppercase">Subcategoria</label>
                            <select className="w-full p-4 md:p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold text-xs appearance-none text-blue-700" value={formSub} onChange={e => setFormSub(e.target.value)}>
                                {CATEGORIES[formCat].subCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.title}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <input type="text" placeholder="TÍTULO DO ARQUIVO" className="w-full p-5 rounded-2xl border-2 border-slate-100 font-bold text-xs uppercase" value={title} onChange={e => setTitle(e.target.value)} />
                    <input type="text" placeholder="AUTOR OU CRONISTA (OPCIONAL)" className="w-full p-5 rounded-2xl border-2 border-slate-100 font-bold text-xs uppercase" value={author} onChange={e => setAuthor(e.target.value)} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 md:p-10 rounded-2xl border-2 border-dashed border-slate-200 relative text-center hover:bg-slate-50 transition-colors">
                            <span className="text-[9px] font-black text-slate-400 block mb-2 uppercase">Imagem da Capa</span>
                            <input type="file" accept="image/*" onChange={e => handleFileChange(e, setCoverBase64)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <span className={`text-[11px] font-black ${coverBase64 ? 'text-green-600' : 'text-blue-600'}`}>{coverBase64 ? '✓ CAPA OK' : '+ ADICIONAR CAPA'}</span>
                        </div>
                        <div className="p-6 md:p-10 rounded-2xl border-2 border-dashed border-slate-200 relative text-center hover:bg-slate-50 transition-colors">
                            <span className="text-[9px] font-black text-slate-400 block mb-2 uppercase">Arquivo (PDF/DOC)</span>
                            <input type="file" onChange={e => handleFileChange(e, setFileBase64, true)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <span className={`text-[11px] font-black ${fileBase64 ? 'text-green-600' : 'text-indigo-600'}`}>{fileBase64 ? '✓ ARQUIVO OK' : '+ SELECIONAR ARQUIVO'}</span>
                        </div>
                    </div>

                    <button type="submit" disabled={isProcessing} className="w-full py-6 md:py-8 rounded-2xl bg-slate-900 text-white font-black text-[11px] md:text-[13px] uppercase tracking-[0.3em] hover:bg-blue-800 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                        {isProcessing ? 'ENVIANDO...' : (saveStatus === 'success' ? 'SUCESSO!' : 'PUBLICAR NO SITE')}
                    </button>
                </form>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h2 className="text-xl font-black text-slate-900 uppercase">Lista de Publicados</h2>
                    <select className="w-full md:w-auto p-4 bg-slate-100 rounded-2xl border-none font-black text-[10px] uppercase appearance-none" value={filterSub} onChange={e => setFilterSub(e.target.value)}>
                        <option value="all">Ver Tudo</option>
                        {Object.values(CATEGORIES).flatMap(c => c.subCategories).map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredItemsList.map((item) => (
                        <div key={item.id} className={`group bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all shadow-sm ${deletingId === item.id ? 'opacity-0 scale-50' : ''}`}>
                            <div className="aspect-[3/4] relative overflow-hidden bg-slate-100">
                                <img src={item.coverImage} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 md:opacity-0 transition-all flex items-center justify-center p-3">
                                    <button onClick={() => handleDelete(item.id, item.subId)} className="w-full bg-red-600 text-white font-black text-[9px] py-3 rounded-xl uppercase active:scale-90">
                                        Excluir
                                    </button>
                                </div>
                                <button onClick={() => handleDelete(item.id, item.subId)} className="md:hidden absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"/></svg>
                                </button>
                            </div>
                            <div className="p-3">
                                <h3 className="text-[10px] font-black text-slate-900 line-clamp-2 uppercase leading-tight">{item.title}</h3>
                                <p className="text-[8px] text-blue-700 font-bold uppercase mt-1">{getSubName(item.subId)}</p>
                            </div>
                        </div>
                    ))}
                    {filteredItemsList.length === 0 && (
                        <div className="col-span-full py-24 text-center text-slate-300 font-black uppercase text-xs tracking-widest italic">
                            Acervo vazio.
                        </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
