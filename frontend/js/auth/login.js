import {
    saveLogin
} from "./auth.js";

const API = "/api/auth/login";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    try {

        const response = await fetch(API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                username,
                password

            })

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.message);

            return;

        }

        saveLogin(result.token, result.user);

        if (result.user.role === "admin") {

            location.href = "dashboard.html";

        } else {

            location.href = "sale.html";

        }

    } catch (err) {

        console.error(err);

        alert("Server Error");

    }

});