import { clearLogin } from "./auth.js";

const btn = document.getElementById("logoutBtn");

if (btn) {

    btn.addEventListener("click", () => {

        clearLogin();

        location.href = "/pages/login.html";

    });

}