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

let editingId = null;
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

        const url = editingId
            ? `${API_URL}/${editingId}`
            : API_URL;

        const method = editingId
            ? "PUT"
            : "POST";

        const response = await fetch(url, {

            method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(supplier)

        });

        if (!response.ok) {

            throw new Error("Gagal menyimpan supplier");

        }

        supplierForm.reset();
        editingId = null;

        supplierForm.querySelector("button").textContent =
            "Tambah";

        loadSuppliers();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ===============================
// Edit Supplier
// ===============================

async function editSupplier(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        const supplier = await response.json();

        supplierName.value = supplier.name;
        supplierPhone.value = supplier.phone;
        supplierAddress.value = supplier.address;

        editingId = id;

        supplierForm.querySelector("button").textContent =
            "Update";

        supplierName.focus();

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// Delete Supplier
// ===============================

async function deleteSupplier(id) {

    const confirmDelete = confirm(
        "Yakin ingin menghapus supplier ini?"
    );

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        if (!response.ok) {

            throw new Error("Gagal menghapus supplier");

        }

        loadSuppliers();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ===============================
// Handle Table Click
// ===============================

function handleTableClick(event) {

    const button = event.target;

    const id = button.dataset.id;

    if (button.classList.contains("btn-edit")) {

        editSupplier(id);

    }

    if (button.classList.contains("btn-delete")) {

        deleteSupplier(id);

    }

}



loadSuppliers();

supplierForm.addEventListener("submit", addSupplier);

supplierTable.addEventListener(
    "click",
    handleTableClick
);