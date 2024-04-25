

import { replyToComment, user } from "./main.js";
import { initEventListeners } from "./main.js";
import { format } from "date-fns";



export const renderComments = ({ comments }) => {
    const listElement = document.getElementById("comments");
    const commentsHtml = comments.map((comment, index) => {
        const createDate = format(new Date(comment.time), 'yyyy-MM-dd hh.mm.ss');
        return `<li class="comment">
        <div class="comment-header">
            <div>${comment.name}</div>
            <div>${createDate}</div>
        </div>
        <div class="comment-body" data-text="${comment.comment}" data-name="${comment.name}">
            <div class="comment-text" data-index="${index}">
                ${comment.comment}
            </div>
        </div>
        <div class="comment-footer">
            <div class="likes">
                <div class="likes">
                    <span class="likes-counter">${comments[index].likes}</span>
                    <button data-index="${index}" class="like-button ${comment.isLiked ? "-active-like" : ""
            }"></button>
            </div>
        </div>
    </li> `;
    }).join('');

    listElement.innerHTML = commentsHtml;

    if (user) {

        initEventListeners();
        replyToComment();
    }
}
