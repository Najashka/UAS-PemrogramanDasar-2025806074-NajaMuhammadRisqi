import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";
import { showToast } from "../utils/toast.js";
import { showLoading, hideLoading } from "../utils/loading.js";

// ===============================
// AUTH
// ===============================

requireAuth("admin");


// ===============================
// RENDER LAYOUT
// ===============================

renderLayout("Customer", `

<div class="page-header">

    <h2>Customer</h2>

    <button
        id="openModal"
        class="btn btn-primary">

        <i class="fa-solid fa-plus"></i>
        Tambah Customer

    </button>

</div>

<div class="card">

    <div class="table-header">

        <input
            id="searchCustomer"
            class="search-input"
            placeholder="Cari Customer...">

    </div>

    <table class="table">

        <thead>

            <tr>

                <th width="60">No</th>
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

<div
    id="customerModal"
    class="modal">

    <div class="modal-content">

        <div class="modal-header">

            <h3 id="modalTitle">

                Tambah Customer

            </h3>

            <button
                id="closeModal"
                class="modal-close">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>

        <form id="customerForm">

            <div class="form-grid">

                <div>

                    <label for="customerName">

                        Nama Customer

                    </label>

                    <input
                        id="customerName"
                        type="text"
                        required>

                </div>

                <div>

                    <label for="customerPhone">

                        No HP

                    </label>

                    <input
                        id="customerPhone"
                        type="text"
                        required>

                </div>

                <div>

                    <label for="customerEmail">

                        Email

                    </label>

                    <input
                        id="customerEmail"
                        type="email">

                </div>

                <div class="full-width">

                    <label for="customerAddress">

                        Alamat

                    </label>

                    <textarea
                        id="customerAddress"
                        rows="3"></textarea>

                </div>

            </div>

            <button
                type="submit"
                class="btn btn-primary">

                <i class="fa-solid fa-plus"></i>
                Simpan

            </button>

        </form>

    </div>

</div>

`);


// ===============================
// API
// ===============================

const API_URL = "/api/customers";


// ===============================
// DOM
// ===============================

const customerForm =
    document.getElementById("customerForm");

const customerName =
    document.getElementById("customerName");

const customerPhone =
    document.getElementById("customerPhone");

const customerEmail =
    document.getElementById("customerEmail");

const customerAddress =
    document.getElementById("customerAddress");

const customerTable =
    document.getElementById("customerTable");

const searchCustomer =
    document.getElementById("searchCustomer");

const customerModal =
    document.getElementById("customerModal");

const openModal =
    document.getElementById("openModal");

const closeModal =
    document.getElementById("closeModal");

const submitButton =
    customerForm.querySelector(
        "button[type='submit']"
    );

const modalTitle =
    document.getElementById("modalTitle");


// ===============================
// STATE
// ===============================

let editingId = null;

// ===============================
// LOAD CUSTOMERS
// ===============================
async function loadCustomers() {
  showLoading();

  try {
    const response = await apiFetch(API_URL);
    if (!response) return;

    const customers = await response.json();

    if (!response.ok) {
        throw new Error(
            customers.message || "Gagal mengambil data customer"
        );
    }

    if (customers.length === 0) {
      customerTable.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">
            Tidak ada data customer
          </td>
        </tr>
      `;
      return;
    }

    customerTable.innerHTML = customers
      .map((customer, index) => createRow(customer, index))
      .join("");
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  } finally {
    hideLoading();
  }
}

// ===============================
// SAVE CUSTOMER
// ===============================
async function saveCustomer(event) {
  event.preventDefault();

    const payload = {

        name: customerName.value.trim(),
        phone: customerPhone.value.trim(),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim()

    };

if (!payload.name || !payload.phone) {
    showToast("Nama dan No HP wajib diisi!", "warning");
    return;
  }

  showLoading();

  try {
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    const response = await apiFetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response) return;

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Terjadi kesalahan"
    );
    }

    showToast(
      editingId
        ? "Customer berhasil diperbarui"
        : "Customer berhasil ditambahkan",
      "success"
    );

    hideModal();
    await loadCustomers();
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  } finally {
    hideLoading();
  }
}

// ===============================
// EDIT CUSTOMER
// ===============================
async function editCustomer(id) {
  showLoading();

  try {
    const response = await apiFetch(`${API_URL}/${id}`);
    if (!response) return;

    const customer = await response.json();

    if (!response.ok) {
        throw new Error(

            customer.message ||
            "Gagal mengambil data customer"

        );
    }

    editingId = customer.id;

    customerName.value = customer.name || "";
    customerPhone.value = customer.phone || "";
    customerEmail.value = customer.email || "";
    customerAddress.value = customer.address || "";

    modalTitle.textContent = "Edit Customer";
    submitButton.innerHTML = `
      <i class="fa-solid fa-floppy-disk"></i> Update
    `;

    showModal();
    customerName.focus();
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  } finally {
    hideLoading();
  }
}

// ===============================
// DELETE CUSTOMER
// ===============================
async function deleteCustomer(id) {
  const confirmDelete = confirm("Yakin ingin menghapus customer ini?");
  if (!confirmDelete) return;

  showLoading();

  try {
    const response = await apiFetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response) return;

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Terjadi kesalahan"
    );
    }

    showToast("Customer berhasil dihapus", "success");
    await loadCustomers();
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  } finally {
    hideLoading();
  }
}

// ===============================
// CREATE ROW
// ===============================
function createRow(customer, index) {

    return `
        <tr>

            <td>${index + 1}</td>

            <td>${escapeHtml(customer.name)}</td>

            <td>${escapeHtml(customer.phone)}</td>

            <td>${escapeHtml(customer.email)}</td>

            <td>${escapeHtml(customer.address)}</td>

            <td class="action-buttons">

                <button
                    class="btn btn-warning btn-sm btn-edit"
                    data-id="${customer.id}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm btn-delete"
                    data-id="${customer.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>
    `;

}

// ===============================
// RESET FORM
// ===============================
function resetForm() {
  customerForm.reset();
  editingId = null;

  modalTitle.textContent = "Tambah Customer";
  submitButton.innerHTML = `
    <i class="fa-solid fa-plus"></i> Simpan
  `;
}

// ===============================
// MODAL CONTROLS
// ===============================
function showModal() {

    customerModal.classList.add("show");

    requestAnimationFrame(() => {
        customerName.focus();
    });

}

function hideModal() {
  customerModal.classList.remove("show");
  resetForm();
}

// ===============================
// SEARCH & EVENTS
// ===============================
function searchCustomerTable() {
  const keyword = searchCustomer.value.trim().toLowerCase();

  customerTable.querySelectorAll("tr").forEach((row) => {
    row.style.display = (row.textContent || "")
    .toLowerCase().includes(keyword)
      ? ""
      : "none";
  });
}

function handleTableClick(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.classList.contains("btn-edit")) {

        return editCustomer(id);

    }

    if (button.classList.contains("btn-delete")) {

        return deleteCustomer(id);

    }

}

function handleModalClick(event) {
  if (event.target === customerModal) {
    hideModal();
  }
}

function handleEscape(event) {
  if (event.key === "Escape" && customerModal.classList.contains("show")) {
    hideModal();
  }
}

function escapeHtml(str) {
    if (str == null) return "-";

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ===============================
// INIT
// ===============================
function init() {
  loadCustomers();

  customerForm.addEventListener("submit", saveCustomer);
  customerTable.addEventListener("click", handleTableClick);
  searchCustomer.addEventListener("input", searchCustomerTable);

  openModal.addEventListener("click", () => {
    resetForm();
    showModal();
  });

  closeModal.addEventListener("click", hideModal);
  customerModal.addEventListener("click", handleModalClick);
  document.addEventListener("keydown", handleEscape);
}

init();