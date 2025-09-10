


  if (user) {
    document.querySelector(".logout-button").addEventListener("click", () => {
      // Импортируем logout динамически чтобы избежать циклических зависимостей
      import("../index.js").then(module => {
        module.logout();
      });
    });
  }
