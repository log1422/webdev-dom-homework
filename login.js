import { loginUser, setToken, token } from "./api.js"
import { renderApp, setUser } from "./main.js"

export function renderLogin() {
  const container = document.querySelector('.container')
  container.innerHTML = `<div class="add-form">
          <h1 class="form-title">Авторизоваться</h1>
          <div class="form-row">
            
            <input class="input" type="text" id="login-input" placeholder="Логин"  />
            <input class="input" type="password" id="password-input" placeholder="Пароль" />
          </div>
          <button class="add-form-button" id="login-button">Войти</button>
          
             
        </div> `
  const loginButton = document.getElementById('login-button');

  loginButton.addEventListener("click", () => {
    const login = document.getElementById('login-input').value;
    const password = document.getElementById('password-input').value;

    if ((login.trim() === "")) {
      alert("Пожалуйста, введите логин");
      return;
    }
    if ((password.trim() === "")) {
      alert("Пожалуйста, введите пароль");
      return;
    }

    loginUser({ login, password })
      .then((data) => {
        setUser(data.user);
        setToken(data.user.token);
        renderApp();

        console.log(token);
      }).catch((error) => {
        if (error.message === "Нет авторизации") {
          alert("Неверные данные");
        }
        if (error.message === "Сервер сломался") {
          alert("Сервер сломался, попробуй позже");
          return;
        }
        if (error.message === 'Failed to fetch') {
          alert("Кажется что-то пошло не так, попробуйте позже");
        }

        console.warn(error);
      });

  })
}