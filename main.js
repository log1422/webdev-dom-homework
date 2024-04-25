import { getComment } from "./api.js";
import { renderComments } from "./renderComments.js";
import { renderForm } from "./renderForm.js";



// массив
let comments = [];
export let user = null;
export function setUser(value) {
    user = value;
}


export function fetchRender() {
    getComment()
        .then((responseData) => {
            console.log(responseData);
            comments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    time: new Date(comment.date),
                    comment: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                };
            });
            document.querySelector(".preload").style.display = "none";
            renderComments({ comments });
        })
}


export function renderApp() {
    const appElement = document.querySelector(".container");
    appElement.innerHTML = `<span class="preload">Подождите, идет загрузка комментариев...</span>
<ul class="comments" id="comments">
</ul>
<div class="form"> 
</div>`
    fetchRender();
    renderForm();
}

//Ответ на коммент
export const replyToComment = () => {
    const commentInputElement = document.getElementById("comment-input");
    const commentBodys = document.querySelectorAll(".comment-body");
    for (const commentBody of commentBodys) {
        commentBody.addEventListener('click', () => {
            const oldName = commentBody.dataset.name;
            const oldComment = commentBody.dataset.text;
            console.log(oldName);
            console.log(oldComment);
            commentInputElement.value = `${oldName}: ${oldComment}: `;
        })
    }
};

//Лайк

export const initEventListeners = () => {
    const likesElements = document.querySelectorAll(".like-button");
    for (const likesElement of likesElements) {
        likesElement.addEventListener("click", () => {
            const index = likesElement.dataset.index;

            console.log(comments[index].likes);
            if (comments[index].isLiked) {
                comments[index].isLiked = false;
                comments[index].likes--;
            } else {
                comments[index].isLiked = true;
                comments[index].likes++;
            }
            renderComments({ comments });

        });
    }
};
renderApp();
renderComments({ comments });





console.log("It works!");