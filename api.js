const loginURL = "https://wedev-api.sky.pro/api/user/login";
const host = "https://wedev-api.sky.pro/api/v1/log1422/comments"

export let token;

export let user;

export const setToken = (newToken) => {
    token = newToken;
}

export const setUser = (newUser) => {
    user = newUser;
}

export function getPromise() {
    return fetch(host, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("failed to get: " + response.status);
            }
        })
        .catch((error) => {
            console.error("Произошла ошибка при выполнении GET-запроса:", error);
        });
}
export function postPromise({
    text,
    name
}) {
    return fetch(host, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: name,
            text: text,
            forceError: true,
        })
    }).then((response) => {

        console.log(response);

        if (response.status === 201) {
            return response.json();
        } else if (response.status === 500) {
            throw new Error("Сервер сломался")
        } else if (response.status === 400) {
            throw new Error("Недопустимое количество символов")
        }

    })

}

export function loginUser({
    login,
    password
}) {
    return fetch(loginURL, {
            method: "POST",
            body: JSON.stringify({
                login,
                password,
            }),
        })
        .then((response) => {
            if (response.status === 201) {
                return response.json();
            }
            if (response.status === 400) {
                throw new Error("Неправильный логин или пароль");
            }
        })
        .catch((error) => {
            alert(error);
            console.warn(error);
        });
}