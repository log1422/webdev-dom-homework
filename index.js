"use strict";
const addFormButtonElement = document.getElementById("add-form-button");
const addFormTextElement = document.getElementById("add-form-text");
const addFormNameElement = document.getElementById("add-form-name");
const addFormElement = document.getElementById("add-form");
const commentsList = document.getElementById("comments");

// Массив данных для комментариев
let commentsData = [{
        name: "Глеб Фокин",
        date: "12.02.22 12:18",
        text: "Это будет первый комментарий на этой странице",
        liked: false,
        likes: 3
    },
    {
        name: "Варвара Н.",
        date: "13.02.22 19:22",
        text: "Мне нравится как оформлена эта страница! ❤",
        liked: true,
        likes: 75
    }
];

// Функция для рендеринга списка комментариев
function renderComments() {
    commentsList.innerHTML = "";
    commentsData.forEach((comment, index) => {
        const commentHTML = `
          <li class="comment">
            <div class="comment-header">
              <div>${comment.name}</div>
              <div>${comment.date}</div>
            </div>
            <div class="comment-body">
              <div class="comment-text">
                ${comment.text}
              </div>
            </div>
            <div class="comment-footer">
              <div class="likes">
                <span class="likes-counter">${comment.likes}</span>
                <button class="like-button ${comment.liked ? '-active-like' : ''}" data-index="${index}"></button>
              </div>
            </div>
          </li>
        `;
        commentsList.insertAdjacentHTML('beforeend', commentHTML);
    });
}

// Обработчик клика по кнопке лайка
commentsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("like-button")) {
        const index = event.target.dataset.index;
        const comment = commentsData[index];
        if (comment.liked) {
            comment.likes--;
        } else {
            comment.likes++;
        }
        comment.liked = !comment.liked;
        renderComments();
    }
});

// Обработчик клика по комментарию для ответа
commentsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("comment-text")) {
        const index = event.target.closest(".comment").dataset.index;
        const comment = commentsData[index];
        addFormTextElement.value = `QUOTE_BEGIN ${comment.name}: ${comment.text} QUOTE_END\n`;
    }
});

// Инициализация списка комментариев
renderComments();

// Обработчик клика по кнопке добавления комментария
addFormButtonElement.addEventListener("click", () => {
    // Код для добавления комментария
});

console.log("It works!");