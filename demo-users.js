// Тестовые пользователи для демонстрации
export const demoUsers = [
  {
    id: "user1",
    name: "Анна Петрова",
    login: "anna",
    password: "password123",
    imageUrl: "https://i.pravatar.cc/150?u=anna",
    token: "demo-token-1"
  },
  {
    id: "user2",
    name: "Иван Сидоров",
    login: "ivan",
    password: "password123",
    imageUrl: "https://i.pravatar.cc/150?u=ivan",
    token: "demo-token-2"
  },
  {
    id: "user3",
    name: "Мария Иванова",
    login: "maria",
    password: "password123",
    imageUrl: "https://i.pravatar.cc/150?u=maria",
    token: "demo-token-3"
  }
];

// Функция для быстрого входа тестового пользователя
export const loginDemoUser = (userId) => {
  const user = demoUsers.find(u => u.id === userId);
  if (user) {
    // Сохраняем пользователя в localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
};

// Функция для проверки, является ли текущий пользователь демо-пользователем
export const isDemoUser = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token && user.token.startsWith('demo-token-');
};