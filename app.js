// Firebase SDKを読み込む（index.html内でCDNから読み込みます）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// 1. Firebase初期化
const firebaseConfig = {
  apiKey: "AIzaSyDZzRY_IKXfzu4zPgTrLTk0e4IPoqndVPY",
  authDomain: "anime-watchlist-7b37e.firebaseapp.com",
  projectId: "anime-watchlist-7b37e",
  storageBucket: "anime-watchlist-7b37e.firebasestorage.app",
  messagingSenderId: "863081759523",
  appId: "1:863081759523:web:5971df5e1f527fc1ab0296"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. DOM要素
const form = document.getElementById('animeForm');
const list = document.getElementById('animeList');

// 3. Firestoreのコレクション指定
const colRef = collection(db, "animeList");

// 4. フォーム送信時にFirestoreに追加
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const comment = document.getElementById('comment').value.trim();
  const name = document.getElementById('name').value.trim();

  if (title === "") return;

  try {
    await addDoc(colRef, {
      title,
      comment,
      name,
      createdAt: new Date()
    });
    form.reset();
  } catch (err) {
    console.error("Error adding document: ", err);
  }
});

// 5. リアルタイムでデータ取得・表示
const q = query(colRef, orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
  list.innerHTML = "";
  snapshot.forEach(docSnap => {
    const item = docSnap.data();
    const li = document.createElement('li');
    const nameText = item.name ? `（by ${item.name}）` : "";
    li.innerHTML = `<strong>${item.title}</strong> - ${item.comment} ${nameText} 
      <button data-id="${docSnap.id}" class="delete-btn">削除</button>`;
    list.appendChild(li);
  });

  // 削除ボタンにイベント追加
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      try {
        await deleteDoc(doc(db, "animeList", id));
      } catch (err) {
        console.error("Error deleting document: ", err);
      }
    });
  });
});
