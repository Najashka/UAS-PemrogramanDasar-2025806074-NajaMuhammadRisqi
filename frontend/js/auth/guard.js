import {
    getUser,
    isLoggedIn
} from "./auth.js";

export function requireAuth(...roles) {

    if (!isLoggedIn()) {

        location.href = "/pages/login.html";

        return;

    }

    const user = getUser();

    if (!user) {

        location.href = "/pages/login.html";

        return;

    }

    if (!roles.includes(user.role)) {

        if (user.role === "cashier") {

            location.href = "/pages/sale.html";

        } else {

            location.href = "/pages/dashboard.html";

        }

    }

}