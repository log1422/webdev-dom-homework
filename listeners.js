import { postComment } from "./api.js";
import { fetchRender } from "./main.js";




export function initAddCommentListeners() {
    const buttonElement = document.getElementById("add-button");
    const nameInputElement = document.getElementById("name-input");
    const commentInputElement = document.getElementById("comment-input");
    buttonElement.addEventListener("click", () => {


        nameInputElement.classList.remove("error");
        commentInputElement.classList.remove("error");

        if (nameInputElement.value.trim() === "") {
            nameInputElement.classList.add("error");
            return;
        }
        if (commentInputElement.value.trim() === "") {
            commentInputElement.classList.add("error");
            return;
        }

        if (commentInputElement.value === "") {
            return;
        }

        buttonElement.disabled = true;
        buttonElement.textContent = 'Добавление...';
        console.log("Начинаем делать запрос");

        postComment()
            .then(() => {
                fetchRender();
            })

            .then(() => {
                buttonElement.disabled = false;
                buttonElement.textContent = 'Написать';

                commentInputElement.value = "";
            })

            .catch((error) => {
                if (error.message === "Сервер сломался") {
                    alert("Сервер сломался, попробуй позже");
                    return;
                }

                if (error.message === "Плохой запрос") {
                    alert("Имя и/или комментарий составляет менее 3-х символов");
                    return;
                }


                alert('Произошла ошибка');
                console.warn(error);

            })
            .finally(() => {
                buttonElement.disabled = false;
                buttonElement.textContent = 'Написать';
            });


    });
}
