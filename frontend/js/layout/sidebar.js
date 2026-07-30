import { getUser } from "../auth/auth.js";

const currentPage = window.location.pathname.split("/").pop();

export function createSidebar() {

    const user = getUser();

    const adminMenu = [

        {
            title: "Dashboard",
            icon: "fa-solid fa-house",
            link: "../dashboard/dashboard.html"
        },

        {
            title: "Category",
            icon: "fa-solid fa-layer-group",
            link: "../category/category.html"
        },

        {
            title: "Supplier",
            icon: "fa-solid fa-truck",
            link: "../supplier/supplier.html"
        },

        {
            title: "Customer",
            icon: "fa-solid fa-users",
            link: "../customer/customer.html"
        },

        {
            title: "Product",
            icon: "fa-solid fa-box",
            link: "../product/product.html"
        },

        {
            title: "Sales",
            icon: "fa-solid fa-cart-shopping",
            link: "../sale/sale.html"
        },

        {
            title: "Sales History",
            icon: "fa-solid fa-clock-rotate-left",
            link: "../salehistory/sale-history.html"
        },

        {
            title: "Report",
            icon: "fa-solid fa-chart-column",
            link: "../report/report.html"
        },

        {
            title: "Users",
            icon: "fa-solid fa-user-gear",
            link: "../user/user.html"
        }

    ];

    const cashierMenu = [

        {
            title: "Sales",
            icon: "fa-solid fa-cart-shopping",
            link: "../sale/sale.html"
        }

    ];

    const menus = user.role === "admin"
        ? adminMenu
        : cashierMenu;

    return `

    <aside class="sidebar">

        <div class="logo">

            <i class="fa-solid fa-hat-wizard"></i>

            <span>Sales Inventory</span>

        </div>

        <div class="sidebar-user">

            <strong>${user.name}</strong>

            <small>${user.role}</small>

        </div>

        <ul>

            ${menus.map(menu => `

                <li>

                    <a
                        href="${menu.link}"
                        class="${currentPage === menu.link.split("/").pop() ? "active" : ""}"
                    >
                        <i class="${menu.icon}"></i>
                        <span>${menu.title}</span>
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