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
const productCategory = document.getElementById("productCategory");
const productSupplier = document.getElementById("productSupplier");
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

        const response = await fetch(SUPPLIER_API);

        const suppliers = await response.json();

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

        const response = await fetch(PRODUCT_API);

        const products = await response.json();

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
// Create Product
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

        const response = await fetch(PRODUCT_API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(product)

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(result.message);

        productForm.reset();

        loadProducts();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

let editingId = null;

productForm.addEventListener("submit", saveProduct);

loadCategories();
loadSuppliers();
loadProducts();