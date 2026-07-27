import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";
import { showToast } from "../utils/toast.js";
import {
    showLoading,
    hideLoading
} from "../utils/loading.js";


requireAuth("admin");

renderLayout("Category", `

<div class="page-header">

    <h2>Category</h2>

    <button
        id="openModal"
        class="btn btn-primary">

        <i class="fa-solid fa-plus"></i>

        Tambah Category

    </button>

</div>

<div class="card">

    <div class="table-header">

        <input
            id="searchCategory"
            class="search-input"
            placeholder="Cari Category">

        <table class="table">

            <thead>

                <tr>

                    <th>No</th>
                    <th>Nama Category</th>
                    <th width="150">Aksi</th>

                </tr>

            </thead>

            <tbody id="categoryTable">

            </tbody>

        </table>

</div>

<div
    id="categoryModal"
    class="modal">

    <div class="modal-content">

        <div class="modal-header">

            <h3 id="modalTitle">

                Tambah Category

            </h3>

            <button
                id="closeModal"
                class="modal-close">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>

        <form id="categoryForm">

            <label>Nama Category</label>

            <input
                id="categoryName"
                required>

            <button
                class="btn btn-primary"
                type="submit">

                Simpan

            </button>

        </form>

    </div>

</div>

`);

const API_URL = "/api/categories";

const categoryForm = 
    document.getElementById("categoryForm");
const categoryName = 
    document.getElementById("categoryName");
const categoryTable = 
    document.getElementById("categoryTable");
const categoryModal =
    document.getElementById("categoryModal");
const openModal =
    document.getElementById("openModal");
const closeModal =
    document.getElementById("closeModal");
const modalTitle =
    document.getElementById("modalTitle");
const submitButton =
    categoryForm.querySelector("button");

let editingId = null;

function createRow(category) {
    return `
        <tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td class="action-buttons">

                <button
                    class="btn btn-warning btn-sm btn-edit"
                    data-id="${category.id}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm btn-delete"
                    data-id="${category.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>
        </tr>
    `;
}

async function loadCategories() {

    showLoading();

    try {

        const response = await apiFetch(API_URL);

        if (!response) return;

        if (!response.ok) {
            throw new Error("Gagal mengambil data");
        }

        const categories = await response.json();

        categoryTable.innerHTML = categories
            .map(createRow)
            .join("");

    } catch (error) {

        console.error(error);

        showToast(
            "Gagal mengambil data category",
            "error"
        );

    } finally {

        hideLoading();

    }

}

async function addCategory(event) {

    event.preventDefault();

    const name = categoryName.value.trim();

    if (name === "") {

        showToast("Nama category harus diisi!", "warning");

        return;

    }

    showLoading();

    try {

        const url = editingId
            ? `${API_URL}/${editingId}`
            : API_URL;

        const method = editingId
            ? "PUT"
            : "POST";

        const response = await apiFetch(url, {

            method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name
            })

        });

        if (!response) return;

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.message);

        }

        showToast(
            editingId
                ? "Category berhasil diperbarui"
                : "Category berhasil ditambahkan",
            "success"
        );

        hideModal();

        await loadCategories();

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");

    } finally {

        hideLoading();

    }

}

async function deleteCategory(id) {

    const confirmDelete = confirm(
        "Yakin ingin menghapus category ini?"
    );

    if (!confirmDelete) return;

    showLoading();

    try {

        const response = await apiFetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        if (!response) return;

        const result = await response.json();

        if (!response.ok) {

            throw new Error(result.message);

        }

        showToast(
            "Category berhasil dihapus",
            "success"
        );

        await loadCategories();

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

async function editCategory(id) {

    showLoading();

    try {

        const response = await apiFetch(`${API_URL}/${id}`);

        if (!response) return;

        const category = await response.json();

        if (!response.ok) {

            throw new Error(category.message);

        }

        editingId = id;

        categoryName.value = category.name;

        modalTitle.textContent = "Edit Category";

        submitButton.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Update
        `;

        showModal();

        categoryName.focus();

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");

    } finally {

        hideLoading();

    }

}

function handleTableClick(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;

    if (button.classList.contains("btn-edit")) {

        editCategory(id);

    }

    if (button.classList.contains("btn-delete")) {

        deleteCategory(id);

    }

}

function init() {

    loadCategories();

    categoryForm.addEventListener(
        "submit",
        addCategory
    );

    categoryTable.addEventListener(
        "click",
        handleTableClick
    );

}


function showModal() {

    categoryModal.classList.add("show");

}

function hideModal() {

    categoryModal.classList.remove("show");

    categoryForm.reset();

    editingId = null;

    modalTitle.textContent = "Tambah Category";

    submitButton.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        Simpan
    `;

}

init();

openModal.addEventListener(
    "click",
    showModal
);

closeModal.addEventListener(
    "click",
    hideModal
);

categoryModal.addEventListener("click", (event) => {

    if (event.target === categoryModal) {

        hideModal();

    }

});

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        hideModal();

    }

});