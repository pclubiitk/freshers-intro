import { openDB } from 'idb';

const DB_NAME = 'IntroAppDB';
const STORE_NAME = 'ImagePreviews';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}



export async function addPreviews(previews: string[]) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  for (const preview of previews) {
    await store.add({ preview });
  }
  await tx.done;
}



export async function clearPreviews() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
}




export async function getPreviews(): Promise<string[]> {
  const db = await initDB();
  const all = await db.getAll(STORE_NAME);
  return all.map((item) => item.preview);
}



export async function removePreviewByValue(value: string) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const all = await store.getAll();
  const keys = await store.getAllKeys();

  for (let i = 0; i < all.length; i++) {
    if (all[i].preview === value) {
      await store.delete(keys[i]);
      break;
    }
  }

  await tx.done;
}



export async function removePreview(index: number) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  const all = await store.getAll(); // get all current items
  const keys = await store.getAllKeys(); // get all corresponding keys

  if (index >= 0 && index < keys.length) {
    const keyToDelete = keys[index];
    await store.delete(keyToDelete);
  }

  await tx.done;
}
