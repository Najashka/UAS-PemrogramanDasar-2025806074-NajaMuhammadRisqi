// ===============================
// API
// ===============================

const SALES_API = "/api/sales";
const PRODUCT_API = "/api/products";
const CUSTOMER_API = "/api/customers";

// ===============================
// DOM
// ===============================

const customerSelect = document.getElementById("customerSelect");
const paymentMethod = document.getElementById("paymentMethod");

const productSelect = document.getElementById("productSelect");
const quantityInput = document.getElementById("quantity");

const addToCartBtn = document.getElementById("addToCartBtn");

const cartTableBody = document.getElementById("cartTableBody");

const grandTotal = document.getElementById("grandTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

// ===============================
// STATE
// ===============================

let cart = [];

let products = [];

// ===============================
// LOAD DATA
// ===============================

// ===============================
// LOAD CUSTOMERS
// ===============================
async function loadCustomers() {

    try {

        const response = await fetch(CUSTOMER_API);

        const customers = await response.json();

        customerSelect.innerHTML =
            '<option value="">Select Customer</option>';

        customers.forEach(customer => {

            customerSelect.innerHTML += `
                <option value="${customer.id}">
                    ${customer.name}
                </option>
            `;

        });

    } catch (error) {

        console.error("Failed to load customers:", error);

    }

}

// ===============================
// LOAD PRODUCTS
// ===============================
async function loadProducts() {

    try {

        const response = await fetch(PRODUCT_API);

        products = await response.json();

        productSelect.innerHTML =
            '<option value="">Select Product</option>';

        products.forEach(product => {

            productSelect.innerHTML += `
                <option
                    value="${product.id}"
                    data-price="${product.price}"
                    data-stock="${product.stock}"
                >
                    ${product.name}
                </option>
            `;

        });

    } catch (error) {

        console.error("Failed to load products:", error);

    }

}

// ===============================
// CART
// ===============================

// ===============================
// RENDER CART
// ===============================
function renderCart() {

    cartTableBody.innerHTML = "";

    cart.forEach((item, index) => {

        cartTableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>Rp ${item.price.toLocaleString("id-ID")}</td>
                <td>Rp ${item.subtotal.toLocaleString("id-ID")}</td>
                <td>
                    <button onclick="removeFromCart(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

    calculateTotal();

}

// ===============================
// REMOVE FROM CART
// ===============================
function removeFromCart(index) {

    cart.splice(index, 1);

    renderCart();

}
// ===============================
// CALCULATION
// ===============================

// ===============================
// CALCULATE TOTAL
// ===============================
function calculateTotal() {

    const total = cart.reduce((sum, item) => {

        return sum + item.subtotal;

    }, 0);

    grandTotal.textContent =
        `Rp ${total.toLocaleString("id-ID")}`;

}

// ===============================
// EVENTS
// ===============================

// ===============================
// ADD TO CART
// ===============================
addToCartBtn.addEventListener("click", () => {

    const productId = Number(productSelect.value);

    const quantity = Number(quantityInput.value);

    if (!productId) {

        alert("Select product first");

        return;

    }

    if (quantity <= 0) {

        alert("Invalid quantity");

        return;

    }

    const product = products.find(
        p => p.id === productId
    );

    if (!product) {

        alert("Product not found");

        return;

    }

    const subtotal = quantity * product.price;

    cart.push({

        product_id: product.id,

        name: product.name,

        quantity,

        price: product.price,

        subtotal

    });

    renderCart();

    productSelect.value = "";

    quantityInput.value = 1;

});

// ===============================
// CHECKOUT
// ===============================
checkoutBtn.addEventListener("click", async () => {

    if (cart.length === 0) {

        alert("Cart is empty");

        return;

    }

    if (!customerSelect.value) {

        alert("Please select customer");

        return;

    }

    try {

        const total = cart.reduce((sum, item) => {

            return sum + item.subtotal;

        }, 0);

        const sale = {

            customer_id: Number(customerSelect.value),

            total,

            payment_method: paymentMethod.value,

            status: "PAID"

        };

        const response = await fetch(SALES_API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                sale,

                details: cart

            })

        });

        const result = await response.json();

        alert(result.message);

        cart = [];

        renderCart();

        customerSelect.value = "";

        productSelect.value = "";

        quantityInput.value = 1;

    } catch (error) {

        console.error(error);

        alert("Checkout failed");

    }

});

// ===============================
// INIT
// ===============================
loadCustomers();

loadProducts();