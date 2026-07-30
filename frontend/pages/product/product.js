// ===============================
// IMPORT
// ===============================

import { requireAuth } from "../../js/auth/guard.js";
import { renderLayout } from "../../js/layout/layout.js";
import { apiFetch } from "../../js/api/api.js";
import { showToast } from "../../js/utils/toast.js";
import { showLoading, hideLoading } from "../../js/utils/loading.js";

// ===============================
// AUTH
// ===============================

requireAuth("admin");

// ===============================
// RENDER LAYOUT
// ===============================

renderLayout("Product", `

<div class="page-header">

    <div>

        <span class="page-tag">
            Inventory
        </span>

        <h2>Products</h2>

        <p>
            Kelola seluruh produk toko dengan mudah.
        </p>

    </div>

    <button
        id="openModal"
        class="btn btn-primary">

        <i class="fa-solid fa-plus"></i>

        Tambah Product

    </button>

</div>

<div class="card">

    <div class="table-header">

        <div class="search-box">

            <i class="fa-solid fa-magnifying-glass"></i>

            <input
                id="searchProduct"
                class="search-input"
                placeholder="Cari product...">

        </div>

        <select
            id="filterCategory"
            class="filter-select">

            <option value="">
                Semua Category
            </option>

        </select>

    </div>

    <table class="table">

        <thead>

            <tr>

                <th width="60">No</th>
                <th>Nama Product</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Harga</th>
                <th>Stock</th>
                <th width="150">Aksi</th>

            </tr>

        </thead>

        <tbody id="productTable"></tbody>

    </table>

</div>

<!-- MODAL -->

<div
    id="productModal"
    class="modal">

    <div class="modal-content">

        <div class="modal-header">

            <h3 id="modalTitle">

                Tambah Product

            </h3>

            <button
                id="closeModal"
                class="modal-close">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>

        <form id="productForm">

            <div class="form-grid">

                <div>

                    <label>Nama Product</label>

                    <input
                        id="productName"
                        type="text"
                        placeholder="Masukkan nama product"
                        required>

                </div>

                <div>

                    <label>Category</label>

                    <select id="categorySelect"></select>

                </div>

                <div>

                    <label>Supplier</label>

                    <select id="supplierSelect"></select>

                </div>

                <div>

                    <label>Harga</label>

                    <input
                        id="productPrice"
                        type="number"
                        placeholder="0"
                        required>

                </div>

                <div>

                    <label>Stock</label>

                    <input
                        id="productStock"
                        type="number"
                        placeholder="0"
                        required>

                </div>

            </div>

            <button
                type="submit"
                class="btn btn-primary">

                <i class="fa-solid fa-floppy-disk"></i>

                Simpan

            </button>

        </form>

    </div>

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

const productForm =
    document.getElementById("productForm");

const productName =
    document.getElementById("productName");

const productCategory =
    document.getElementById("categorySelect");

const productSupplier =
    document.getElementById("supplierSelect");

const productPrice =
    document.getElementById("productPrice");

const productStock =
    document.getElementById("productStock");

const productTable =
    document.getElementById("productTable");

const searchProduct =
    document.getElementById("searchProduct");

const productModal =
    document.getElementById("productModal");

const openModal =
    document.getElementById("openModal");

const closeModal =
    document.getElementById("closeModal");

const modalTitle =
    document.getElementById("modalTitle");

const submitButton =
    productForm.querySelector(
        "button[type='submit']"
    );

// ===============================
// STATE
// ===============================

let editingId = null;

// ===============================
// CRUD FUNCTION
// ===============================

// ===============================
// LOAD CATEGORIES
// ===============================

async function loadCategories() {

    showLoading();

    try {

        const response = await apiFetch(CATEGORY_API);

        if (!response) return;

        const categories = await response.json();

        if (!response.ok) {

            throw new Error(
                categories.message ||
                "Gagal mengambil data kategori"
            );

        }

        productCategory.innerHTML = `
            <option value="">
                Pilih Category
            </option>
        `;

        categories.forEach(category => {

            productCategory.insertAdjacentHTML(
                "beforeend",
                `
                    <option value="${category.id}">
                        ${category.name}
                    </option>
                `
            );

        });

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");

    } finally {

        hideLoading();

    }

}

// ===============================
// LOAD SUPPLIERS
// ===============================

async function loadSuppliers() {

    showLoading();

    try {

        const response = await apiFetch(SUPPLIER_API);

        if (!response) return;

        const suppliers = await response.json();

        if (!response.ok) {

            throw new Error(

                suppliers.message ||
                "Gagal mengambil data supplier"

            );

        }

        productSupplier.innerHTML = `
            <option value="">
                Pilih Supplier
            </option>
        `;

        suppliers.forEach(supplier => {

            productSupplier.insertAdjacentHTML(

                "beforeend",

                `
                    <option value="${supplier.id}">
                        ${supplier.name}
                    </option>
                `

            );

        });

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");

    } finally {

        hideLoading();

    }

}

// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    showLoading();

    try {

        const response = await apiFetch(PRODUCT_API);

        if (!response) return;

        const products = await response.json();

        if (!response.ok) {

            throw new Error(
                products.message ||
                "Gagal mengambil data product"
            );

        }

        if (!products.length) {

            productTable.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        Tidak ada data product
                    </td>
                </tr>
            `;

            return;

        }

        productTable.innerHTML = products
            .map((product, index) => createRow(product, index))
            .join("");

    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    } finally {

        hideLoading();

    }

}

// ===============================
// SAVE PRODUCT
// ===============================

async function saveProduct(event) {

    event.preventDefault();

    const product = {

        category_id: productCategory.value,
        supplier_id: productSupplier.value,
        name: productName.value.trim(),
        price: productPrice.value,
        stock: productStock.value

    };

    if (

        !product.category_id ||
        !product.supplier_id ||
        !product.name ||
        !product.price ||
        !product.stock

    ) {

        showToast(
            "Semua field wajib diisi!",
            "warning"
        );

        return;

    }

    showLoading();

    try {

        const url = editingId
            ? `${PRODUCT_API}/${editingId}`
            : PRODUCT_API;

        const method = editingId
            ? "PUT"
            : "POST";

        const response = await apiFetch(url, {

            method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(product)

        });

        if (!response) return;

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.message || "Gagal menyimpan product"
            );

        }

        showToast(

            editingId
                ? "Product berhasil diperbarui"
                : "Product berhasil ditambahkan",

            "success"

        );

        hideModal();

        await loadProducts();

    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    } finally {

        hideLoading();

    }

}

// ===============================
// EDIT PRODUCT
// ===============================

async function editProduct(id) {

    showLoading();

    try {

        const response = await apiFetch(
            `${PRODUCT_API}/${id}`
        );

        if (!response) return;

        const product = await response.json();

        if (!response.ok) {

            throw new Error(

                product.message ||
                "Gagal mengambil data product"

            );

        }

        editingId = product.id;

        productName.value = product.name || "";

        productCategory.value =
            product.category_id || "";

        productSupplier.value =
            product.supplier_id || "";

        productPrice.value =
            product.price || "";

        productStock.value =
            product.stock || "";

        modalTitle.textContent =
            "Edit Product";

        submitButton.innerHTML = `

            <i class="fa-solid fa-floppy-disk"></i>

            Update

        `;

        showModal();

        productName.focus();

    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    } finally {

        hideLoading();

    }

}

// ===============================
// DELETE PRODUCT
// ===============================

async function deleteProduct(id) {

    const confirmDelete = confirm(
        "Yakin ingin menghapus product ini?"
    );

    if (!confirmDelete) return;

    showLoading();

    try {

        const response = await apiFetch(
            `${PRODUCT_API}/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response) return;

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Gagal menghapus product"
            );

        }

        showToast(
            "Product berhasil dihapus",
            "success"
        );

        await loadProducts();

    } catch (error) {

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    } finally {

        hideLoading();

    }

}

// ===============================
// EVENT HANDLER
// ===============================

function handleTableClick(event) {

    const button =
        event.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.classList.contains("btn-edit")) {

        editProduct(id);

    } else if (button.classList.contains("btn-delete")) {

        deleteProduct(id);

    }

}

function handleModalClick(event) {

    if (event.target === productModal) {

        hideModal();

    }

}

function handleEscape(event) {

    if (

        event.key === "Escape" &&
        productModal.classList.contains("show")

    ) {

        hideModal();

    }

}

// ===============================
// UI FUNCTION
// ===============================

function showModal() {

    productModal.classList.add("show");

    requestAnimationFrame(() => {

        productName.focus();

    });

}

function hideModal() {

    productModal.classList.remove("show");

    resetForm();

}

function searchProductTable() {

    const keyword =
        searchProduct.value
            .trim()
            .toLowerCase();

    productTable
        .querySelectorAll("tr")
        .forEach(row => {

            row.style.display =
                (row.textContent || "")
                    .toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";

        });

}

function resetForm() {

    productForm.reset();

    editingId = null;

    modalTitle.textContent =
        "Tambah Product";

    submitButton.innerHTML = `

        <i class="fa-solid fa-plus"></i>

        Simpan

    `;

}

// ===============================
// HELPER
// ===============================

function createRow(product, index) {

    return `

        <tr>

            <td>${index + 1}</td>

            <td>${escapeHtml(product.name)}</td>

            <td>${escapeHtml(product.category)}</td>

            <td>${escapeHtml(product.supplier)}</td>

            <td>
                Rp ${Number(product.price).toLocaleString("id-ID")}
            </td>

            <td>

                <span class="${
                    product.stock <= 5
                        ? "stock-low"
                        : "stock-normal"
                }">

                    ${product.stock}

                </span>

            </td>

            <td class="action-buttons">

                <button
                    class="btn btn-warning btn-sm btn-edit"
                    data-id="${product.id}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm btn-delete"
                    data-id="${product.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

    `;

}

function escapeHtml(str) {

    if (str == null || str === "") {

        return "-";

    }

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

}

// ===============================
// INIT
// ===============================

async function init() {

    await loadCategories();

    await loadSuppliers();

    await loadProducts();

    productForm.addEventListener(
        "submit",
        saveProduct
    );

    productTable.addEventListener(
        "click",
        handleTableClick
    );

    searchProduct.addEventListener(
        "input",
        searchProductTable
    );

    openModal.addEventListener(
        "click",
        () => {

            resetForm();

            showModal();

        }
    );

    closeModal.addEventListener(
        "click",
        hideModal
    );

    productModal.addEventListener(
        "click",
        handleModalClick
    );

    document.addEventListener(
        "keydown",
        handleEscape
    );

}

init();