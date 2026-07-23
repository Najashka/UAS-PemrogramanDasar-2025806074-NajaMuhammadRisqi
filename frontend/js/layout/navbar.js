import { getUser } from "../auth/auth.js";

export function createNavbar(){

    const user = getUser();

    return `

    <header class="navbar">

        <div>

            <h2>Dashboard</h2>

        </div>

        <div class="user-info">

            <div>

                <strong>${user.name}</strong>

                <small>${user.role}</small>

            </div>

            <div class="avatar">

                <i class="fa-solid fa-user"></i>

            </div>

        </div>

    </header>

    `;

}