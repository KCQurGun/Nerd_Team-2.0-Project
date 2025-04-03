// users.js - Модуль для работы с пользователями

// Инициализация базы данных пользователей
function initUsersDB() {
  if (!localStorage.getItem('usersDB')) {
    localStorage.setItem('usersDB', JSON.stringify([]));
  }
}

// Добавление нового пользователя
function registerUser(username, email, password) {
  // Инициализируем БД, если ещё не создана
  initUsersDB();
  
  // Получаем текущий список пользователей
  const users = JSON.parse(localStorage.getItem('usersDB'));
  
  // Проверка на существующего пользователя
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return {
      success: false,
      message: 'Пользователь с таким email уже зарегистрирован'
    };
  }
  
  // Добавляем нового пользователя
  const newUser = {
    id: Date.now(), // используем timestamp как ID
    username,
    email,
    password, // в реальном приложении пароль должен быть захеширован
    registrationDate: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('usersDB', JSON.stringify(users));
  
  return {
    success: true,
    message: `${username}, вы успешно зарегистрированы!`
  };
}

// Проверка учетных данных пользователя для входа
function loginUser(email, password) {
  // Инициализируем БД, если ещё не создана
  initUsersDB();
  
  // Получаем текущий список пользователей
  const users = JSON.parse(localStorage.getItem('usersDB'));
  
  // Ищем пользователя
  const user = users.find(user => user.email === email && user.password === password);
  
  if (user) {
    // Сохраняем информацию о текущем пользователе
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email
    }));
    
    return {
      success: true,
      message: `Добро пожаловать, ${user.username}!`,
      user: {
        username: user.username,
        email: user.email
      }
    };
  } else {
    return {
      success: false,
      message: 'Неверный email или пароль'
    };
  }
}

// Выход пользователя
function logoutUser() {
  localStorage.removeItem('currentUser');
  return {
    success: true,
    message: 'Вы успешно вышли из системы'
  };
}

// Получение текущего пользователя
function getCurrentUser() {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}
