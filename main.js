import {
    getPromise,
    postPromise
} from "./api.js"
import {
    renderComments
} from "./render.js"
import {
    normalizeComments
} from "./helpers.js";


const inputNameElement = document.querySelector(".add-form-name");
const inputTextElement = document.querySelector(".add-form-text");
const buttonElement = document.querySelector(".add-form-button");
// Переносим данные из разметки
export let comments = [];
export function setComments(newComments) {
    comments = newComments;
}
export const fetchPromiseGet = () => {
    getPromise().then((responseData) => {
        // console.log(responseData);

        const appComments = normalizeComments(responseData.comments)
        // получили данные и рендерим их в приложении
        comments = appComments;

        //console.log(comments)
        renderComments({
            comments
        });

    })
};
fetchPromiseGet();



console.log("It works!");