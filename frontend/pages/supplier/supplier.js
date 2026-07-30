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
// RENDERLAYOUT
// ===============================

renderLayout("Supplier", `

<div class="page-header">

    <h2>Supplier</h2>

    <button
        id="openModal"
        class="btn btn-primary">

        <i class="fa-solid fa-plus"></i>

        Tambah Supplier

    </button>

</div>

<div class="card">

    <div class="table-header">

        <input
            id="searchSupplier"
            class="search-input"
            placeholder="Cari Supplier...">

    </div>

    <table class="table">

        <thead>

            <tr>

                <th width="60">No</th>

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

<div
    id="supplierModal"
    class="modal">

    <div class="modal-content">

        <div class="modal-header">

            <h3 id="modalTitle">

                Tambah Supplier

            </h3>

            <button
                id="closeModal"
                type="button"
                class="modal-close">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>

        <form id="supplierForm">

            <div class="form-grid">

                <div>

                    <label for="supplierName">

                        Nama Supplier

                    </label>

                    <input
                        id="supplierName"
                        type="text"
                        required>

                </div>

                <div>

                    <label for="supplierPhone">

                        No HP

                    </label>

                    <input
                        id="supplierPhone"
                        type="tel"
                        required>

                </div>

                <div class="full-width">

                    <label for="supplierAddress">

                        Alamat

                    </label>

                    <textarea
                        id="supplierAddress"
                        rows="3"
                        required>

                    </textarea>

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

const API_URL = "/api/suppliers";

// ===============================
// DOM
// ===============================

const supplierForm = document.getElementById("supplierForm");
const supplierName = document.getElementById("supplierName");
const supplierPhone = document.getElementById("supplierPhone");
const supplierAddress = document.getElementById("supplierAddress");
const supplierTable = document.getElementById("supplierTable");
const searchSupplier = document.getElementById("searchSupplier");
const supplierModal = document.getElementById("supplierModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const submitButton = supplierForm.querySelector("button[type='submit']");
const modalTitle = document.getElementById("modalTitle");

// ===============================
// STATE
// ===============================
let editingId = null;

let suppliers = [];

// ===============================
// CRUD FUNCTION
// ===============================

async function loadSuppliers() {

    showLoading();

    try {

        const response =
            await apiFetch(API_URL);

        if (!response) return;

        if (!response.ok) {

            throw new Error(
                "Gagal mengambil data supplier"
            );

        }

        suppliers =
            await response.json();

        renderSupplierTable(suppliers);

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

async function saveSupplier(event) {
  event.preventDefault();

  const supplier = {
    name: supplierName.value.trim(),
    phone: supplierPhone.value.trim(),
    address: supplierAddress.value.trim()
  };

  if (!supplier.name || !supplier.phone || !supplier.address) {
    showToast("Semua field wajib diisi!", "warning");
    return;
  }

  showLoading();

  try {
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    const response = await apiFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplier)
    });

    if (!response) return;

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menyimpan data");
    }

    showToast(
      editingId ? "Supplier berhasil diperbarui" : "Supplier berhasil ditambahkan",
      "success"
    );

    hideModal();
    await loadSuppliers();
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  } finally {
    hideLoading();
  }
}

async function editSupplier(id) {
  showLoading();
  try {
    const response = await apiFetch(`${API_URL}/${id}`);
    if (!response) return;

    const supplier = await response.json();

    if (!response.ok) {
      throw new Error(supplier.message || "Gagal mengambil detail supplier");
    }

    editingId = id;
    supplierName.value = supplier.name || "";
    supplierPhone.value = supplier.phone || "";
    supplierAddress.value = supplier.address || "";

    modalTitle.textContent = "Edit Supplier";
    submitButton.innerHTML = `
      <i class="fa-solid fa-floppy-disk"></i> Update
    `;

    showModal();
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  } finally {
    hideLoading();
  }
}

async function deleteSupplier(id) {
  const confirmDelete = confirm("Yakin ingin menghapus supplier ini?");
  if (!confirmDelete) return;

  showLoading();

  try {
    const response = await apiFetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response) return;

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal menghapus supplier");
    }

    showToast("Supplier berhasil dihapus", "success");
    await loadSuppliers();
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  } finally {
    hideLoading();
  }
}

// ===============================
// UI FUNCTION
// ===============================

function createRow(supplier, index) {

    return `
        <tr>

            <td>${index + 1}</td>

            <td>${supplier.name}</td>

            <td>${supplier.phone}</td>

            <td>${supplier.address}</td>

            <td class="action-buttons">

                <button
                    class="btn btn-warning btn-sm btn-edit"
                    data-id="${supplier.id}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm btn-delete"
                    data-id="${supplier.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>
    `;

}

function resetForm() {
  supplierForm.reset();
  editingId = null;
  modalTitle.textContent = "Tambah Supplier";
  submitButton.innerHTML = `
    <i class="fa-solid fa-plus"></i> Simpan
  `;
}

function showModal() {

    supplierModal.classList.add("show");

    requestAnimationFrame(() => {

        supplierName.focus();

    });

}

function hideModal() {
  supplierModal.classList.remove("show");
  resetForm();
}

// ===============================
// HELPER
// ===============================

function searchSupplierTable() {

    const keyword =
        searchSupplier.value
            .trim()
            .toLowerCase();

    const filtered = suppliers.filter(

        supplier =>

            supplier.name
                .toLowerCase()
                .includes(keyword)

    );

    renderSupplierTable(filtered);

}

function renderSupplierTable(data) {

    if (!data.length) {

        supplierTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Tidak ada data supplier
                </td>
            </tr>
        `;

        return;

    }

    supplierTable.innerHTML = data
        .map(createRow)
        .join("");

}

function handleTableClick(event) {

    const button =
        event.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.classList.contains("btn-edit")) {

        return editSupplier(id);

    }

    if (button.classList.contains("btn-delete")) {

        return deleteSupplier(id);

    }

}

function handleModalClick(event) {

    if (event.target === supplierModal) {

        hideModal();

    }

}

function handleEscape(event) {

    if (
        event.key === "Escape" &&
        supplierModal.classList.contains("show")
    ) {

        hideModal();

    }

}

// ===============================
// INIT
// ===============================
function init() {

    loadSuppliers();

    supplierForm.addEventListener(
        "submit",
        saveSupplier
    );

    supplierTable.addEventListener(
        "click",
        handleTableClick
    );

    searchSupplier.addEventListener(
        "input",
        searchSupplierTable
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

    supplierModal.addEventListener(
        "click",
        handleModalClick
    );

    document.addEventListener(
        "keydown",
        handleEscape
    );

}

init();