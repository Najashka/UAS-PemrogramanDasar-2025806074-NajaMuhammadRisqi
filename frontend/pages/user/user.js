// ==============================
// IMPORT
// ==============================

import { requireAuth } from "../../js/auth/guard.js";
import { renderLayout } from "../../js/layout/layout.js";
import { apiFetch } from "../../js/api/api.js";
import { showToast } from "../../js/utils/toast.js";
import { showLoading, hideLoading } from "../../js/utils/loading.js";

// ==============================
// AUTH
// ==============================

requireAuth("admin");

// ==============================
// LAYOUT
// ==============================

renderLayout("Users Management", `

<div class="page-header">

    <h2>Users Management</h2>

    <button
        id="addUserBtn"
        class="btn btn-primary">

        <i class="fa-solid fa-plus"></i>
        Tambah User

    </button>

</div>

<div class="card">

    <div class="table-header">

        <input
            id="searchUser"
            class="search-input"
            placeholder="Cari User...">

    </div>

    <table class="table">

        <thead>

            <tr>

                <th>No</th>

                <th>Nama</th>

                <th>Username</th>

                <th>Role</th>

                <th>Status</th>

                <th>Aksi</th>

            </tr>

        </thead>

        <tbody id="userTable">

        </tbody>

    </table>

</div>

<!-- Modal -->

<div
    class="modal"
    id="userModal">

    <div class="modal-content">

        <div class="modal-header">

            <h3 id="modalTitle">

                Tambah User

            </h3>

            <button
                id="closeModal"
                class="modal-close">

                <i class="fa-solid fa-xmark"></i>

            </button>

        </div>

        <form id="userForm">


            <div class="form-grid">


                <div>

                    <label for="name">
                        Nama
                    </label>

                    <input
                        id="name"
                        type="text"
                        required>

                </div>



                <div>

                    <label for="username">
                        Username
                    </label>

                    <input
                        id="username"
                        type="text"
                        required>

                </div>



                <div
                    id="passwordGroup">


                    <label for="password">
                        Password
                    </label>


                    <input
                        id="password"
                        type="password">


                </div>



                <div>

                    <label for="role">
                        Role
                    </label>


                    <select id="role">

                        <option value="admin">
                            Admin
                        </option>

                        <option value="cashier">
                            Cashier
                        </option>

                    </select>


                </div>



                <div>

                    <label for="status">
                        Status
                    </label>


                    <select id="status">

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>


                    </select>


                </div>


            </div>



            <button
                type="submit"
                class="btn btn-primary">


                <i class="fa-solid fa-floppy-disk"></i>

                Simpan


            </button>


        </form>

    </div>

</div>

`);

// ==============================
// DOM ELEMENTS
// ==============================

const userTable =
    document.getElementById("userTable");

const searchUser =
    document.getElementById("searchUser");

const addUserBtn =
    document.getElementById("addUserBtn");

const userModal =
    document.getElementById("userModal");

const closeModal =
    document.getElementById("closeModal");

const userForm =
    document.getElementById("userForm");

const nameInput =
    document.getElementById("name");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const roleSelect =
    document.getElementById("role");

const statusSelect =
    document.getElementById("status");

// ==============================
// STATE
// ==============================

let users = [];

let editingId = null;

// ==============================
// EVENT LISTENERS
// ==============================

addUserBtn.addEventListener("click", openAddModal);

closeModal.addEventListener("click", closeUserModal);

userModal.addEventListener("click", (e) => {

    if (e.target === userModal) {

        closeUserModal();

    }

});

document.addEventListener(
    "keydown",
    (e)=>{


        if(
            e.key === "Escape" &&
            userModal.classList.contains("show")
        ){

            hideModal();

        }


    }
);

userForm.addEventListener("submit", saveUser);

userTable.addEventListener("click", async (e) => {

    const button = e.target.closest("button");

    if (!button) return;


    const id = button.dataset.id;


    if (!id) return;



    // EDIT
    if (button.classList.contains("btn-edit")) {

        editUser(id);

        return;

    }



    // DELETE
    if (button.classList.contains("btn-delete")) {


        if (!confirm("Yakin ingin menghapus user ini?")) {
            return;
        }


        try {


            showLoading();


            const response =
                await apiFetch(`/api/users/${id}`, {

                    method: "DELETE"

                });


            if (!response.ok) {

                const result =
                    await response.json();

                throw new Error(
                    result.message ||
                    "Gagal menghapus user"
                );

            }


            showToast(
                "User berhasil dihapus",
                "success"
            );


            loadUsers();


        } catch (error) {


            showToast(
                error.message,
                "error"
            );


        } finally {

            hideLoading();

        }


        return;

    }



    // RESET PASSWORD
    if (button.classList.contains("btn-reset")) {


        if (!confirm(
            "Reset password menjadi 123456?"
        )) {

            return;

        }


        try {


            showLoading();


            const response =
                await apiFetch(
                    `/api/users/${id}/reset-password`,
                    {
                        method:"PUT"
                    }
                );


            if (!response.ok) {

                const result =
                    await response.json();

                throw new Error(
                    result.message ||
                    "Gagal reset password"
                );

            }


            showToast(
                "Password berhasil direset",
                "success"
            );


        } catch(error) {


            showToast(
                error.message,
                "error"
            );


        } finally {


            hideLoading();


        }


    }


});

searchUser.addEventListener("input", () => {

    const keyword =
        searchUser.value.toLowerCase();

    const filtered =
        users.filter(user =>

            user.name
                .toLowerCase()
                .includes(keyword)

            ||

            user.username
                .toLowerCase()
                .includes(keyword)

        );

    renderTable(filtered);

});

// ==============================
// CRUD FUNCTIONS
// ==============================

// ==============================
// LOAD
// ==============================

async function loadUsers() {

    try {

        const response = await apiFetch("/api/users");

        users = await response.json();

        renderTable(users);

    }

    catch (error) {

        console.error(error);

    }

}

// ==============================
// SAVE USER
// ==============================

async function saveUser(e) {

    e.preventDefault();

    const payload = getFormData();

    try {

        showLoading();

        if (editingId) {

            await apiFetch(`/api/users/${editingId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(payload)

            });

            showToast(

                "User berhasil diperbarui",

                "success"

            );

        }

        else {

            await apiFetch("/api/users", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(payload)

            });

            showToast(

                "User berhasil ditambahkan",

                "success"

            );

        }

        closeUserModal();

        await loadUsers();

    }

    catch (error) {

        console.error(error);

        showToast(

            error.message,

            "error"

        );

    }

    finally {

        hideLoading();

    }

}

// ==============================
// EDIT
    
async function editUser(id) {


    const user = users.find(
        item => item.id == id
    );


    if (!user) return;



    editingId = user.id;



    nameInput.value =
        user.name || "";



    usernameInput.value =
        user.username || "";



    roleSelect.value =
        user.role;



    statusSelect.value =
        user.status;



    passwordInput.value =
        "";



    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit User";



    document.getElementById(
        "passwordGroup"
    ).style.display =
        "none";



    showModal();



    nameInput.focus();


}

// ==============================
// UI FUNCTIONS
// ==============================

function renderTable(data) {

    userTable.innerHTML = "";

    if (!data.length) {

        userTable.innerHTML = `

        <tr>

            <td colspan="6">

                Tidak ada user

            </td>

        </tr>

        `;

        return;

    }

    let html = "";

    data.forEach((user, index) => {

        html += `

        <tr>

            <td>${index + 1}</td>

            <td>${user.name}</td>

            <td>${user.username}</td>

            <td>

                <span class="role ${user.role}">

                    ${user.role}

                </span>

            </td>

            <td>

                <span class="status ${user.status}">

                    ${user.status}

                </span>

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm btn-edit"
                    data-id="${user.id}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-info btn-sm btn-reset"
                    data-id="${user.id}">

                    <i class="fa-solid fa-key"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm btn-delete"
                    data-id="${user.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    userTable.innerHTML = html;

}

// ==============================
// MODAL FUNCTIONS
// ==============================


function openAddModal() {


    resetUserForm();


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Tambah User";


    document.getElementById(
        "passwordGroup"
    ).style.display =
        "block";


    showModal();


}

function closeUserModal(){

    hideModal();

}

function showModal(){

    userModal.classList.add(
        "show"
    );

}

function hideModal(){

    userModal.classList.remove(
        "show"
    );


    resetUserForm();

}

function resetUserForm(){

    userForm.reset();

    editingId = null;

}

function getFormData() {

    return {

        name: nameInput.value,

        username: usernameInput.value,

        password: passwordInput.value,

        role: roleSelect.value,

        status: statusSelect.value

    };

}

// ==============================
// INITIALIZE
// ==============================

loadUsers();