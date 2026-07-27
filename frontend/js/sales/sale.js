// ==============================
// IMPORT
// ==============================

import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";
import { showToast } from "../utils/toast.js";
import { showLoading, hideLoading } from "../utils/loading.js";

// ==============================
// AUTH
// ==============================

requireAuth("admin", "cashier");

// ==============================
// LAYOUT
// ==============================

renderLayout("Sales", `
<div class="sale-page">

    <div class="product-panel">

        <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>

            <input
                type="text"
                id="searchProduct"
                placeholder="Cari produk..."
                autocomplete="off">
        </div>

        <div
            id="productList"
            class="product-list">
        </div>

    </div>

    <div class="cart-panel">

        <div class="customer-section">

            <select id="customerSelect">
                <option value="">Pilih Customer</option>
            </select>

        </div>

        <div
            id="cartList"
            class="cart-list">

        </div>

        <div class="summary">

            <div class="summary-item">
                <span>Subtotal</span>
                <span id="subtotal">Rp0</span>
            </div>

            <div class="summary-item total">
                <span>Total</span>
                <span id="total">Rp0</span>
            </div>

            <input
                type="number"
                id="cash"
                placeholder="Nominal Bayar">

            <div class="summary-item">
                <span>Kembalian</span>
                <span id="change">Rp0</span>
            </div>

            <button id="payButton">
                <i class="fa-solid fa-cash-register"></i>
                Bayar
            </button>

        </div>

    </div>

</div>

<!-- ===========================
PAYMENT MODAL
=========================== -->

<div
    id="paymentModal"
    class="payment-modal">

    <div class="payment-box">

        <div class="payment-header">

            <i class="fa-solid fa-circle-check"></i>

            <h2>Konfirmasi Pembayaran</h2>

        </div>

        <div class="payment-body">

            <div class="payment-row">

                <span>Customer</span>

                <strong id="modalCustomer">-</strong>

            </div>

            <div class="payment-row">

                <span>Total</span>

                <strong id="modalTotal">Rp0</strong>

            </div>

            <div class="payment-row">

                <span>Bayar</span>

                <strong id="modalCash">Rp0</strong>

            </div>

            <div class="payment-row">

                <span>Kembalian</span>

                <strong id="modalChange">Rp0</strong>

            </div>

        </div>

        <div class="payment-footer">

            <button
                id="cancelPayment"
                class="btn-cancel">

                Batal

            </button>

            <button
                id="confirmPayment"
                class="btn-confirm">

                Konfirmasi

            </button>

        </div>

    </div>

</div>
`);

// =========================
// STATE
// =========================

const state = {

    products: [],

    customers: [],

    cart: [],

    keyword: ""

};

// =========================
// ELEMENT
// =========================

const el = {};

// =========================
// INIT
// =========================

document.addEventListener("DOMContentLoaded", init);

async function init() {

    cacheElements();

    bindEvents();

    await loadProducts();

    await loadCustomers();

    el.searchProduct.focus();

}

// ==============================
// CACHE ELEMENT
// ==============================

function cacheElements() {

    el.searchProduct = document.getElementById("searchProduct");

    el.productList = document.getElementById("productList");

    el.customerSelect = document.getElementById("customerSelect");

    el.cartList = document.getElementById("cartList");

    el.subtotal = document.getElementById("subtotal");

    el.total = document.getElementById("total");

    el.cash = document.getElementById("cash");

    el.change = document.getElementById("change");

    el.payButton = document.getElementById("payButton");

    el.paymentModal = document.getElementById("paymentModal");

    el.modalCustomer = document.getElementById("modalCustomer");

    el.modalTotal = document.getElementById("modalTotal");

    el.modalCash = document.getElementById("modalCash");

    el.modalChange = document.getElementById("modalChange");

    el.cancelPayment = document.getElementById("cancelPayment");

    el.confirmPayment = document.getElementById("confirmPayment");

}

// ==============================
// EVENT
// ==============================

function bindEvents() {

    el.searchProduct.addEventListener(
        "input",
        searchProducts
    );

    el.cash.addEventListener(
        "input",
        calculateChange
    );

    el.payButton.addEventListener(
        "click",
        saveSale
    );

    el.cancelPayment.addEventListener(
        "click",
        closePaymentModal
    );

    el.confirmPayment.addEventListener(
        "click",
        processPayment
    );

}

function bindCartEvents() {

    document
        .querySelectorAll(".plus")
        .forEach(button => {

            button.onclick = () => {

                addToCart(button.dataset.id);

            };

        });

    document
        .querySelectorAll(".minus")
        .forEach(button => {

            button.onclick = () => {

                decreaseQty(button.dataset.id);

            };

        });

}

function bindProductEvents() {

    document
        .querySelectorAll(".product-card")
        .forEach(card => {

            card.onclick = () => {

                addToCart(card.dataset.id);

            };

        });

}

// ==============================
// LOAD DATA
// ==============================

async function loadProducts() {

    showLoading();

    try {

        const response = await apiFetch("/api/products");

        if (!response) return;

        const products = await response.json();
        console.table(products); 

        if (!response.ok) {

            throw new Error(
                products.message ||
                "Gagal mengambil data produk"
            );

        }

        state.products = products;

        renderProducts();

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");

    } finally {

        hideLoading();

    }

}

async function loadCustomers() {

    try {

        const response = await apiFetch("/api/customers");

        if (!response) return;

        const customers = await response.json();

        if (!response.ok) {

            throw new Error(
                customers.message ||
                "Gagal mengambil data customer"
            );

        }

        state.customers = customers;

        renderCustomers();

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");

    }

}

function searchProducts() {

    state.keyword = el.searchProduct.value
        .trim()
        .toLowerCase();

    const filteredProducts = state.products.filter(product => {

        return product.name
            .toLowerCase()
            .includes(state.keyword);

    });

    renderProducts(filteredProducts);

}

// ==============================
// RENDER
// ==============================

function renderProducts(products = state.products) {

    if (!products.length) {

        el.productList.innerHTML = `
            <div class="empty-state">
                Tidak ada produk
            </div>
        `;

        return;
    }

    el.productList.innerHTML = products.map(product => `

        <div class="product-card
        ${product.stock <= 0 ? "disabled" : ""}
        "
        data-id="${product.id}">

            <div class="product-image">

                <i class="fa-solid fa-box-open"></i>

            </div>

            <div class="product-info">

                <div class="product-name">

                    ${product.name}

                </div>

                <div class="product-price">

                    ${formatRupiah(Number(product.price))}

                </div>

            </div>

            <div class="product-footer">

                <span class="product-stock
                ${product.stock <= 5 ? "low-stock" : ""}
                ">

                    <i class="fa-solid fa-cube"></i>

                    ${product.stock}

                </span>

                <span class="product-category">

                    ${product.category}

                </span>

            </div>

        </div>

    `).join("");

    bindProductEvents();

}

function renderCustomers() {

    el.customerSelect.innerHTML = `
        <option value="">Pilih Customer</option>
    `;

    state.customers.forEach(customer => {

        el.customerSelect.innerHTML += `
            <option value="${customer.id}">
                ${customer.name}
            </option>
        `;

    });

}

function renderCart() {

    if (!state.cart.length) {

        el.cartList.innerHTML = `
            <div class="empty-state">
                Keranjang masih kosong
            </div>
        `;

        return;

    }

    el.cartList.innerHTML = state.cart.map(item => `

        <div class="cart-item">

            <div class="cart-info">

                <div class="cart-name">
                    ${item.name}
                </div>

                <div class="cart-price">

                    ${item.qty} × ${formatRupiah(item.price)}

                </div>

                <div class="cart-total">

                    ${formatRupiah(item.qty * item.price)}

                </div>

            </div>

            <div class="cart-action">

                <button
                    class="qty-btn minus"
                    data-id="${item.id}">
                    -
                </button>

                <span class="cart-qty">
                    ${item.qty}
                </span>

                <button
                    class="qty-btn plus"
                    data-id="${item.id}">
                    +
                </button>

            </div>

        </div>

    `).join("");

    bindCartEvents();

}

function renderSummary() {

    const total = calculateTotal();

    el.subtotal.textContent = formatRupiah(total);

    el.total.textContent = formatRupiah(total);

    calculateChange();

}

// ==============================
// CART
// ==============================

function addToCart(productId) {

    const product = state.products.find(
        product => product.id == productId
    );

    if (!product) return;

    if (product.stock <= 0) {

        showToast(
            "Produk sedang habis",
            "warning"
        );

        return;

    }

    const cartItem = state.cart.find(
        item => item.id == productId
    );

    if (cartItem) {

        if (cartItem.qty >= product.stock) {

            showToast(
                "Stock tidak mencukupi",
                "warning"
            );

            return;

        }

        cartItem.qty++;

    } else {

        state.cart.push({

            id: product.id,

            name: product.name,

            price: Number(product.price),

            stock: product.stock,

            qty: 1

        });

    }

    renderCart();

    renderSummary();

}

function decreaseQty(productId) {

    const item = state.cart.find(
        item => item.id == productId
    );

    if (!item) return;

    item.qty--;

    if (item.qty <= 0) {

        state.cart = state.cart.filter(
            item => item.id != productId
        );

    }

    renderCart();

    renderSummary();

}

// ==============================
// PAYMENT
// ==============================

// ==============================
// PAYMENT
// ==============================

function calculateChange() {

    const total = calculateTotal();

    const cash = Number(el.cash.value) || 0;

    const change = cash - total;

    el.change.textContent = formatRupiah(

        change > 0 ? change : 0

    );

}

function saveSale() {

    if (!state.cart.length) {

        showToast(
            "Keranjang masih kosong",
            "warning"
        );

        return;

    }

    if (!el.customerSelect.value) {

        showToast(
            "Pilih customer terlebih dahulu",
            "warning"
        );

        return;

    }

    const total = calculateTotal();

    const cash = Number(el.cash.value);

    if (!cash) {

        showToast(
            "Masukkan nominal pembayaran",
            "warning"
        );

        return;

    }

    if (cash < total) {

        showToast(
            "Nominal pembayaran kurang",
            "warning"
        );

        return;

    }

    openPaymentModal(total, cash);

}

function openPaymentModal(total, cash) {

    const customer =

        el.customerSelect.options[
            el.customerSelect.selectedIndex
        ].text;

    el.modalCustomer.textContent = customer;

    el.modalTotal.textContent =

        formatRupiah(total);

    el.modalCash.textContent =

        formatRupiah(cash);

    el.modalChange.textContent =

        formatRupiah(cash - total);

    el.paymentModal.classList.add(

        "show"

    );

}

function closePaymentModal() {

    el.paymentModal.classList.remove(

        "show"

    );

}

async function processPayment() {

    try {

        showLoading();

        const payload = createSalePayload();

        const response = await apiFetch(

            "/api/sales",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(payload)

            }

        );

        if (!response) return;

        const result = await response.json();

        if (!response.ok) {

            throw new Error(

                result.message ||

                "Gagal menyimpan transaksi"

            );

        }

        showToast(

            "Transaksi berhasil",

            "success"

        );

        closePaymentModal();

        resetSale();

        await loadProducts();

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");

    } finally {

        hideLoading();

    }

}

function resetSale() {

    state.cart = [];

    renderCart();

    renderSummary();

    el.cash.value = "";

    el.change.textContent =

        formatRupiah(0);

    el.customerSelect.value = "";

}

// ==============================
// HELPER
// ==============================

function createSalePayload() {

    const total = calculateTotal();

    const payment = Number(el.cash.value);

    const changeAmount = payment - total;

    return {

        sale: {

            customer_id: Number(
                el.customerSelect.value
            ),

            total,

            payment,

            change_amount: changeAmount,

            payment_method: "Cash",

            status: "Paid"

        },

        details: state.cart.map(item => ({

            product_id: item.id,

            quantity: item.qty,

            price: item.price,

            subtotal: item.qty * item.price

        }))

    };

}

function calculateTotal() {

    return state.cart.reduce(

        (sum, item) =>

            sum + (item.price * item.qty),

        0

    );

}

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
}