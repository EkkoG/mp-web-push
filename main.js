// 注册 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

// 初始化 OneSignal
window.OneSignalDeferred = window.OneSignalDeferred || [];
OneSignalDeferred.push(async function(OneSignal) {
  await OneSignal.init({
    appId: "adb31f24-1631-450c-9ef8-7185aa47838a",
    notifyButton: {
      enable: true,
    },
    allowLocalhostAsSecureOrigin: true,
  });

  OneSignal.Notifications.requestPermission();

  OneSignal.Notifications.on('click', function(event) {
    console.log('Notification clicked:', event);
  });
});

// 展示消息
function showMessages() {
  const messages = JSON.parse(localStorage.getItem('pushMessages') || '[]');
  const ul = document.getElementById('messages');
  if (!ul) return;
  ul.innerHTML = '';
  messages.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    ul.appendChild(li);
  });
}
showMessages();

// 监听 storage 变化（多标签页同步）
window.addEventListener('storage', showMessages);

// 监听 Service Worker 消息
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'push') {
      const messages = JSON.parse(localStorage.getItem('pushMessages') || '[]');
      messages.unshift(event.data.message);
      localStorage.setItem('pushMessages', JSON.stringify(messages));
      showMessages();
    }
  });
} 