import { getUser } from "../auth/auth.js";

export function createNavbar(title) {

    const user = getUser();

    return `
        <header class="navbar">

            <h2>${title}</h2>

            <div class="user-info">

                <div>

                    <strong>${user.name}</strong><br>

                    <small>${user.role}</small>

                </div>

                <div class="avatar">

                    <i class="fa-solid fa-user"></i>

                </div>

            </div>

        </header>
    `;

}