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
        <p class="loading-text">Загрузка...</p>
      </div>
    </div>
  `;

  appEl.innerHTML = appHtml;

  if (user) {
    document.querySelector(".logout-button").addEventListener("click", () => {
      // Импортируем logout динамически чтобы избежать циклических зависимостей
      import("../index.js").then(module => {
        module.logout();
      });
    });
  }
}