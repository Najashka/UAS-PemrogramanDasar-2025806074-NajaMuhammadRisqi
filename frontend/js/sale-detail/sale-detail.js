import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";

requireAuth("admin");

renderLayout("Sale Detail", `

<div class="page-header">

    <h2>Sale Detail</h2>

</div>

<div class="card">

    <p>

        <strong>Customer :</strong>

        <span id="customer"></span>

    </p>

    <p>

        <strong>Tanggal :</strong>

        <span id="saleDate"></span>

    </p>

    <p>

        <strong>Status :</strong>

        <span id="status"></span>

    </p>

</div>

<div class="card">

    <table class="table">

        <thead>

            <tr>

                <th>Product</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>

            </tr>

        </thead>

        <tbody id="detailTable">

        </tbody>

    </table>

</div>

<div class="card">

    <h3>

        Grand Total :
        <span id="grandTotal">

            Rp 0

        </span>

    </h3>

</div>

`);

const params = new URLSearchParams(location.search);

const saleId = params.get("id");

const API_URL = "/api/sales";

const customer =
    document.getElementById("customer");

const saleDate =
    document.getElementById("saleDate");

const status =
    document.getElementById("status");

const grandTotal =
    document.getElementById("grandTotal");

const detailTable =
    document.getElementById("detailTable");

async function loadSale() {

    try {

        const response =
            await apiFetch(`${API_URL}/${saleId}`);

        if (!response) return;

        const data =
            await response.json();

        customer.textContent =
            data.sale.customer;

        saleDate.textContent =
            new Date(data.sale.sale_date)
            .toLocaleString("id-ID");

        status.textContent =
            data.sale.status;

        grandTotal.textContent =
            "Rp " +
            Number(data.sale.total)
            .toLocaleString("id-ID");

        detailTable.innerHTML = "";

        data.details.forEach(item => {

            detailTable.innerHTML += `

                <tr>

                    <td>${item.product_name}</td>

                    <td>${item.quantity}</td>

                    <td>

                        Rp ${Number(item.price)
                            .toLocaleString("id-ID")}

                    </td>

                    <td>

                        Rp ${Number(item.subtotal)
                            .toLocaleString("id-ID")}

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

loadSale();