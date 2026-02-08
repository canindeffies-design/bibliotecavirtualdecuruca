
import { Item } from '../types';
import { SAMPLE_ITEMS } from '../constants';

const DB_NAME = 'CurucaLibraryDB';
const STORE_NAME = 'items';
const DELETED_STORE = 'deleted_ids';
const DB_VERSION = 2; // Incrementado para lidar com o novo store
const VISITOR_KEY = 'curuca_visitor_count';

/**
 * Inicializa ou obtém a conexão com o banco de dados IndexedDB
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(DELETED_STORE)) {
        db.createObjectStore(DELETED_STORE, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Recupera todos os itens salvos do IndexedDB e mescla com os SAMPLE_ITEMS,
 * filtrando IDs que foram marcados como removidos definitivamente.
 */
export const getAllStoredItems = async (): Promise<Record<string, Item[]>> => {
  const db = await openDB();
  
  // Obter IDs deletados
  const deletedIds: string[] = await new Promise((resolve) => {
    const transaction = db.transaction(DELETED_STORE, 'readonly');
    const store = transaction.objectStore(DELETED_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.map((item: any) => item.id));
    request.onerror = () => resolve([]);
  });

  // Obter itens salvos
  const storedList: (Item & { subId: string })[] = await new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve([]);
  });

  const result: Record<string, Item[]> = {};
  
  // 1. Carregar Categorias Base
  Object.keys(SAMPLE_ITEMS).forEach(cat => {
    // Filtra amostras que foram deletadas definitivamente
    result[cat] = SAMPLE_ITEMS[cat].filter(item => !deletedIds.includes(item.id));
  });
  
  // 2. Mesclar Itens da IndexedDB
  storedList.forEach(item => {
    if (deletedIds.includes(item.id)) return; // Ignora se estiver na lista de deletados
    
    if (!result[item.subId]) result[item.subId] = [];
    
    const index = result[item.subId].findIndex(i => i.id === item.id);
    if (index !== -1) {
      result[item.subId][index] = item;
    } else {
      result[item.subId].unshift(item);
    }
  });
  
  return result;
};

export const getItemsBySubCategory = async (subId: string): Promise<Item[]> => {
  const all = await getAllStoredItems();
  return all[subId] || [];
};

/**
 * Publica um item instantaneamente na IndexedDB
 */
export const saveItem = async (subId: string, item: Item) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ ...item, subId });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Remove um item definitivamente.
 * Além de deletar do store de itens, registra o ID no store de deletados
 * para garantir que amostras hardcoded (SAMPLE_ITEMS) também desapareçam.
 */
export const deleteItem = async (itemId: string) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME, DELETED_STORE], 'readwrite');
    
    // Deleta do armazém de itens
    transaction.objectStore(STORE_NAME).delete(itemId);
    
    // Registra como deletado permanentemente
    transaction.objectStore(DELETED_STORE).put({ id: itemId });
    
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// Visitantes continuam no localStorage por serem dados leves
export const getVisitorCount = (): number => {
  const count = localStorage.getItem(VISITOR_KEY);
  return count ? parseInt(count, 10) : 1240; 
};

export const incrementVisitorCount = (): number => {
  const current = getVisitorCount();
  const next = current + 1;
  localStorage.setItem(VISITOR_KEY, next.toString());
  return next;
};
