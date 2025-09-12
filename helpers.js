export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage() {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage() {
  window.localStorage.removeItem("user");
}

// Функция для форматирования даты
export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days < 7) return `${days} д. назад`;
  
  return date.toLocaleDateString();
}

// Функция для показа уведомлений
export function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

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

  // Автоматическое закрытие через 5 секунд
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);

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

// Функция для показа ошибок
export function showError(message) {
  return showNotification(message, 'error');
}

// Функция для показа успешных уведомлений
export function showSuccess(message) {
  return showNotification(message, 'success');
}

// Функция для показа информационных уведомлений
export function showInfo(message) {
  return showNotification(message, 'info');
}

// Функция для подтверждения действий
export function confirmAction(message, confirmText = "Да", cancelText = "Отмена") {
  return new Promise((resolve) => {
    // Создаем overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    // Создаем модальное окно
    const modal = document.createElement("div");
    modal.style.cssText = `
      background: white;
      padding: 24px;
      border-radius: 8px;
      max-width: 400px;
      width: 90%;
      text-align: center;
    `;

    modal.innerHTML = `
      <p style="margin: 0 0 20px 0; font-size: 16px;">${message}</p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="button" id="confirm-cancel">${cancelText}</button>
        <button class="button secondary-button" id="confirm-ok">${confirmText}</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Обработчики событий
    const handleConfirm = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };

    const handleCancel = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };

    document.getElementById("confirm-ok").addEventListener("click", handleConfirm);
    document.getElementById("confirm-cancel").addEventListener("click", handleCancel);

    // Закрытие по клику на overlay
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        handleCancel();
      }
    });

    // Закрытие по ESC
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleCancel();
        document.removeEventListener("keydown", handleEscape);
      }
    };

    document.addEventListener("keydown", handleEscape);
  });
}

// Функция для проверки, является ли пользователь демо-пользователем
export function isDemoUser() {
  const user = getUserFromLocalStorage();
  return user && user.token && user.token.startsWith('demo-token-');
}