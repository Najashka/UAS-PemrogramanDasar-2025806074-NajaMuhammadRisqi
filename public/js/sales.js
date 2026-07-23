const API = "/api/products";

let products = [];
let cart = [];

const searchInput = document.getElementById("searchProduct");
const searchResult = document.getElementById("searchResult");

async function loadProducts(){

    const res = await fetch(API);

    products = await res.json();

}

searchInput.addEventListener("input", function () {

    const keyword = this.value.trim().toLowerCase();

    if (keyword === "") {
        searchResult.style.display = "none";
        selectedIndex = -1;
        return;
    }

    filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );

    selectedIndex = -1;

    renderSearch(filteredProducts);

});

function renderSearch(data) {

    searchResult.innerHTML = "";

    if (data.length === 0) {
        searchResult.style.display = "none";
        return;
    }

    data.forEach((product, index) => {

        searchResult.innerHTML += `
            <div
                class="search-item ${index === selectedIndex ? "active" : ""}"
                onclick="addToCart(${product.id})">

                <span>${product.name}</span>

                <span>
                    Rp ${Number(product.price).toLocaleString("id-ID")}
                </span>

            </div>
        `;

    });

    searchResult.style.display = "block";

}

searchInput.addEventListener("keydown", function (e) {

    if (searchResult.style.display !== "block") return;

    if (e.key === "ArrowDown") {

        e.preventDefault();

        if (selectedIndex < filteredProducts.length - 1) {
            selectedIndex++;
        }

        renderSearch(filteredProducts);

    }

    if (e.key === "ArrowUp") {

        e.preventDefault();

        if (selectedIndex > 0) {
            selectedIndex--;
        }

        renderSearch(filteredProducts);

    }

    if (e.key === "Enter") {

        e.preventDefault();

        if (selectedIndex >= 0) {

            addToCart(filteredProducts[selectedIndex].id);

        }

    }

});

function addToCart(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.qty++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            qty: 1
        });

    }

    renderCart();

    searchInput.value = "";
    searchResult.style.display = "none";
}

function renderCart() {

    const cartTable = document.getElementById("cartTable");

    cartTable.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {

        const total = item.qty * item.price;

        subtotal += total;

        cartTable.innerHTML += `
        <tr>

            <td>${item.name}</td>

            <td>

                <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>

                <span class="qty-number">${item.qty}</span>

                <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>

            </td>

            <td>
                Rp ${item.price.toLocaleString("id-ID")}
            </td>

            <td>
                Rp ${total.toLocaleString("id-ID")}
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="removeItem(${item.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("subtotal").textContent =
        "Rp " + subtotal.toLocaleString("id-ID");

    document.getElementById("grandTotal").textContent =
        "Rp " + subtotal.toLocaleString("id-ID");
}

function increaseQty(id){

    const item = cart.find(item=>item.id===id);

    if(!item) return;

    item.qty++;

    renderCart();

}

function decreaseQty(id){

    const item = cart.find(item=>item.id===id);

    if(!item) return;

    item.qty--;

    if(item.qty<=0){

        cart = cart.filter(item=>item.id!==id);

    }

    renderCart();

}

function removeItem(id){

    cart = cart.filter(item=>item.id!==id);

    renderCart();

}

let selectedIndex = -1;
let filteredProducts = [];

loadProducts();