// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "nikandrov_danil";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

// Функция для обработки ошибок API
const handleApiError = (response) => {
  if (response.status === 401) {
    throw new Error("Нет авторизации");
  }
  
  if (response.status === 404) {
    throw new Error("Ресурс не найден");
  }
  
  if (response.status >= 500) {
    throw new Error("Ошибка сервера");
  }
  
  return response;
};

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then(handleApiError)
    .then((response) => response.json())
    .then((data) => {
      return data.posts;
    });
}

// Функция для получения постов пользователя
export function getUserPosts({ token, userId }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then(handleApiError)
    .then((response) => response.json())
    .then((data) => {
      return data.posts;
    });
}

// Функция для добавления поста
export function addPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      description,
      imageUrl,
    }),
  })
    .then(handleApiError)
    .then((response) => response.json());
}

// Функция для лайка поста
export function likePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then(handleApiError)
    .then((response) => response.json());
}

// Функция для дизлайка поста
export function dislikePost({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then(handleApiError)
    .then((response) => response.json());
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  })
    .then(handleApiError)
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Такой пользователь уже существует");
      }
      return response.json();
    });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  })
    .then(handleApiError)
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Неверный логин или пароль");
      }
      return response.json();
    });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  })
    .then(handleApiError)
    .then((response) => response.json());
}