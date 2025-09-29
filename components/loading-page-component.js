export const renderLoadingPageComponent = ({ appEl, user, goToPage }) => {
  const appHtml = `
    <div class="page-container">
      <div class="header-container">
        <div class="page-header">
          <h1 class="logo">Instapro</h1>
          <div>
            ${user ? `
              <button class="header-button add-post-button" id="add-post-button">Добавить пост</button>
              <button class="header-button logout-button" id="logout-button">Выйти</button>
            ` : `
              <button class="header-button" id="login-button">Войти</button>
              <button class="header-button" id="register-button">Зарегистрироваться</button>
            `}
          </div>
        </div>
      </div>
      <div class="loading-page">
        <div class="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p class="loading-text">Загрузка...</p>
      </div>
    </div>
  `;

  appEl.innerHTML = appHtml;

  // Настраиваем обработчики событий для заголовка
  const logoElement = document.querySelector('.logo');
  if (logoElement) {
    logoElement.addEventListener('click', () => {
      goToPage('posts');
    });
  }

  if (document.getElementById('add-post-button')) {
    document.getElementById('add-post-button').addEventListener('click', () => {
      goToPage('add-post');
    });
  }

  if (document.getElementById('logout-button')) {
    document.getElementById('logout-button').addEventListener('click', () => {
      // Функция logout должна быть импортирована из index.js
      if (window.logout) {
        window.logout();
      }
    });
  }

  if (document.getElementById('login-button')) {
    document.getElementById('login-button').addEventListener('click', () => {
      goToPage('auth');
    });
  }

  if (document.getElementById('register-button')) {
    document.getElementById('register-button').addEventListener('click', () => {
      goToPage('auth');
    });
  }
};