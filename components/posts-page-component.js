import { goToPage } from "../index.js";
import { formatDate, showError, showSuccess } from "../helpers.js";
import { likePost, dislikePost, addComment } from "../api.js";
import { user } from "../index.js";

export const renderPostsPageComponent = ({ appEl, posts, isUserPage = false }) => {
  console.log("Активный пользователь: ", user);
  console.log("Посты для отображения: ", posts);

  // Функция для создания кнопки "Наверх"
  const setupScrollToTopButton = () => {
    let scrollToTopButton = null;

    const checkScroll = () => {
      if (window.scrollY > 300) {
        if (!scrollToTopButton) {
          scrollToTopButton = document.createElement('button');
          scrollToTopButton.innerHTML = '↑ Наверх';
          scrollToTopButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #565eef;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 100;
          `;
          scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
          document.body.appendChild(scrollToTopButton);
        }
      } else if (scrollToTopButton) {
        document.body.removeChild(scrollToTopButton);
        scrollToTopButton = null;
      }
    };

    window.addEventListener('scroll', checkScroll);
    
    // Возвращаем функцию очистки
    return () => {
      window.removeEventListener('scroll', checkScroll);
      if (scrollToTopButton && document.body.contains(scrollToTopButton)) {
        document.body.removeChild(scrollToTopButton);
      }
    };
  };

  // HTML для страницы с постами
  const postsHtml = `
    <div class="page-container">
      <div class="header-container">
        ${isUserPage ? `
          <div class="posts-user-header">
            <img class="posts-user-header__user-image" src="${posts[0]?.user.imageUrl || './assets/images/user-placeholder.png'}" onerror="window.handleImageError(this)" />
            <p class="posts-user-header__user-name">${posts[0]?.user.name || 'Пользователь'}</p>
          </div>
        ` : `
          <div class="page-header">
            <h1 class="logo">Instapro</h1>
            <div>
              ${user ? `
                <button class="header-button add-post-button" id="add-post-button">Добавить пост</button>
                <button class="header-button logout-button" id="logout-button">Выйти</button>
              ` : `
                <button class="header-button" id="login-button">Войти</button>
                <button class="header-button" id="register-button">Зарегистрироваться</button>
              `}
            </div>
          </div>
        `}
      </div>
      <ul class="posts">
        ${posts.length > 0 ? posts.map(post => `
          <li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image" onerror="window.handleImageError(this)">
              <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}" onerror="this.src='./assets/images/image-placeholder.png'; this.onerror=null;">
            </div>
            <div class="post-likes">
              <button class="like-button" data-post-id="${post.id}" data-is-liked="${post.isLiked}">
                <img src="${post.isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}" alt="${post.likes.length}">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${post.likes.length}</strong>
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.description}
            </p>
            <p class="post-date">${formatDate(post.createdAt)}</p>
            <div class="post-comments">
              ${post.comments && post.comments.length > 0 ? `
                <h4>Комментарии (${post.comments.length}):</h4>
                ${post.comments.map(comment => `
                  <div class="comment">
                    <strong>${comment.user.name}:</strong> ${comment.text}
                    <span class="post-date">${formatDate(comment.createdAt)}</span>
                  </div>
                `).join('')}
              ` : ''}
              ${user ? `
                <div class="add-comment">
                  <textarea class="comment-input" data-post-id="${post.id}" placeholder="Добавить комментарий..."></textarea>
                  <button class="button comment-button" data-post-id="${post.id}">Отправить</button>
                </div>
              ` : ''}
            </div>
          </li>
        `).join('') : `
          <div class="no-posts">
            <p>Пока нет ни одной публикации</p>
          </div>
        `}
      </ul>
    </div>
  `;

  appEl.innerHTML = postsHtml;

  // Настраиваем обработчики событий
  const setupEventListeners = () => {
    // Обработчик для логотипа
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
      logoElement.addEventListener('click', () => {
        goToPage('posts');
      });
    }

    // Обработчики для кнопок авторизации
    if (document.getElementById('login-button')) {
      document.getElementById('login-button').addEventListener('click', () => {
        goToPage('auth');
      });
    }

    if (document.getElementById('register-button')) {
      document.getElementById('register-button').addEventListener('click', () => {
        goToPage('auth');
      });
    }

    // Обработчик для кнопки выхода
    if (document.getElementById('logout-button')) {
      document.getElementById('logout-button').addEventListener('click', () => {
        // Функция logout должна быть импортирована из index.js
        if (window.logout) {
          window.logout();
        }
      });
    }

    // Обработчик для кнопки добавления поста
    if (document.getElementById('add-post-button')) {
      document.getElementById('add-post-button').addEventListener('click', () => {
        goToPage('add-post');
      });
    }

    // Обработчики для лайков
    document.querySelectorAll('.like-button').forEach(button => {
      button.addEventListener('click', () => {
        if (!user) {
          showError('Чтобы поставить лайк, необходимо авторизоваться');
          return;
        }

        const postId = button.dataset.postId;
        const isLiked = button.dataset.isLiked === 'true';

        if (isLiked) {
          // Убираем лайк
          dislikePost({ token: `Bearer ${user.token}`, postId })
            .then(() => {
              const likesText = button.querySelector('img').alt;
              const likesCount = parseInt(likesText) - 1;
              button.querySelector('img').alt = likesCount;
              button.querySelector('img').src = './assets/images/like-not-active.svg';
              button.dataset.isLiked = 'false';
              button.closest('.post-likes').querySelector('.post-likes-text').innerHTML = 
                `Нравится: <strong>${likesCount}</strong>`;
            })
            .catch(error => {
              showError(error.message);
            });
        } else {
          // Ставим лайк
          likePost({ token: `Bearer ${user.token}`, postId })
            .then(() => {
              const likesText = button.querySelector('img').alt;
              const likesCount = parseInt(likesText) + 1;
              button.querySelector('img').alt = likesCount;
              button.querySelector('img').src = './assets/images/like-active.svg';
              button.dataset.isLiked = 'true';
              button.closest('.post-likes').querySelector('.post-likes-text').innerHTML = 
                `Нравится: <strong>${likesCount}</strong>`;
            })
            .catch(error => {
              showError(error.message);
            });
        }
      });
    });

    // Обработчики для комментариев
    document.querySelectorAll('.comment-button').forEach(button => {
      button.addEventListener('click', () => {
        const postId = button.dataset.postId;
        const textarea = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
        const commentText = textarea.value.trim();

        if (!commentText) {
          showError('Комментарий не может быть пустым');
          return;
        }

        addComment({ token: `Bearer ${user.token}`, postId, text: commentText })
          .then(newComment => {
            showSuccess('Комментарий добавлен');
            textarea.value = '';

            // Обновляем список комментариев
            const commentsContainer = button.closest('.post-comments');
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
              <strong>${newComment.user.name}:</strong> ${newComment.text}
              <span class="post-date">${formatDate(newComment.createdAt)}</span>
            `;
            
            const commentsHeader = commentsContainer.querySelector('h4');
            if (commentsHeader) {
              const countMatch = commentsHeader.textContent.match(/\((\d+)\)/);
              if (countMatch) {
                const newCount = parseInt(countMatch[1]) + 1;
                commentsHeader.textContent = `Комментарии (${newCount}):`;
              }
              commentsHeader.after(commentElement);
            } else {
              const newHeader = document.createElement('h4');
              newHeader.textContent = `Комментарии (1):`;
              commentsContainer.prepend(newHeader);
              newHeader.after(commentElement);
            }
          })
          .catch(error => {
            showError(error.message);
          });
      });
    });

    // Обработчики для переходов на страницу пользователя
    document.querySelectorAll('.post-header').forEach(header => {
      header.addEventListener('click', () => {
        const userId = header.dataset.userId;
        goToPage('user-posts', { userId });
      });
    });
  };

  // Настраиваем кнопку "Наверх" и сохраняем функцию очистки
  const cleanupScroll = setupScrollToTopButton();
  setupEventListeners();

  // Возвращаем функцию очистки для удаления обработчиков при размонтировании
  return () => {
    if (cleanupScroll) cleanupScroll();
  };
};