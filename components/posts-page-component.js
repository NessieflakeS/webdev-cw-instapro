import { likePost, dislikePost } from "../api.js";
import { user, goToPage } from "../index.js";
import { USER_POSTS_PAGE } from "../routes.js";

export const renderPostsPageComponent = ({ appEl, posts, isUserPage = false }) => {
  const postsHtml = posts.map((post) => {
    const isLiked = post.likes.some((like) => like.userId === user?._id);
    
    return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}" width="24" height="24">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${new Date(post.createdAt).toLocaleString()}
        </p>
      </li>
    `;
  }).join('');

  const pageTitle = isUserPage 
    ? `<div class="posts-user-header">
         <img src="${posts[0]?.user.imageUrl || ''}" class="posts-user-header__user-image">
         <p class="posts-user-header__user-name">${posts[0]?.user.name || 'Пользователь'}</p>
       </div>`
    : '';

  const appHtml = `
    <div class="page-container">
      <div class="header-container">
        <div class="page-header">
          <h1 class="logo" id="go-to-main-page">Instapro</h1>
          ${user ? `
            <button class="header-button add-post-button">Добавить пост</button>
            <button class="header-button logout-button">Выйти</button>
          ` : `
            <button class="header-button login-button">Войти</button>
          `}
        </div>
      </div>
      ${pageTitle}
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  // Обработчик для перехода на главную страницу
  document.getElementById("go-to-main-page").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  // Обработчики для кнопок в шапке
  if (user) {
    document.querySelector(".add-post-button").addEventListener("click", () => {
      goToPage(ADD_POSTS_PAGE);
    });

    document.querySelector(".logout-button").addEventListener("click", () => {
      // Функция logout импортируется из index.js
      import("../index.js").then(module => {
        module.logout();
      });
    });
  } else {
    document.querySelector(".login-button").addEventListener("click", () => {
      goToPage(AUTH_PAGE);
    });
  }

  // Обработчики для переходов на страницу пользователя
  document.querySelectorAll(".post-header").forEach((header) => {
    header.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: header.dataset.userId,
      });
    });
  });

  // Обработчики для лайков
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (!user) {
        alert("Для лайков необходимо авторизоваться");
        goToPage(AUTH_PAGE);
        return;
      }

      const postId = button.dataset.postId;
      const post = posts.find(p => p.id === postId);
      const isLiked = post.likes.some((like) => like.userId === user._id);
      
      if (isLiked) {
        dislikePost({ token: `Bearer ${user.token}`, postId })
          .then(() => {
            // Обновляем состояние лайка
            post.likes = post.likes.filter(like => like.userId !== user._id);
            renderPostsPageComponent({ appEl, posts, isUserPage });
          })
          .catch((error) => {
            console.error(error);
            alert("Ошибка при снятии лайка");
          });
      } else {
        likePost({ token: `Bearer ${user.token}`, postId })
          .then(() => {
            // Обновляем состояние лайка
            post.likes.push({ userId: user._id });
            renderPostsPageComponent({ appEl, posts, isUserPage });
          })
          .catch((error) => {
            console.error(error);
            alert("Ошибка при установке лайка");
          });
      }
    });
  });
};