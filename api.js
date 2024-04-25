let host = "https://wedev-api.sky.pro/api/v1/log1422/comments"
const hostReg = "https://wedev-api.sky.pro/api/user/login";

export let token;
export const setToken = (newToken) => {
    token = newToken;
};

export let UserName;
export function setUserName(newName) {
    UserName = newName;
}

export function getComment() {
    return fetch(host, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error("Сервер сломался");
            }
            if (response.status === 400) {
                throw new Error("Нет авторизации");
            }
            return response.json();
        }).catch((error) => {
            if (error.message === 'Failed to fetch') {
                alert("Кажется что-то пошло не так, попробуйте позже");
            }
            if (error.message === "Сервер упал") {
                alert('Сервер сломался, попробуйте позже');
            }
            if (error.message === "Нет авторизации") {
                alert("Авторизируйся");
            }
            console.warn(error);
        });
}


export function postComment() {
    const nameInputElement = document.getElementById("name-input");
    const commentInputElement = document.getElementById("comment-input");
    return fetch(host, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({

            name: nameInputElement.value
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt")
                .replaceAll(">", "&gt")
                .replaceAll('"', "&quot;"),
            text: commentInputElement.value
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt")
                .replaceAll(">", "&gt")
                .replaceAll('"', "&quot;"),
            forceError: true,

        }),
    })
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                return response.json();
            }

            if (response.status === 500) {
                throw new Error('Сервер сломался');
            }
            if (response.status === 400) {
                throw new Error('Плохой запрос');
            }

            return response.json();

        })
}

export function loginUser({ login, password }) {
    return fetch(hostReg, {
        method: "POST",
        body: JSON.stringify({
            login: login
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt")
                .replaceAll(">", "&gt")
                .replaceAll('"', "&quot;"),
            password: password
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt")
                .replaceAll(">", "&gt")
                .replaceAll('"', "&quot;"),
        }),
    }).then((response) => {
        if (response.status === 200) {
            return response.json();
        }
        if (response.status === 500) {
            throw new Error("Сервер сломался");
        }
        if (response.status === 400) {
            throw new Error("Нет авторизации");
        }

        return response.json();
    })
}
