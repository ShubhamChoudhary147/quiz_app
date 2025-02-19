import { openDB } from 'idb';

const initDB = async () => {
  const db = await openDB('quizDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('attempts')) {
        const store = db.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp');
      }
    },
  });
  return db;
};

export const saveAttempt = async (attempt) => {
  const db = await initDB();
  return db.add('attempts', {
    ...attempt,
    timestamp: new Date().toISOString(),
  });
};

export const getAttempts = async () => {
  const db = await initDB();
  return db.getAllFromIndex('attempts', 'timestamp');
};