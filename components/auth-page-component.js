import { loginUser, registerUser, uploadImage } from "../api.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";

export function renderAuthPageComponent({ appEl, setUser, user, goToPage }) {
  let isLogin = true;
  let imageUrl = "";

  const renderForm = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
        <div class="page-header">
          <h1 class="logo" id="go-to-main-page">Instapro</h1>
        </div>
      </div>
      <div class="form">
        <h3 class="form-title">${isLogin ? "Войти" : "Регистрация"}</h3>
        <div class="form-inputs">
          ${
            isLogin
              ? ""
              : `
                <div class="upload-image-container"></div>
                <input type="text" id="name-input" class="input" placeholder="Имя" />
              `
          }
          <input type="text" id="login-input" class="input" placeholder="Логин" />
          <input type="password" id="password-input" class="input" placeholder="Пароль" />
          <button class="button" id="login-button">${isLogin ? "Войти" : "Зарегистрироваться"}</button>
          <div class="form-footer">
            <p class="form-footer-title">
              ${isLogin ? "Нет аккаунта?" : "Есть аккаунт?"}
              <button class="link-button" id="toggle-button">
                ${isLogin ? "Зарегистрироваться." : "Войти."}
              </button>
            </p>
          </div>
          <span class="form-error" id="form-error"></span>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    const errorEl = appEl.querySelector("#form-error");

    if (!isLogin && uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange: (newImageUrl) => {
          imageUrl = newImageUrl;
        },
      });
    }

    // Обработчик для перехода на главную
    document.getElementById("go-to-main-page").addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });

    // Обработчик для кнопки входа/регистрации
    document.getElementById("login-button").addEventListener("click", () => {
      errorEl.textContent = "";

      if (isLogin) {
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;

        if (!login || !password) {
          errorEl.textContent = "Заполните все поля";
          return;
        }

        loginUser({ login, password })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            errorEl.textContent = error.message;
          });
      } else {
        const name = document.getElementById("name-input").value;
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;

        if (!name || !login || !password) {
          errorEl.textContent = "Заполните все поля";
          return;
        }

        if (!imageUrl) {
          errorEl.textContent = "Не выбрана фотография";
          return;
        }

        registerUser({ login, password, name, imageUrl })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            errorEl.textContent = error.message;
          });
      }
    });

    // Обработчик для переключения между входом и регистрацией
    document.getElementById("toggle-button").addEventListener("click", () => {
      isLogin = !isLogin;
      renderForm();
    });
  };

  renderForm();
}