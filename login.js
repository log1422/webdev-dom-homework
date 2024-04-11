import {
    loginUser,
    setToken,
    setUser,
    token
} from "./api.js";
import {
    fetchPromiseGet
} from "./main.js";

export const renderLogin = () => {
    //отрисовываем форму
    const appElement = document.getElementById("app");
    const loginHtml = `<h1>Страница входа</h1>
    <div class="add-form">
      <h3 class="form-title">Форма входа</h3>
      <div class="form-row">
        <input type="text" id="login-input" class="input" placeholder="Логин" />
        <input
          type="password"
          id="password-input"
          class="input"
          placeholder="Пароль"
        />
      </div>
      <br />
      <button class="button" id="login-button">Войти</button>
      <button class="button-reg">Зарегистрироваться</button>
    </div>`
    //создаем элемент app

    appElement.innerHTML = loginHtml;

    const buttonGet = document.getElementById("login-button");
    const loginInput = document.getElementById("login-input");
    const passwordInput = document.getElementById("password-input");
    //Получаем данные от API
    buttonGet.addEventListener("click", () => {
        loginUser({
                login: loginInput.value,
                password: passwordInput.value
            }).then((responseData) => {
                console.log(token);
                setToken(responseData.user.token);
                setUser(responseData.user.name);
                console.log(token);
            }).then(() => {
                fetchPromiseGet();
            })
            .catch((error) => {
                console.error("Произошла ошибка при установке имени пользователя:", error);
            });
    })
};