// Load saved content from localStorage
document.querySelectorAll('.editor').forEach(editor => {
  const key = editor.getAttribute('data-key');
  const savedValue = localStorage.getItem(key);
  if (savedValue) editor.innerHTML = savedValue;

  // Save content on input
  editor.addEventListener('input', () => {
    localStorage.setItem(key, editor.innerHTML);
  });

  // Handle paste event for images
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
          localStorage.setItem(key, editor.innerHTML);
        };
        reader.readAsDataURL(blob);
      }
    }
  });
});
