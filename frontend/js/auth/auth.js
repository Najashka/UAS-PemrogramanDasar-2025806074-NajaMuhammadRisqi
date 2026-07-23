const TOKEN_KEY = "token";
const USER_KEY = "user";

export function saveLogin(token, user) {

    localStorage.setItem(TOKEN_KEY, token);

    localStorage.setItem(USER_KEY, JSON.stringify(user));

}

export function getToken() {

    return localStorage.getItem(TOKEN_KEY);

}

export function getUser() {

    const user = localStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;

}

export function isLoggedIn() {

    return !!getToken();

}

export function clearLogin() {

    localStorage.removeItem(TOKEN_KEY);

    localStorage.removeItem(USER_KEY);

}