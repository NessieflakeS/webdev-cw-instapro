import { uploadImage } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";
import { showError, showSuccess } from "../helpers.js";

export const renderAddPostPageComponent = ({ appEl, onAddPostClick }) => {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="file-upload-image-conrainer">
              <div class="file-upload">
                <label for="file-upload" class="file-upload-label">
                  ${imageUrl ? `
                    <img src="${imageUrl}" class="file-upload-image" />
                  ` : `
                    Выберите фото
                  `}
                </label>
                <input type="file" id="file-upload" class="file-upload-input" />
              </div>
            </div>
            <textarea id="textarea-description" class="input textarea" placeholder="Описание"></textarea>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    document.getElementById("file-upload").addEventListener("change", () => {
      const file = document.getElementById("file-upload").files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        imageUrl = reader.result;
        render();
      };

      reader.onerror = (error) => {
        showError("Ошибка при чтении файла: " + error);
      };
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("textarea-description").value.trim();

      if (!imageUrl) {
        showError("Не выбрана фотография");
        return;
      }

      if (!description) {
        showError("Добавьте описание");
        return;
      }

      // Показываем уведомление о загрузке
      showSuccess("Пост загружается...");

      // Загружаем изображение на сервер и затем добавляем пост
      uploadImage({ file: document.getElementById("file-upload").files[0] })
        .then(data => {
          onAddPostClick({
            description: description,
            imageUrl: data.fileUrl,
          });
        })
        .catch(error => {
          showError(error.message);
        });
    });
  };

  render();
};

