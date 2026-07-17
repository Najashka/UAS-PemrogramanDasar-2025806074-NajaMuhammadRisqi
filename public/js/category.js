const API_URL = "/api/categories";

const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryTable = document.getElementById("categoryTable");

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

        const response = await fetch(API_URL, {

            method: "POST",

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

function handleTableClick(event) {

    const button = event.target;

    if (button.classList.contains("btn-delete")) {

        const id = button.dataset.id;

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