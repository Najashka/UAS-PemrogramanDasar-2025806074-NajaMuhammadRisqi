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

const productName = document.getElementById("productName");
const categorySelect = document.getElementById("categorySelect");
const supplierSelect = document.getElementById("supplierSelect");
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

        const response = await fetch(CATEGORY_API);

        const categories = await response.json();

        categorySelect.innerHTML =
            `<option value="">Pilih Category</option>`;

        categories.forEach(category => {

            categorySelect.innerHTML += `
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

        const response = await fetch(SUPPLIER_API);

        const suppliers = await response.json();

        supplierSelect.innerHTML = `
            <option value="">Pilih Supplier</option>
        `;

        suppliers.forEach(supplier => {

            supplierSelect.innerHTML += `
                <option value="${supplier.id}">
                    ${supplier.name}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

let editingId = null;

loadCategories();
loadSuppliers();