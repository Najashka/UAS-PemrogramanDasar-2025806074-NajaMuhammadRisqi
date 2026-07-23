import { getUser } from "../auth/auth.js";

export function createSidebar() {

    const user = getUser();

    const adminMenu = [

        {
            title: "Dashboard",
            icon: "fa-solid fa-house",
            link: "dashboard.html"
        },

        {
            title: "Category",
            icon: "fa-solid fa-layer-group",
            link: "category.html"
        },

        {
            title: "Supplier",
            icon: "fa-solid fa-truck",
            link: "supplier.html"
        },

        {
            title: "Customer",
            icon: "fa-solid fa-users",
            link: "customer.html"
        },

        {
            title: "Product",
            icon: "fa-solid fa-box",
            link: "product.html"
        },

        {
            title: "Sales",
            icon: "fa-solid fa-cart-shopping",
            link: "sale.html"
        },

        {
            title: "Report",
            icon: "fa-solid fa-chart-column",
            link: "#"
        },

        {
            title: "Users",
            icon: "fa-solid fa-user-gear",
            link: "#"
        }

    ];

    const cashierMenu = [

        {
            title: "Sales",
            icon: "fa-solid fa-cart-shopping",
            link: "sale.html"
        }

    ];

    const menus = user.role === "admin"
        ? adminMenu
        : cashierMenu;

    return `

    <aside class="sidebar">

        <div class="logo">

            <i class="fa-solid fa-store"></i>

            <span>Sales Inventory</span>

        </div>

        <ul>

            ${menus.map(menu => `

                <li>

                    <a href="${menu.link}">

                        <i class="${menu.icon}"></i>

                        ${menu.title}

                    </a>

                </li>

            `).join("")}

            <li>

                <a href="#" id="logoutBtn">

                    <i class="fa-solid fa-right-from-bracket"></i>

                    Logout

                </a>

            </li>

        </ul>

    </aside>

    `;

}