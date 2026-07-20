// ===============================
// API
// ===============================

const API_URL = "/api/customers";


// ===============================
// DOM
// ===============================

const customerForm = document.getElementById("customerForm");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerEmail = document.getElementById("customerEmail");
const customerAddress = document.getElementById("customerAddress");

const customerTable = document.getElementById("customerTable");

let editingId = null;


// ===============================
// LOAD DATA
// ===============================

async function loadCustomers() {

    const response = await fetch(API_URL);
    const customers = await response.json();

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
        name: customerName.value,
        phone: customerPhone.value,
        email: customerEmail.value,
        address: customerAddress.value
    };

    if (editingId) {

        await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

    } else {

        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

    }

    customerForm.reset();
    editingId = null;

    loadCustomers();

});


// ===============================
// EDIT
// ===============================

async function editCustomer(id) {

    const response = await fetch(`${API_URL}/${id}`);
    const customer = await response.json();

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

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadCustomers();

}


// ===============================
// INIT
// ===============================

loadCustomers();