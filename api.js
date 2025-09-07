// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "nikandrov_danil";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

// Моки данных для демо-режима
const demoPosts = [
  {
    id: "post1",
    description: "Красивый закат на море 🌅",
    imageUrl: "https://picsum.photos/800/600?random=1",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: {
      id: "user1",
      name: "Анна Петрова",
      imageUrl: "https://i.pravatar.cc/150?img=1"
    },
    likes: [
      { userId: "user2" },
      { userId: "user3" }
    ],
    comments: [
      {
        id: "comment1",
        text: "Отличное фото!",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        user: {
          id: "user2",
          name: "Иван Сидоров",
          imageUrl: "https://i.pravatar.cc/150?img=2"
        }
      }
    ]
  },
  {
    id: "post2",
    description: "Горный поход был просто незабываем! 🏔️",
    imageUrl: "https://picsum.photos/800/600?random=2",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    user: {
      id: "user2",
      name: "Иван Сидоров",
      imageUrl: "https://i.pravatar.cc/150?img=2"
    },
    likes: [
      { userId: "user1" }
    ],
    comments: []
  },
  {
    id: "post3",
    description: "Кофе и хорошая книга - что может быть лучше? 📚☕",
    imageUrl: "https://picsum.photos/800/600?random=3",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    user: {
      id: "user3",
      name: "Мария Иванова",
      imageUrl: "https://i.pravatar.cc/150?img=3"
    },
    likes: [
      { userId: "user1" },
      { userId: "user2" }
    ],
    comments: [
      {
        id: "comment2",
        text: "Какая книга?",
        createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
        user: {
          id: "user1",
          name: "Анна Петрова",
          imageUrl: "https://i.pravatar.cc/150?img=1"
        }
      },
      {
        id: "comment3",
        text: "Читаю сейчас ту же!",
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        user: {
          id: "user2",
          name: "Иван Сидоров",
          imageUrl: "https://i.pravatar.cc/150?img=2"
        }
      }
    ]
  }
];

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

// Функция для проверки, является ли пользователь демо-пользователем
const isDemoUser = (token) => {
  return token && token.startsWith('Bearer demo-token-');
};

export function getPosts({ token }) {
  // Если это демо-пользователь, возвращаем тестовые данные
  if (isDemoUser(token)) {
    return Promise.resolve(demoPosts);
  }
  
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
  // Если это демо-пользователь, возвращаем тестовые данные
  if (isDemoUser(token)) {
    const userPosts = demoPosts.filter(post => post.user.id === userId);
    return Promise.resolve(userPosts);
  }
  
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
  // Если это демо-пользователь, имитируем успешное добавление
  if (isDemoUser(token)) {
    const user = JSON.parse(localStorage.getItem('user'));
    const newPost = {
      id: `post-${Date.now()}`,
      description,
      imageUrl,
      createdAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        imageUrl: user.imageUrl
      },
      likes: [],
      comments: []
    };
    
    // Добавляем пост в начало списка
    demoPosts.unshift(newPost);
    
    return Promise.resolve(newPost);
  }
  
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
  // Если это демо-пользователь, имитируем успешный лайк
  if (isDemoUser(token)) {
    const user = JSON.parse(localStorage.getItem('user'));
    const post = demoPosts.find(p => p.id === postId);
    
    if (post && !post.likes.some(like => like.userId === user.id)) {
      post.likes.push({ userId: user.id });
    }
    
    return Promise.resolve({});
  }
  
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
  // Если это демо-пользователь, имитируем успешный дизлайк
  if (isDemoUser(token)) {
    const user = JSON.parse(localStorage.getItem('user'));
    const post = demoPosts.find(p => p.id === postId);
    
    if (post) {
      post.likes = post.likes.filter(like => like.userId !== user.id);
    }
    
    return Promise.resolve({});
  }
  
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then(handleApiError)
    .then((response) => response.json());
}

// Функция для добавления комментария
export function addComment({ token, postId, text }) {
  // Если это демо-пользователь, имитируем успешное добавление комментария
  if (isDemoUser(token)) {
    const user = JSON.parse(localStorage.getItem('user'));
    const post = demoPosts.find(p => p.id === postId);
    
    if (post) {
      const newComment = {
        id: `comment-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          imageUrl: user.imageUrl
        }
      };
      
      if (!post.comments) {
        post.comments = [];
      }
      
      post.comments.push(newComment);
      
      return Promise.resolve(newComment);
    }
    
    return Promise.reject(new Error("Пост не найден"));
  }
  
  return fetch(`${postsHost}/${postId}/comments`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })
    .then(handleApiError)
    .then((response) => response.json());
}

// Функция для получения комментариев
export function getComments({ token, postId }) {
  // Если это демо-пользователь, возвращаем комментарии из тестовых данных
  if (isDemoUser(token)) {
    const post = demoPosts.find(p => p.id === postId);
    return Promise.resolve(post ? post.comments || [] : []);
  }
  
  return fetch(`${postsHost}/${postId}/comments`, {
    method: "GET",
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