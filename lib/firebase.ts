import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnncFLzJ9R-G0GOmljI4zsf-c5Ati_mFc",
  authDomain: "military-friends-93da6.firebaseapp.com",
  projectId: "military-friends-93da6",
  storageBucket: "military-friends-93da6.appspot.com",
  messagingSenderId: "959424394606",
  appId: "1:959424394606:web:2e48907cbdd005abd47d7f",
  measurementId: "G-D9MR1JJ47E",
};

// Firebase 앱이 이미 초기화되지 않았다면 초기화합니다.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase 인증 및 데이터베이스 서비스를 초기화합니다.
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);

export { app, auth, database, db };
