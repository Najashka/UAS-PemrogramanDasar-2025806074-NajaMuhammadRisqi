import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";

requireAuth("admin");

renderLayout("Supplier", `

<div class="page-header">

    <h2>Supplier</h2>

</div>

<div class="card">

    <h3>Tambah Supplier</h3>

    <form id="supplierForm">

        <div class="form-grid">

            <div>

                <label>Nama Supplier</label>

                <input
                    type="text"
                    id="supplierName"
                    required>

            </div>

            <div>

                <label>No HP</label>

                <input
                    type="text"
                    id="supplierPhone"
                    required>

            </div>

            <div class="full-width">

                <label>Alamat</label>

                <textarea
                    id="supplierAddress"
                    rows="3"
                    required></textarea>

            </div>

        </div>

        <button
            type="submit"
            class="btn-primary">

            Tambah Supplier

        </button>

    </form>

</div>

<div class="card">

    <div class="table-header">

        <h3>Daftar Supplier</h3>

        <input
            id="searchSupplier"
            placeholder="Cari Supplier">

    </div>

    <table class="table">

        <thead>

            <tr>

                <th>ID</th>

                <th>Nama</th>

                <th>Phone</th>

                <th>Alamat</th>

                <th width="150">Aksi</th>

            </tr>

        </thead>

        <tbody id="supplierTable">

        </tbody>

    </table>

</div>

`);

const token = localStorage.getItem("token");

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
};

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

const submitButton =
    supplierForm.querySelector("button[type='submit']");

const searchSupplier =
    document.getElementById("searchSupplier");

// ===============================
// State
// ===============================

let editingId = null;
// ===============================
// Load Suppliers
// ===============================

async function loadSuppliers() {

    try {

        const response = await fetch(API_URL, {
            headers
        });

        const suppliers = await response.json();

        if (!Array.isArray(suppliers)) {

            console.error(suppliers);

            return;

        }

        supplierTable.innerHTML = "";

        suppliers.forEach((supplier, index) => {

            supplierTable.innerHTML += `

                <tr>

                    <td>${index + 1}</td>

                    <td>${supplier.name}</td>

                    <td>${supplier.phone}</td>

                    <td>${supplier.address}</td>

                    <td>

                        <button
                            onclick="editSupplier(${supplier.id})">

                            Edit

                        </button>

                        <button
                            onclick="deleteSupplier(${supplier.id})">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// Save Suppliers
// ===============================

async function saveSupplier(e) {

    e.preventDefault();

    const supplier = {

        name: supplierName.value.trim(),

        phone: supplierPhone.value.trim(),

        address: supplierAddress.value.trim()

    };

    if (
        !supplier.name ||
        !supplier.phone ||
        !supplier.address
    ) {

        alert("Semua field wajib diisi!");

        return;

    }

    const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

    const method = editingId
        ? "PUT"
        : "POST";

    try {

        const response = await fetch(url, {

            method,

            headers,

            body: JSON.stringify(supplier)

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.message);

            return;

        }

        alert(result.message);

        supplierForm.reset();

        editingId = null;

        submitButton.textContent = "Tambah Supplier";

        supplierName.focus();

        await loadSuppliers();

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// Edit Supplier
// ===============================

async function editSupplier(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            headers
        });

        const supplier = await response.json();

        if (!response.ok) {

            alert(supplier.message);

            return;

        }

        editingId = id;

        supplierName.value = supplier.name;
        supplierPhone.value = supplier.phone;
        supplierAddress.value = supplier.address;

        submitButton.textContent = "Update Supplier";

    } catch (error) {

        console.error(error);

    }

}

// ===============================
// Delete Supplier
// ===============================

async function deleteSupplier(id) {

    if (!confirm("Yakin ingin menghapus supplier?")) {

        return;

    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE",

            headers

        });

        const result = await response.json();

        if (!response.ok) {

            alert(result.message);

            return;

        }

        alert(result.message);

        await loadSuppliers();

    } catch (error) {

        console.error(error);

    }

}

searchSupplier.addEventListener("input", () => {

    const keyword =
        searchSupplier.value.toLowerCase();

    const rows =
        supplierTable.querySelectorAll("tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText
                .toLowerCase()
                .includes(keyword)
                ? ""
                : "none";

    });

});

supplierForm.addEventListener(
    "submit",
    saveSupplier
);

window.editSupplier = editSupplier;
window.deleteSupplier = deleteSupplier;

loadSuppliers();