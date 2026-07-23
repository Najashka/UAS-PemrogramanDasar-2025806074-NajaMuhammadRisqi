import { createSidebar } from "./sidebar.js";
import { createNavbar } from "./navbar.js";
import { clearLogin } from "../auth/auth.js";

export function renderLayout(content) {

    const app = document.getElementById("app");

    app.innerHTML = `

        ${createSidebar()}

        <main>

            ${createNavbar()}

            <section class="content">

                ${content}

            </section>

        </main>

    `;

    document
        .getElementById("logoutBtn")
        .addEventListener("click", () => {

            clearLogin();

            location.href="/pages/login.html";

        });

}