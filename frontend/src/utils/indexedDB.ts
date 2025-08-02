// import { openDB } from 'idb';
// import { Knowledge } from './types';

// const DB_NAME = 'IntroAppDB';
// const STORE_NAME = 'ImagePreviews';

// export async function initDB() {
//   return openDB(DB_NAME, 1, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains(STORE_NAME)) {
//         db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
//       }
//     },
//   });
// }



// export async function addPreviews(previews: string[]) {
//   const db = await initDB();
//   const tx = db.transaction(STORE_NAME, 'readwrite');
//   const store = tx.objectStore(STORE_NAME);
//   for (const preview of previews) {
//     await store.add({ preview });
//   }
//   await tx.done;
// }



// export async function clearPreviews() {
//   const db = await initDB();
//   const tx = db.transaction(STORE_NAME, 'readwrite');
//   await tx.objectStore(STORE_NAME).clear();
//   await tx.done;
// }




// export async function getPreviews(): Promise<string[]> {
//   const db = await initDB();
//   const all = await db.getAll(STORE_NAME);
//   return all.map((item) => item.preview);
// }



// export async function removePreviewByValue(value: string) {
//   const db = await initDB();
//   const tx = db.transaction(STORE_NAME, 'readwrite');
//   const store = tx.objectStore(STORE_NAME);
//   const all = await store.getAll();
//   const keys = await store.getAllKeys();

//   for (let i = 0; i < all.length; i++) {
//     if (all[i].preview === value) {
//       await store.delete(keys[i]);
//       break;
//     }
//   }

//   await tx.done;
// }



// export async function removePreview(index: number) {
//   const db = await initDB();
//   const tx = db.transaction(STORE_NAME, 'readwrite');
//   const store = tx.objectStore(STORE_NAME);

//   const all = await store.getAll(); // get all current items
//   const keys = await store.getAllKeys(); // get all corresponding keys

//   if (index >= 0 && index < keys.length) {
//     const keyToDelete = keys[index];
//     await store.delete(keyToDelete);
//   }

//   await tx.done;
// }



// knowledge-db.ts
import { openDB } from 'idb';
import { Knowledge } from './types';

const DB_NAME = 'MyDB';
const DB_VERSION = 1;
const STORE_NAME = 'Images';

export async function initDB() {
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

// export async function addKnowledge(books: Knowledge[]) {
//   const db = await initDB();
//   const tx = db.transaction(STORE_2_NAME, 'readwrite');
//   const store = tx.objectStore(STORE_2_NAME);
//   for (const knowledge of books) {
//     await store.add(knowledge); // <== directly add object
//   }
//   await tx.done;
// }

// export async function clearKnowledge() {
//   const db = await initDB();
//   const tx = db.transaction(STORE_2_NAME, 'readwrite');
//   await tx.objectStore(STORE_2_NAME).clear();
//   await tx.done;
// }

// export async function getKnowledge(): Promise<Knowledge[]> {
//   const db = await initDB();
//   return await db.getAll(STORE_2_NAME);
// }


// export async function removeKnowledgeByValue(value: Knowledge) {
//   const db = await initDB();
//   const tx = db.transaction(STORE_2_NAME, 'readwrite');
//   const store = tx.objectStore(STORE_2_NAME);

//   const all = await store.getAll();
//   const keys = await store.getAllKeys();

//   for (let i = 0; i < all.length; i++) {
//     if (all[i] === value) {
//       await store.delete(keys[i]);
//       break;
//     }
//   }

//   await tx.done;
// }




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
export async function removeKnowledge(index: number) {
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
export async function addImages(images: Knowledge[]) {
  const db = await initImgDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  for (const image of images) {
    await store.add(image); // <== directly add object
  }
  await tx.done;
}

export async function putImages(images: Knowledge[]) {
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

export async function getImages(): Promise<Knowledge[]> {
  const db = await initImgDB();
  return await db.getAll(STORE_NAME);
}