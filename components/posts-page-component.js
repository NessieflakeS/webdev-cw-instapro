import { likePost, dislikePost, addComment, getComments } from "../api.js";
import { user, goToPage, logout } from "../index.js";
import { USER_POSTS_PAGE, ADD_POSTS_PAGE, AUTH_PAGE, POSTS_PAGE } from "../routes.js";
import { formatDate, showSuccess, showError } from "../helpers.js";

// Глобальные переменные для пагинации
let isLoadingMore = false;
let currentPage = 1;
let hasMorePosts = true;
let scrollToTopButton = null;

// Функция для загрузки дополнительных постов
const loadMorePosts = async () => {
  if (isLoadingMore || !hasMorePosts) return;
  
  isLoadingMore = true;
  
  try {
    // Показываем индикатор загрузки
    const postsContainer = document.querySelector('.posts');
    if (!postsContainer) return;
    
    const loader = document.createElement('div');
    loader.className = 'posts-loader';
    loader.innerHTML = '<div class="loader"><div></div><div></div><div></div></div>';
    postsContainer.appendChild(loader);

    // Имитируем загрузку новых постов
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Для демонстрации просто отключаем дальнейшую загрузку
    hasMorePosts = false;
    
    // Показываем сообщение, что посты закончились
    const noMorePosts = document.createElement('div');
    noMorePosts.className = 'no-more-posts';
    noMorePosts.textContent = 'Вы посмотрели все посты';
    
    // Удаляем лоадер и добавляем сообщение
    if (postsContainer.contains(loader)) {
      postsContainer.removeChild(loader);
    }
    postsContainer.appendChild(noMorePosts);
    
  } catch (error) {
    console.error("Ошибка при загрузке постов:", error);
    showError("Не удалось загрузить дополнительные посты");
  } finally {
    isLoadingMore = false;
  }
};

// Функция для проверки, достигнут ли низ страницы
const checkScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100 && hasMorePosts) {
    loadMorePosts();
  }
  
  // Показываем/скрываем кнопку "Наверх"
  toggleScrollButton();
};

// Показываем/скрываем кнопку "Наверх"
const toggleScrollButton = () => {
  if (!scrollToTopButton) return;
  
  if (window.pageYOffset > 300) {
    scrollToTopButton.style.opacity = '1';
    scrollToTopButton.style.visibility = 'visible';
  } else {
    scrollToTopButton.style.opacity = '0';
    scrollToTopButton.style.visibility = 'hidden';
  }
};

// Функция для создания кнопки "Наверх"
const createScrollToTopButton = () => {
  if (scrollToTopButton) return;
  
  scrollToTopButton = document.createElement('button');
  scrollToTopButton.className = 'scroll-to-top';
  scrollToTopButton.innerHTML = '↑';
  scrollToTopButton.setAttribute('aria-label', 'Наверх');
  scrollToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #565eef;
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  `;

  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(scrollToTopButton);
};

// Функция для обработки отправки комментария
const handleCommentSubmit = async (postId, textarea, button) => {
  const text = textarea.value.trim();
  
  if (!text) {
    showError("Введите текст комментария");
    return;
  }
  
  try {
    button.disabled = true;
    button.textContent = "Отправка...";
    
    // В реальном приложении здесь был бы вызов API
    // await addComment({ token: `Bearer ${user.token}`, postId, text });
    
    // Имитируем успешную отправку
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Очищаем поле ввода
    textarea.value = '';
    showSuccess("Комментарий добавлен");
    
    // В реальном приложении здесь бы обновлялись комментарии
    // const comments = await getComments({ token: `Bearer ${user.token}`, postId });
    // updateCommentsUI(postId, comments);
    
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
    showError("Не удалось добавить комментарий");
  } finally {
    button.disabled = false;
    button.textContent = "Отправить";
  }
};

// Функция для обновления интерфейса комментариев
const updateCommentsUI = (postId, comments) => {
  const commentsContainer = document.getElementById(`comments-${postId}`);
  if (commentsContainer) {
    commentsContainer.innerHTML = comments.map(comment => `
      <div class="comment">
        <strong>${comment.user.name}:</strong> ${comment.text}
        <span class="comment-date">${formatDate(comment.createdAt)}</span>
      </div>
    `).join('');
  }
};

export const renderPostsPageComponent = ({ appEl, posts, isUserPage = false }) => {
  // Сбросим состояние пагинации при первой загрузке
  if (currentPage === 1) {
    isLoadingMore = false;
    hasMorePosts = true;
  }
  
  const postsHtml = posts.map((post) => {
    const isLiked = post.likes && post.likes.some((like) => like.userId === user?._id);
    
    // Формируем HTML для комментариев
    const commentsHtml = post.comments && post.comments.length > 0 
      ? post.comments.slice(0, 3).map(comment => `
          <div class="comment">
            <strong>${comment.user.name}:</strong> ${comment.text}
            <span class="comment-date">${formatDate(comment.createdAt)}</span>
          </div>
        `).join('')
      : '<div class="no-comments">Пока нет комментариев</div>';
    
    return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image" alt="Аватар ${post.user.name}">
          <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}" loading="lazy" alt="Пост пользователя ${post.user.name}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}" width="24" height="24" alt="Лайк">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes ? post.likes.length : 0}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        
        <!-- Секция комментариев -->
        <div class="post-comments">
          <div class="comments-list" id="comments-${post.id}">
            ${commentsHtml}
          </div>
          
          ${user ? `
            <div class="add-comment">
              <textarea class="comment-input" placeholder="Добавить комментарий..." rows="1"></textarea>
              <button class="button comment-button" data-post-id="${post.id}">Отправить</button>
            </div>
          ` : ''}
        </div>
        
        <p class="post-date">
          ${formatDate(post.createdAt)}
        </p>
      </li>
    `;
  }).join('');

  const pageTitle = isUserPage && posts.length > 0
    ? `<div class="posts-user-header">
         <img src="${posts[0].user.imageUrl}" class="posts-user-header__user-image" alt="Аватар ${posts[0].user.name}">
         <p class="posts-user-header__user-name">${posts[0].user.name}</p>
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
        ${posts.length > 0 ? postsHtml : '<p class="no-posts">Пока нет постов</p>'}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  // Обработчик для перехода на главную страницу
  const goToMainPageEl = document.getElementById("go-to-main-page");
  if (goToMainPageEl) {
    goToMainPageEl.addEventListener("click", () => {
      goToPage(POSTS_PAGE);
    });
  }

  // Обработчики для кнопок в шапке
  if (user) {
    const addPostButton = document.querySelector(".add-post-button");
    if (addPostButton) {
      addPostButton.addEventListener("click", () => {
        goToPage(ADD_POSTS_PAGE);
      });
    }

    const logoutButton = document.querySelector(".logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        logout();
      });
    }
  } else {
    const loginButton = document.querySelector(".login-button");
    if (loginButton) {
      loginButton.addEventListener("click", () => {
        goToPage(AUTH_PAGE);
      });
    }
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
        showError("Для лайков необходимо авторизоваться");
        goToPage(AUTH_PAGE);
        return;
      }

      const postId = button.dataset.postId;
      const post = posts.find(p => p.id === postId);
      const isLiked = post.likes.some((like) => like.userId === user._id);
      
      // Показываем состояние загрузки
      button.disabled = true;
      
      if (isLiked) {
        dislikePost({ token: `Bearer ${user.token}`, postId })
          .then(() => {
            // Обновляем состояние лайка
            post.likes = post.likes.filter(like => like.userId !== user._id);
            renderPostsPageComponent({ appEl, posts, isUserPage });
          })
          .catch((error) => {
            console.error(error);
            showError("Ошибка при снятии лайка");
            button.disabled = false;
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
            showError("Ошибка при установке лайка");
            button.disabled = false;
          });
      }
    });
  });

  // Обработчики для комментариев
  document.querySelectorAll('.comment-button').forEach(button => {
    button.addEventListener('click', () => {
      const postId = button.dataset.postId;
      const textarea = button.previousElementSibling;
      handleCommentSubmit(postId, textarea, button);
    });
  });

  // Обработчик Enter для отправки комментариев
  document.querySelectorAll('.comment-input').forEach(textarea => {
    textarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const button = textarea.nextElementSibling;
        const postId = button.dataset.postId;
        handleCommentSubmit(postId, textarea, button);
      }
    });
  });

  // Создаем кнопку "Наверх"
  createScrollToTopButton();
  
  // Добавляем обработчик скролла
  window.addEventListener('scroll', checkScroll);
  
  // Проверяем начальное состояние кнопки "Наверх"
  toggleScrollButton();
  
  // Возвращаем функцию очистки для удаления обработчиков при размонтировании
  return () => {
    window.removeEventListener('scroll', checkScroll);
    if (scrollToTopButton && document.body.contains(scrollToTopButton)) {
      document.body.removeChild(scrollToTopButton);
      scrollToTopButton = null;
    }
  };
};