import { loginUser, registerUser, uploadImage } from "../api.js";
import { showError, showSuccess } from "../helpers.js";
import { demoUsers, loginDemoUser } from "../demo-users.js";

export const renderAuthPageComponent = ({ appEl, setUser, user }) => {
  let isLogin = true;

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container">
          <div class="page-header">
            <h1 class="logo">Instapro</h1>
          </div>
        </div>
        <div class="form">
          <h3 class="form-title">${isLogin ? "Вход" : "Регистрация"}</h3>
          <div class="form-inputs">
            ${!isLogin ? `
              <input type="text" id="name-input" class="input" placeholder="Имя" />
            ` : ""}
            <input type="text" id="login-input" class="input" placeholder="Логин" />
            <input type="password" id="password-input" class="input" placeholder="Пароль" />
            ${!isLogin ? `
              <div class="file-upload">
                <label for="avatar-upload" class="file-upload-label">
                  Выберите аватар
                </label>
                <input type="file" id="avatar-upload" class="file-upload-input" accept="image/*" />
              </div>
              <div id="avatar-preview" style="margin-top: 10px;"></div>
            ` : ""}
            <button class="button" id="login-button">${isLogin ? "Войти" : "Зарегистрироваться"}</button>
            <div class="form-footer">
              <p class="form-footer-title">
                ${isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
                <button class="link-button" id="toggle-auth-button">
                  ${isLogin ? "Зарегистрируйтесь" : "Войдите"}
                </button>
              </p>
            </div>
          </div>
        </div>
        
        <div class="demo-users">
          <p class="demo-users-title">Или войдите как тестовый пользователь:</p>
          <div class="demo-users-list">
            ${demoUsers.map(demoUser => `
              <button class="demo-user-button" data-user-id="${demoUser.id}">
                <img src="${demoUser.imageUrl}" class="demo-user-avatar" onerror="window.handleImageError(this)">
                <span>${demoUser.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    // Обработчики событий
    document.getElementById("toggle-auth-button").addEventListener("click", () => {
      isLogin = !isLogin;
      render();
    });

    document.getElementById("login-button").addEventListener("click", () => {
      if (isLogin) {
        handleLogin();
      } else {
        handleRegister();
      }
    });

    // Обработчики для тестовых пользователей
    document.querySelectorAll('.demo-user-button').forEach(button => {
      button.addEventListener('click', () => {
        const userId = button.dataset.userId;
        const demoUser = loginDemoUser(userId);
        if (demoUser) {
          setUser(demoUser);
          showSuccess(`Добро пожаловать, ${demoUser.name}!`);
        }
      });
    });

    // Обработчик загрузки аватара (только для регистрации)
    if (!isLogin) {
      const avatarInput = document.getElementById("avatar-upload");
      const avatarPreview = document.getElementById("avatar-preview");

      avatarInput.addEventListener("change", () => {
        const file = avatarInput.files[0];
        if (!file) {
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          avatarPreview.innerHTML = `
            <img src="${reader.result}" style="max-width: 100px; max-height: 100px; border-radius: 50%;" />
          `;
        };

        reader.onerror = (error) => {
          showError("Ошибка при чтении файла: " + error);
        };
      });
    }
  };

  const handleLogin = () => {
    const login = document.getElementById("login-input").value;
    const password = document.getElementById("password-input").value;

    if (!login) {
      showError("Введите логин");
      return;
    }

    if (!password) {
      showError("Введите пароль");
      return;
    }

    loginUser({ login, password })
      .then((userData) => {
        setUser(userData.user);
        showSuccess("Вход выполнен успешно!");
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  const handleRegister = () => {
    const name = document.getElementById("name-input").value;
    const login = document.getElementById("login-input").value;
    const password = document.getElementById("password-input").value;
    const avatarFile = document.getElementById("avatar-upload").files[0];

    if (!name) {
      showError("Введите имя");
      return;
    }

    if (!login) {
      showError("Введите логин");
      return;
    }

    if (!password) {
      showError("Введите пароль");
      return;
    }

    if (!avatarFile) {
      showError("Выберите аватар");
      return;
    }

    // Сначала загружаем аватар
    uploadImage({ file: avatarFile })
      .then((data) => {
        // Затем регистрируем пользователя
        return registerUser({
          name,
          login,
          password,
          imageUrl: data.fileUrl,
        });
      })
      .then((userData) => {
        setUser(userData.user);
        showSuccess("Регистрация выполнена успешно!");
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  render();
};