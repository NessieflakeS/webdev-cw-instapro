export function showNotification(message, type = "info", duration = 5000) {
  // Создаем элемент уведомления
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Добавляем в тело документа
  document.body.appendChild(notification);

  // Анимация появления
  setTimeout(() => {
    notification.classList.add('notification-visible');
  }, 10);

  // Обработчик закрытия
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    hideNotification(notification);
  });

  // Автоматическое закрытие
  if (duration > 0) {
    setTimeout(() => {
      hideNotification(notification);
    }, duration);
  }

  return notification;
}

function hideNotification(notification) {
  notification.classList.remove('notification-visible');
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 300);
}

// Глобальная функция для показа ошибок
window.showError = (message) => {
  return showNotification(message, 'error');
};

// Глобальная функция для показа успеха
window.showSuccess = (message) => {
  return showNotification(message, 'success');
};

// Глобальная функция для показа информации
window.showInfo = (message) => {
  return showNotification(message, 'info');
};