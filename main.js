// main.js

// 初始化 Firebase（compat 方式）
const firebaseConfig = {
  apiKey: "AIzaSyAz3wyKwZZPq0J2QYv5AMsJPz2GhKdv_Ec",
  authDomain: "project-outline-af2d4.firebaseapp.com",
  databaseURL: "https://project-outline-af2d4-default-rtdb.firebaseio.com",
  projectId: "project-outline-af2d4",
  storageBucket: "project-outline-af2d4.firebasestorage.app",
  messagingSenderId: "55878777475",
  appId: "1:55878777475:web:e72932e506577bcc45b9b6"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 查找所有 .editor
document.querySelectorAll('.editor').forEach(editor => {
  const key = editor.getAttribute('data-key');
  const dbRef = database.ref('sections/' + key);

  // 初次加载内容
  dbRef.on('value', snapshot => {
    const data = snapshot.val();
    if (data && editor.innerHTML !== data) {
      editor.innerHTML = data;
    }
  });

  // 实时保存输入内容
  editor.addEventListener('input', () => {
    dbRef.set(editor.innerHTML);
  });

  // 支持图片粘贴
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
          dbRef.set(editor.innerHTML);
        };
        reader.readAsDataURL(blob);
      }
    }
  });
});
