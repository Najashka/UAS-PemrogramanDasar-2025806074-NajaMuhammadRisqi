import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";

requireAuth("admin", "cashier");

renderLayout("Sales",`

<div class="sales-container">

    <div class="search-box">

        <input
            id="searchProduct"
            placeholder="Cari Product">

        <button id="openSearchModal">

            Cari Produk

        </button>

    </div>

    <div class="card">

        <h3>Daftar Produk</h3>

        <table class="table">

            <thead>

                <tr>

                    <th>Nama</th>
                    <th>Harga</th>
                    <th>Stock</th>
                    <th>Aksi</th>

                </tr>

            </thead>

            <tbody id="productTable">

            </tbody>

        </table>

    </div>

    <div class="card">

        <label>Customer</label>

        <select id="customerSelect">

            <option value="">Pilih Customer</option>

        </select>

    </div>

    <table class="table">

        <thead>

            <tr>

                <th>Product</th>

                <th width="90">Qty</th>

                <th width="150">Harga</th>

                <th width="150">Total</th>

                <th width="70">Aksi</th>

            </tr>

        </thead>

        <tbody id="cartTable">

        </tbody>

    </table>

    <div class="payment-box">

        <div>

            <label>Subtotal</label>

            <span id="subtotal">

                Rp 0

            </span>

        </div>

        <div>

            <label>Grand Total</label>

            <span id="grandTotal">

                Rp 0

            </span>

        </div>

        <div>

            <label>Bayar</label>

            <input
                id="paymentAmount"
                type="number">

        </div>

        <div>

            <label>Kembalian</label>

            <span id="changeAmount">

                Rp 0

            </span>

        </div>

        <button id="saveSale">

            Simpan Penjualan

        </button>

    </div>

</div>

`);


const PRODUCT_API = "/api/products";
const CUSTOMER_API = "/api/customers";
const SALES_API = "/api/sales";

const productTable =
    document.getElementById("productTable");
const customerSelect =
    document.getElementById("customerSelect");

const paymentAmount =
    document.getElementById("paymentAmount");

const saveSaleButton =
    document.getElementById("saveSale");
const cartTable = document.getElementById("cartTable");

const subtotal = document.getElementById("subtotal");
const grandTotal = document.getElementById("grandTotal");

const changeAmount =
    document.getElementById("changeAmount");

let cart = [];

async function loadProducts() {

    try {

        const response = await apiFetch(PRODUCT_API);

        if (!response) return;

        const products = await response.json();

        productTable.innerHTML = "";

        products.forEach(product => {

            productTable.innerHTML += `
                <tr>
                    <td>${product.name}</td>
                    <td>Rp ${Number(product.price).toLocaleString("id-ID")}</td>
                    <td>${product.stock}</td>
                    <td>
                        <button onclick="addToCart(${product.id})">
                            Tambah
                        </button>
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

async function loadCustomers() {

    try {

        const response = await apiFetch(CUSTOMER_API);

        if (!response) return;

        const customers = await response.json();

        customerSelect.innerHTML =
            `<option value="">Pilih Customer</option>`;

        customers.forEach(customer => {

            customerSelect.innerHTML += `

                <option value="${customer.id}">

                    ${customer.name}

                </option>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

window.addToCart = addToCart;

async function addToCart(id) {

    const response = await apiFetch(`${PRODUCT_API}/${id}`);

    if (!response) return;

    const product = await response.json();

    const exist = cart.find(item => item.id === product.id);

        if (exist) {

            if (exist.qty >= exist.stock) {

                alert("Stok produk tidak mencukupi.");

                return;

            }

            exist.qty++;

        } else {

        cart.push({

            id: product.id,
            name: product.name,
            price: Number(product.price),
            stock: Number(product.stock),
            qty: 1

        });

    }

    renderCart();

}

function renderCart() {

    cartTable.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        const subtotalItem = item.qty * item.price;

        total += subtotalItem;

        cartTable.innerHTML += `

            <tr>

                <td>${item.name}</td>

                <td>

                    <button onclick="decreaseQty(${item.id})">-</button>

                    <span style="margin:0 10px">

                        ${item.qty}

                    </span>

                    <button onclick="increaseQty(${item.id})">+</button>

                </td>

                <td>
                    Rp ${item.price.toLocaleString("id-ID")}
                </td>

                <td>
                    Rp ${subtotalItem.toLocaleString("id-ID")}
                </td>

                <td>

                    <button
                        onclick="removeCart(${item.id})">

                        X

                    </button>

                </td>

            </tr>

        `;

    });

    subtotal.textContent =
        "Rp " + total.toLocaleString("id-ID");

    grandTotal.textContent =
        "Rp " + total.toLocaleString("id-ID");
        
    calculateChange();
}

function removeCart(id){

    cart = cart.filter(item => item.id !== id);

    renderCart();

}

function increaseQty(id) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    if (item.qty >= item.stock) {

        alert("Stok produk tidak mencukupi.");

        return;

    }

    item.qty++;

    renderCart();

}

function decreaseQty(id){

    const item = cart.find(item => item.id === id);

    if(!item) return;

    item.qty--;

    if(item.qty <= 0){

        cart = cart.filter(p => p.id !== id);

    }

    renderCart();

}

function calculateChange(){

    const total = cart.reduce((sum,item)=>{

        return sum + item.price * item.qty;

    },0);

    const bayar =
        Number(paymentAmount.value);

    const kembali =
        bayar - total;

    changeAmount.textContent =
        "Rp " + Math.max(kembali,0)
        .toLocaleString("id-ID");

}

paymentAmount.addEventListener(

    "input",

    calculateChange

);


window.removeCart = removeCart;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;

async function saveSale() {

    if (cart.length === 0) {

        alert("Keranjang kosong");

        return;

    }

    if (!customerSelect.value) {

        alert("Pilih customer");

        return;

    }

    const total = cart.reduce((sum,item)=>{

        return sum + item.price * item.qty;

    },0);

    const sale = {

        customer_id: customerSelect.value,

        total,

        payment_method: "Cash",

        status: "Paid"

    };

    const details = cart.map(item => ({

        product_id: item.id,

        quantity: item.qty,

        price: item.price,

        subtotal: item.price * item.qty

    }));

    try {

        const response = await apiFetch(SALES_API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                sale,
                details
            })
        });

        if (!response) return;

        const result = await response.json();

        alert(result.message ?? "Transaksi berhasil.");

        cart = [];

        renderCart();

        paymentAmount.value = "";

        customerSelect.value = "";

        calculateChange();

        await loadProducts();
        await loadCustomers();

    } catch (error) {

        console.error(error);

    }

}

saveSaleButton.addEventListener(
    "click",
    saveSale
);

loadProducts();
loadCustomers();