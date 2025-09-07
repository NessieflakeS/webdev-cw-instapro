import { loginUser, registerUser, uploadImage } from "../api.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";

// Функция валидации формы
const validateForm = (isLogin, name, login, password) => {
  if (!isLogin && !name.trim()) {
    return "Введите имя";
  }
  
  if (!login.trim()) {
    return "Введите логин";
  }
  
  if (password.length < 3) {
    return "Пароль должен содержать минимум 3 символа";
  }
  
  return null;
};

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

      const name = !isLogin ? document.getElementById("name-input").value : "";
      const login = document.getElementById("login-input").value;
      const password = document.getElementById("password-input").value;
      
      // Валидация
      const validationError = validateForm(isLogin, name, login, password);
      if (validationError) {
        errorEl.textContent = validationError;
        return;
      }
      
      // Показываем индикатор загрузки
      const loginButton = document.getElementById("login-button");
      loginButton.disabled = true;
      loginButton.textContent = "Загрузка...";

      if (isLogin) {
        loginUser({ login, password })
          .then((userData) => {
            setUser(userData.user);
          })
          .catch((error) => {
            errorEl.textContent = error.message;
            loginButton.disabled = false;
            loginButton.textContent = isLogin ? "Войти" : "Зарегистрироваться";
          });
      } else {
        registerUser({ login, password, name, imageUrl })
          .then((userData) => {
            setUser(userData.user);
          })
          .catch((error) => {
            errorEl.textContent = error.message;
            loginButton.disabled = false;
            loginButton.textContent = isLogin ? "Войти" : "Зарегистрироваться";
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