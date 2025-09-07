import { logout } from "../index.js";

export function renderLoadingPageComponent({ appEl, user, goToPage }) {
  const appHtml = `
    <div class="page-container">
      <div class="header-container">
        <div class="page-header">
          <h1 class="logo">Instapro</h1>
          ${user ? `<button class="header-button logout-button">Выйти</button>` : ''}
        </div>
      </div>
      <div class="loading-page">
        <div class="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p>Загрузка...</p>
      </div>
    </div>
  `;

  appEl.innerHTML = appHtml;

  if (user) {
    document.querySelector(".logout-button").addEventListener("click", () => {
      logout();
    });
  }
}