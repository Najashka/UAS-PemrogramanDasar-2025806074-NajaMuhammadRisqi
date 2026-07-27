export function showToast(message, type = "success") {

    let container = document.querySelector(".toast-container");

    if (!container) {

        container = document.createElement("div");

        container.className = "toast-container";

        document.body.appendChild(container);

    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}