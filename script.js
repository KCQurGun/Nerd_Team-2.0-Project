// Ждем загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  // Загрузка темы из localStorage
  if (localStorage.getItem("darkTheme") === "true") {
    document.body.classList.add("dark-theme");
  }

  // Обработчик кнопки переключения темы
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-theme");

      // Сохраняем настройку темы в localStorage
      localStorage.setItem(
        "darkTheme",
        document.body.classList.contains("dark-theme")
      );
    });
  }

  // Обработчики для кнопок "Подробнее" на странице информации
  const showMoreButtons = document.querySelectorAll(".show-more");
  showMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.dataset.target;
      const targetElement = document.getElementById(targetId);

      if (targetElement.classList.contains("hidden")) {
        targetElement.classList.remove("hidden");
        this.textContent = "Скрыть";
      } else {
        targetElement.classList.add("hidden");
        this.textContent = "Подробнее";
      }
    });
  });

  const registForm = document.getElementById("registForm");
  if (registForm) {
    registForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Проверка введенных данных
      if (username.length < 3) {
        showMessage(
          "Имя пользователя должно содержать не менее 3 символов",
          "error"
        );
        return;
      }

      // Регистрируем пользователя
      const result = registerUser(username, email, password);
      showMessage(result.message, result.success ? "success" : "error");

      if (result.success) {
        registForm.reset();
        // Перенаправляем на страницу входа через 2 секунды
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      }
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value; // Исправлено: было "email"
      const password = document.getElementById("loginPassword").value; // Исправлено: было "password"

      // Проверяем учетные данные
      const result = loginUser(email, password);
      showLoginMessage(result.message, result.success ? "success" : "error");

      if (result.success) {
        // Перенаправляем на главную страницу через 2 секунды
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      }
    });
  }

  // Функция для показа сообщений
  function showMessage(text, type = "info") {
    const messageElement = document.getElementById("registrationMessage");
    if (messageElement) {
      messageElement.textContent = text;
      messageElement.className = type;
      messageElement.classList.remove("hidden");

      // Скрываем сообщение через 5 секунд
      setTimeout(() => {
        messageElement.classList.add("hidden");
      }, 5000);
    }
  }

  // Функция для показа сообщений при входе
  function showLoginMessage(text, type = "info") {
    const messageElement = document.getElementById("loginMessage");
    if (messageElement) {
      messageElement.textContent = text;
      messageElement.className = type;
      messageElement.classList.remove("hidden");

      // Скрываем сообщение через 5 секунд
      setTimeout(() => {
        messageElement.classList.add("hidden");
      }, 5000);
    }
  }

  // Загрузка данных по API для курсов валют
  const loadCurrencyBtn = document.getElementById("loadCurrency");
  if (loadCurrencyBtn) {
    loadCurrencyBtn.addEventListener("click", function () {
      const currencyData = document.getElementById("currencyData");
      currencyData.innerHTML = "Загрузка данных...";

      // Получаем данные о курсах валют через API
      fetch("https://api.exchangerate-api.com/v4/latest/RUB")
        .then((response) => response.json())
        .then((data) => {
          let html = "<h4>Курсы валют относительно рубля:</h4><ul>";

          // Выбираем только основные валюты
          const currencies = ["USD", "EUR", "GBP", "CNY", "JPY"];

          for (let currency of currencies) {
            if (data.rates[currency]) {
              const rate = (1 / data.rates[currency]).toFixed(2);
              html += `<li>${currency}: ${rate} ₽</li>`;
            }
          }

          html +=
            "</ul><p>Данные обновлены: " + new Date().toLocaleString() + "</p>";
          currencyData.innerHTML = html;
        })
        .catch((error) => {
          currencyData.innerHTML =
            "Ошибка при загрузке данных. Пожалуйста, попробуйте позже.";
          console.error("Ошибка:", error);
        });
    });
  }
});
