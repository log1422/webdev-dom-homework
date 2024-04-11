import {
    token,
    user
} from "./api.js";
import {
    answerComment,
    addComment,
    addLike
} from "./listeners.js";
import {
    renderLogin
} from "./login.js";
import {
    sanitize
} from "./helpers.js";


export const renderComments = ({
    comments
}) => {

    const appElement = document.getElementById("app");

    //создаем комментарий
    const commentsHtml = comments
        .map((comment, index) => {
            const sanitizedComment = sanitize(comment.comment);
            return ` <li class="comment">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.time}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${sanitizedComment}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comments[index].likes}</span>
              <button data-index= "${index}" class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
            </div>
          </div>
        </li> `
        }).join("");
    //
    const formHtml = `<div class="add-form">
    <input
      type="text"
      class="add-form-name"
      placeholder="Введите ваше имя"
      value=${user}
      disabled
    />
    <textarea
      type="textarea"
      class="add-form-text"
      placeholder="Введите ваш комментарий"
      rows="4"
    ></textarea>
    <div class="add-form-row">
      <button class="add-form-button">Написать</button>
      <button class="delete-form-button">Удалить последний комментарий</button>
    </div>
  </div>`

    appElement.innerHTML = `
    <ul class="comments" id="list-comments" >${commentsHtml}</ul>
    ${token ? formHtml : '<p class="login-link">Чтобы добавить комментарий, авторизуйтесь</p>'}
    `;
    //открыть форму авторизации
    function actionLogin() {
        if (token) {
            return
        }
        const loginBtn = document.querySelector('.login-link');
        loginBtn.addEventListener('click', () => {
            renderLogin();
        })
    }

    actionLogin();

    addLike({
        comments
    });

    if (token) {
        addComment();
    }
    answerComment();
};