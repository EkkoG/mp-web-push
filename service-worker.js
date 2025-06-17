self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { notification: { title: '推送', body: event.data.text() } };
    }
  }
  const message = data.notification ? data.notification.body : '收到一条推送';

  // 通知所有客户端
  event.waitUntil(
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'push', message });
      });
    })
  );

  // 展示通知
  event.waitUntil(
    self.registration.showNotification(
      data.notification && data.notification.title ? data.notification.title : '推送',
      {
        body: message,
        icon: data.notification && data.notification.icon ? data.notification.icon : undefined
      }
    )
  );
}); 