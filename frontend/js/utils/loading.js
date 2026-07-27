let loadingElement = null;

export function showLoading() {

    if (loadingElement) return;

    loadingElement = document.createElement("div");

    loadingElement.className = "loading";

    loadingElement.innerHTML = `
        <div class="spinner"></div>
    `;

    document.body.appendChild(loadingElement);

}

export function hideLoading() {

    if (!loadingElement) return;

    loadingElement.remove();

    loadingElement = null;

}