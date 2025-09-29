import { user } from "../index.js";
import { goToPage } from "../index.js";
import { logout } from "../index.js";

export const renderHeaderComponent = ({ element }) => {
  element.innerHTML = `
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
  `;

  // Обработчики событий для заголовка
  const logoElement = element.querySelector('.logo');
  if (logoElement) {
    logoElement.addEventListener('click', () => {
      goToPage('posts');
    });
  }

  if (element.querySelector('#add-post-button')) {
    element.querySelector('#add-post-button').addEventListener('click', () => {
      goToPage('add-post');
    });
  }

  if (element.querySelector('#logout-button')) {
    element.querySelector('#logout-button').addEventListener('click', () => {
      logout();
    });
  }

  if (element.querySelector('#login-button')) {
    element.querySelector('#login-button').addEventListener('click', () => {
      goToPage('auth');
    });
  }

  if (element.querySelector('#register-button')) {
    element.querySelector('#register-button').addEventListener('click', () => {
      goToPage('auth');
    });
  }
};
