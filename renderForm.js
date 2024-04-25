import {
    initEventListeners,
    user
} from "./main.js";
import {
    renderLogin
} from "./login.js";
import {
    initAddCommentListeners
} from "./listeners.js";




export function renderForm() {
    const container = document.querySelector('.form')

    container.innerHTML = user ? `<div class="add-form">
        <input type="text" class="add-form-name" id="name-input" required value="${user.name}" disabled>
        <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4" id="comment-input"></textarea>
        <div class="add-form-row">
          <button class="add-form-button" id="add-button">Написать</button>
        </div>
    
    </div>` : `<div>Чтобы оставить комментарий, <button id="authButton" type="button">авторизуйтесь.</button></div>`
    const button = document.getElementById('authButton')
    if (button) {
        button.addEventListener("click", () => {
            renderLogin();
        })
    }
    if (user) {
        initAddCommentListeners();
    }
}
