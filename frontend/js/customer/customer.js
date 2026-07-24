import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";

requireAuth("admin");

renderLayout("Customer", `

<div class="page-header">

    <h2>Customer</h2>

</div>

<div class="card">

    <h3>Tambah Customer</h3>

    <form id="customerForm">

        <div class="form-grid">

            <div>

                <label>Nama Customer</label>

                <input
                    type="text"
                    id="customerName"
                    required>

            </div>

            <div>

                <label>No HP</label>

                <input
                    type="text"
                    id="customerPhone"
                    required>

            </div>

            <div>

                <label>Email</label>

                <input
                    type="email"
                    id="customerEmail">

            </div>

            <div class="full-width">

                <label>Alamat</label>

                <textarea
                    id="customerAddress"
                    rows="3"></textarea>

            </div>

        </div>

        <button
            type="submit"
            class="btn-primary">

            Tambah Customer

        </button>

    </form>

</div>

<div class="card">

    <div class="table-header">

        <h3>Daftar Customer</h3>

        <input
            id="searchCustomer"
            placeholder="Cari Customer">

    </div>

    <table class="table">

        <thead>

            <tr>

                <th>ID</th>

                <th>Nama</th>

                <th>Phone</th>

                <th>Email</th>

                <th>Alamat</th>

                <th width="150">Aksi</th>

            </tr>

        </thead>

        <tbody id="customerTable">

        </tbody>

    </table>

</div>

`);


// ===============================
// API
// ===============================

const API_URL = "/api/customers";


// ===============================
// DOM
// ===============================

const customerForm=document.getElementById("customerForm");

const customerName=document.getElementById("customerName");
const customerPhone=document.getElementById("customerPhone");
const customerEmail=document.getElementById("customerEmail");
const customerAddress=document.getElementById("customerAddress");

const customerTable=document.getElementById("customerTable");

const submitButton=
customerForm.querySelector("button[type='submit']");

const searchCustomer=
document.getElementById("searchCustomer");

let editingId=null;


// ===============================
// LOAD DATA
// ===============================

async function loadCustomers() {

    const response = await apiFetch(API_URL);

    if (!response) return;

    const customers = await response.json();

    if (!response.ok) {

        alert(customers.message);

        return;

    }

    customerTable.innerHTML = "";

    customers.forEach(createRow);

}


// ===============================
// CREATE ROW
// ===============================

function createRow(customer) {

    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${customer.id}</td>
        <td>${customer.name}</td>
        <td>${customer.phone ?? ""}</td>
        <td>${customer.email ?? ""}</td>
        <td>${customer.address ?? ""}</td>
        <td>
            <button onclick="editCustomer(${customer.id})">Edit</button>
            <button onclick="deleteCustomer(${customer.id})">Delete</button>
        </td>
    `;

    customerTable.appendChild(tr);

}


// ===============================
// SAVE
// ===============================

customerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {
        name: customerName.value.trim(),
        phone: customerPhone.value.trim(),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim()
    };

    let response;

    if (editingId) {

        response = await apiFetch(`${API_URL}/${editingId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

    } else {

        response = await apiFetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

    }

    if (!response) return;

    const result = await response.json();

    if (!response.ok) {

        alert(result.message);

        return;

    }

    alert(result.message);

    customerForm.reset();

    editingId = null;

    submitButton.textContent = "Tambah Customer";

    customerName.focus();

    loadCustomers();

});


// ===============================
// EDIT
// ===============================

async function editCustomer(id) {

    const response = await apiFetch(`${API_URL}/${id}`);

    if (!response) return;

    const customer = await response.json();

    if (!response.ok) {

        alert(customer.message);

        return;

    }

    customerName.value = customer.name;
    customerPhone.value = customer.phone;
    customerEmail.value = customer.email;
    customerAddress.value = customer.address;

    editingId = customer.id;

}


// ===============================
// DELETE
// ===============================

async function deleteCustomer(id) {

    if (!confirm("Delete this customer?")) return;

    const response = await apiFetch(`${API_URL}/${id}`, {

        method: "DELETE"

    });

    if (!response) return;

    const result = await response.json();

    if (!response.ok) {

        alert(result.message);

        return;

    }

    loadCustomers();

}


// ===============================
// INIT
// ===============================

loadCustomers();