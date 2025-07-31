// main.js

// 导入 Firebase SDK 模块（通过 CDN 使用 ES Module 方式）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 你的 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAz3wyKwZZPq0J2QYv5AMsJPz2GhKdv_Ec",
  authDomain: "project-outline-af2d4.firebaseapp.com",
  databaseURL: "https://project-outline-af2d4-default-rtdb.firebaseio.com",
  projectId: "project-outline-af2d4",
  storageBucket: "project-outline-af2d4.firebasestorage.app",
  messagingSenderId: "55878777475",
  appId: "1:55878777475:web:e72932e506577bcc45b9b6"
};

// 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 查找页面上所有 .editor 区块
document.querySelectorAll('.editor').forEach(editor => {
  const key = editor.getAttribute('data-key');      // 每个编辑器的唯一标识
  const dbRef = ref(database, 'sections/' + key);   // Firebase 中对应路径

  // 初次加载内容（只在页面打开时执行一次）
  onValue(dbRef, snapshot => {
    const data = snapshot.val();
    if (data && editor.innerHTML !== data) {
      editor.innerHTML = data;
    }
  });

  // 每次输入都保存到 Firebase
  editor.addEventListener('input', () => {
    set(dbRef, editor.innerHTML);
  });

  // 支持粘贴图片
  editor.addEventListener('paste', function (event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          editor.appendChild(img);
          set(dbRef, editor.innerHTML); // 添加图片后再次保存
        };
        reader.readAsDataURL(blob);
      }
    }
  });
});
