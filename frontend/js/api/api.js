import {
    getToken,
    clearLogin
} from "../auth/auth.js";

export async function apiFetch(url, options = {}) {

    const token = getToken();

    const response = await fetch(url, {

        ...options,

        headers: {

            Authorization: `Bearer ${token}`,

            ...(options.headers || {})

        }

    });

    if (response.status === 401) {

        clearLogin();

        alert("Session telah berakhir, silakan login kembali.");

        location.href = "/pages/login.html";

        return null;

    }

    return response;

}