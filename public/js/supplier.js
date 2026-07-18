// ===============================
// API
// ===============================

const API_URL = "/api/suppliers";


// ===============================
// DOM
// ===============================

const supplierForm = document.getElementById("supplierForm");

const supplierName = document.getElementById("supplierName");
const supplierPhone = document.getElementById("supplierPhone");
const supplierAddress = document.getElementById("supplierAddress");

const supplierTable = document.getElementById("supplierTable");


// ===============================
// State
// ===============================

// ===============================
// Load Suppliers
// ===============================

async function loadSuppliers() {

    try {

        const response = await fetch(API_URL);

        const suppliers = await response.json();

        renderTable(suppliers);

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// Render Table
// ===============================

function renderTable(suppliers) {

    supplierTable.innerHTML = "";

    suppliers.forEach((supplier) => {

        supplierTable.innerHTML += `
            <tr>

                <td>${supplier.id}</td>

                <td>${supplier.name}</td>

                <td>${supplier.phone}</td>

                <td>${supplier.address}</td>

                <td>

                    <button
                        class="btn-edit"
                        data-id="${supplier.id}">
                        Edit
                    </button>

                    <button
                        class="btn-delete"
                        data-id="${supplier.id}">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    });

}

// ===============================
// Create Supplier
// ===============================

async function addSupplier(event) {

    event.preventDefault();

    const supplier = {

        name: supplierName.value.trim(),
        phone: supplierPhone.value.trim(),
        address: supplierAddress.value.trim()

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(supplier)

        });

        if (!response.ok) {

            throw new Error("Gagal menambahkan supplier");

        }

        supplierForm.reset();

        loadSuppliers();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

let editingId = null;

loadSuppliers();

supplierForm.addEventListener("submit", addSupplier);