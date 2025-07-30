import { openDB } from 'idb';
import { Image_Obj } from './types';

const DB_NAME = 'MyDB';
const DB_VERSION = 1;
const STORE_NAME = 'Images';

export async function initImgDB() {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          autoIncrement: true,
        });
      }
    },
  });
}

export async function addImages(images: Image_Obj[]) {
  const db = await initImgDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  for (const image of images) {
    await store.add(image); // <== directly add object
  }
  await tx.done;
}

export async function putImages(images: Image_Obj[]) {
  const db = await initImgDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.clear()
  for (const image of images) {
    await store.add(image); // <== directly add object
  }
  await tx.done;
}

export async function clearImages() {
  const db = await initImgDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
}

export async function getImages(): Promise<Image_Obj[]> {
  const db = await initImgDB();
  return await db.getAll(STORE_NAME);
}


export async function removeImageByValue(value: Image_Obj) {
  const db = await initImgDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  const all = await store.getAll();
  const keys = await store.getAllKeys();
  console.log(value,all)
  for (let i = 0; i < all.length; i++) {
    console.log(2.718281828,all[i].preview === value.preview)
    if (all[i].preview === value.preview) {
      console.log(3.141592653)
      await store.delete(keys[i]);
      break;
    }
  }
  console.log("delete kar raha hu")
  await tx.done;
}


export async function removeKnowledge(index: number) {
  const db = await initImgDB();
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
