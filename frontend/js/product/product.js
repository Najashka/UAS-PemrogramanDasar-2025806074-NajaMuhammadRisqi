import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";

requireAuth("admin");

renderLayout("Product", `

<div class="page-header">

    <h2>Product</h2>

</div>

<div class="card">

    <h3>Tambah Product</h3>

    <form id="productForm">

        <div class="form-grid">

            <div>

                <label>Nama Product</label>

                <input
                    type="text"
                    id="productName"
                    required>

            </div>

            <div>

                <label>Category</label>

                <select id="categorySelect">

                </select>

            </div>

            <div>

                <label>Supplier</label>

                <select id="supplierSelect">

                </select>

            </div>

            <div>

                <label>Harga</label>

                <input
                    type="number"
                    id="productPrice"
                    required>

            </div>

            <div>

                <label>Stock</label>

                <input
                    type="number"
                    id="productStock"
                    required>

            </div>

        </div>

        <button
            type="submit"
            class="btn-primary">

            Tambah Product

        </button>

    </form>

</div>

<div class="card">

    <div class="table-header">

        <h3>Daftar Product</h3>

        <input
            id="searchProduct"
            placeholder="Cari Product">

    </div>

    <table class="table">

        <thead>

            <tr>

                <th>ID</th>

                <th>Nama</th>

                <th>Category</th>

                <th>Supplier</th>

                <th>Harga</th>

                <th>Stock</th>

                <th>Aksi</th>

            </tr>

        </thead>

        <tbody id="productTable">

        </tbody>

    </table>

</div>

`);


// ===============================
// API
// ===============================

const PRODUCT_API = "/api/products";
const CATEGORY_API = "/api/categories";
const SUPPLIER_API = "/api/suppliers";


// ===============================
// DOM
// ===============================

const productForm = document.getElementById("productForm");

const submitButton = productForm.querySelector("button[type='submit']");

const productName = document.getElementById("productName");
const productCategory = document.getElementById("categorySelect");
const productSupplier = document.getElementById("supplierSelect");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");

const productTable = document.getElementById("productTable");


// ===============================
// State
// ===============================


// ===============================
// Load Categories
// ===============================

async function loadCategories() {

    try {

        const response = await apiFetch(CATEGORY_API);

        if (!response) return;

        const categories = await response.json();

        if (!response.ok) {

            alert(categories.message);

            return;

        }

        productCategory.innerHTML =
            `<option value="">Pilih Category</option>`;

        categories.forEach(category => {

            productCategory.innerHTML += `
                <option value="${category.id}">
                    ${category.name}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// Load Suppliers
// ===============================

async function loadSuppliers() {

    try {

        const response = await apiFetch(SUPPLIER_API);

        if (!response) return;

        const suppliers = await response.json();

        if (!response.ok) {

            alert(suppliers.message);

            return;

        }

        productSupplier.innerHTML =
            `<option value="">Pilih Supplier</option>`;

        suppliers.forEach(supplier => {

            productSupplier.innerHTML += `
                <option value="${supplier.id}">
                    ${supplier.name}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// Load Products
// ===============================

async function loadProducts() {

    try {

        const response = await apiFetch(PRODUCT_API);

        if (!response) return;

        const products = await response.json();

        if (!response.ok) {

            alert(products.message);

            return;

        }
        if (!Array.isArray(products)) {

            console.error(products);

            return;

        }

        productTable.innerHTML = "";

        products.forEach((product, index) => {

            productTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.supplier}</td>
                    <td>Rp ${Number(product.price).toLocaleString("id-ID")}</td>
                    <td>${product.stock}</td>
                    <td>
                        <button onclick="editProduct(${product.id})">Edit</button>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// Save Product
// ===============================

async function saveProduct(e) {

    e.preventDefault();

    const product = {
        category_id: productCategory.value,
        supplier_id: productSupplier.value,
        name: productName.value.trim(),
        price: productPrice.value,
        stock: productStock.value
    };

    // Validasi sederhana
    if (
        !product.category_id ||
        !product.supplier_id ||
        !product.name ||
        !product.price ||
        !product.stock
    ) {
        alert("Semua field wajib diisi!");
        return;
    }

    try {

        const url = editingId
            ? `${PRODUCT_API}/${editingId}`
            : PRODUCT_API;

        const method = editingId
            ? "PUT"
            : "POST";

        const response = await apiFetch(url,{

            method,

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(product)

        });

        if(!response) return;

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(result.message);

        productForm.reset();

        editingId = null;

        submitButton.textContent = "Tambah";

        loadProducts();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ===============================
// Edit Product
// ===============================

async function editProduct(id) {

    try {

        const response = await apiFetch(`${PRODUCT_API}/${id}`);

        if(!response) return;
        const product = await response.json();
        if(!response.ok){

            alert(product.message);

            return;

        }

        editingId = id;

        productName.value = product.name;
        productCategory.value = product.category_id;
        productSupplier.value = product.supplier_id;
        productPrice.value = product.price;
        productStock.value = product.stock;

        submitButton.textContent = "Update";

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// Delete Product
// ===============================

async function deleteProduct(id) {

    const confirmDelete = confirm("Yakin ingin menghapus product?");

    if (!confirmDelete) return;

    try {

        const response = await apiFetch(`${PRODUCT_API}/${id}`,{

            method:"DELETE"

        });

        if(!response) return;

        const result = await response.json();

        alert(result.message);

        loadProducts();

    } catch (error) {

        console.error(error);

    }

}

let editingId = null;

productForm.addEventListener("submit", saveProduct);

loadCategories();
loadSuppliers();
loadProducts();

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;