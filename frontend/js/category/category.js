import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";


requireAuth("admin");

renderLayout("Category", `

<div class="page-header">

    <h2>Category</h2>

</div>

<div class="card">

    <h3>Tambah Category</h3>

    <form id="categoryForm">

        <input
            id="categoryName"
            type="text"
            placeholder="Nama Category"
            required>

        <button type="submit">

            Tambah

        </button>

    </form>

</div>

<div class="card">

    <h3>Daftar Category</h3>

    <table class="table">

        <thead>

            <tr>

                <th>ID</th>

                <th>Nama</th>

                <th width="150">Aksi</th>

            </tr>

        </thead>

        <tbody id="categoryTable"></tbody>

    </table>

</div>

`);

const token = localStorage.getItem("token");

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
};

const API_URL = "/api/categories";

const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryTable = document.getElementById("categoryTable");

let editingId = null;

function createRow(category) {
    return `
        <tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td class="action-buttons">
                <button class="btn-edit" data-id="${category.id}">
                    Edit
                </button>

                <button class="btn-delete" data-id="${category.id}">
                    Hapus
                </button>
            </td>
        </tr>
    `;
}

async function loadCategories() {
    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Gagal mengambil data");
        }

        const categories = await response.json();

        categoryTable.innerHTML = "";

        categories.forEach(category => {
            categoryTable.innerHTML += createRow(category);
        });

    } catch (error) {

        console.error(error);

    }
}

async function addCategory(event) {

    event.preventDefault();

    const name = categoryName.value.trim();

    if (name === "") {
        alert("Nama category harus diisi!");
        return;
    }

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

            body: JSON.stringify({
                name
            })

        });

        if (!response.ok) {
            throw new Error("Gagal menambah category");
        }

        categoryForm.reset();

        editingId = null;

        categoryForm.querySelector("button").textContent =
            "Tambah";

        await loadCategories();

    } catch (error) {

        console.error(error);

        alert("Terjadi kesalahan.");

    }

}

async function deleteCategory(id) {

    const confirmDelete = confirm(
        "Yakin ingin menghapus category ini?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        if (!response.ok) {

            throw new Error("Gagal menghapus category");

        }

        await loadCategories();

    } catch (error) {

        console.error(error);

        alert("Terjadi kesalahan.");

    }

}

async function editCategory(id) {

    try {

        const response = await fetch(`${API_URL}/${id}`);

        const category = await response.json();

        categoryName.value = category.name;

        editingId = id;

        categoryForm.querySelector("button").textContent =
            "Update";

        categoryName.focus();

    } catch (error) {

        console.error(error);

    }

}

function handleTableClick(event) {

    const button = event.target;

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

init();