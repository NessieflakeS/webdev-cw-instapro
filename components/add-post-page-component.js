import { renderUploadImageComponent } from "./upload-image-component.js";
import { uploadImage } from "../api.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
        <div class="page-header">
          <h1 class="logo" id="go-to-main-page">Instapro</h1>
          <button class="header-button logout-button">Выйти</button>
        </div>
      </div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <textarea id="description-input" class="input textarea" rows="4" placeholder="Описание фотографии"></textarea>
          <button class="button" id="add-button">Добавить</button>
          <span class="form-error" id="form-error"></span>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    const errorEl = appEl.querySelector("#form-error");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange: (newImageUrl) => {
          imageUrl = newImageUrl;
        },
      });
    }

    // Обработчик для кнопки "Добавить"
    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("description-input").value.trim();
      errorEl.textContent = "";

      if (!imageUrl) {
        errorEl.textContent = "Не выбрана фотография";
        return;
      }

      if (!description) {
        errorEl.textContent = "Добавьте описание фотографии";
        return;
      }

      // Показываем состояние загрузки
      document.getElementById("add-button").disabled = true;
      document.getElementById("add-button").textContent = "Добавляем...";

      onAddPostClick({ description, imageUrl });
    });

    // Обработчик для перехода на главную
    document.getElementById("go-to-main-page").addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });

    // Обработчик для выхода
    document.querySelector(".logout-button").addEventListener("click", () => {
      import("../index.js").then(module => {
        module.logout();
      });
    });
  };

  render();
}