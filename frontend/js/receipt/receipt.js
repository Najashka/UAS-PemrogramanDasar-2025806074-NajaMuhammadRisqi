import { apiFetch } from "../api/api.js";

const receipt = document.getElementById("receipt");

const params = new URLSearchParams(location.search);

const saleId = params.get("id");

const autoPrint = params.get("print");

loadReceipt();

async function loadReceipt() {

    const response = await apiFetch(`/api/sales/${saleId}`);

    if (!response) return;

    const data = await response.json();

    renderReceipt(data);

}

function renderReceipt(data) {

    const { sale, details } = data;

    receipt.innerHTML = `

        <div class="receipt-paper">

            <div class="store">

                <h2>CIPUY STORE</h2>

                <small>

                    Sales Inventory System

                </small>

                <small>

                    Tangerang, Indonesia

                </small>

            </div>

            <hr>

            <div class="info">

                <div>
                    <span>Tanggal</span>
                    <span>${new Date(sale.sale_date).toLocaleString("id-ID")}</span>
                </div>

                <div>

                    <span>No. Transaksi</span>

                    <span>#${sale.id}</span>

                </div>

                <div>
                    <span>Customer</span>
                    <span>${sale.customer}</span>
                </div>

            </div>

            <hr>

            ${details.map(item => `

                <div class="item">

                    <div class="item-name">

                        ${item.product}

                    </div>

                    <div class="item-detail">

                        ${item.quantity} × ${formatRupiah(item.price)}

                        <strong>

                            ${formatRupiah(item.subtotal)}

                        </strong>

                    </div>

                </div>

            `).join("")}

            <hr>

            <div class="total">

                <span>Total</span>

                <strong>${formatRupiah(sale.total)}</strong>

            </div>

            <div class="total">

                <span>Bayar</span>

                <strong>${formatRupiah(sale.payment)}</strong>

            </div>

            <div class="total">

                <span>Kembali</span>

                <strong>${formatRupiah(sale.change_amount)}</strong>

            </div>

            <hr>

            <div class="footer">

                <p>

                    Terima kasih telah berbelanja

                </p>

                <small>

                    Barang yang sudah dibeli
                    tidak dapat dikembalikan.

                </small>

            </div>

            <button id="printButton">

                🖨️ Cetak Struk

            </button>

        </div>

    `;

    document
        .getElementById("printButton")
        .onclick = () => {

            window.print();

        };

    if (autoPrint === "true") {

        setTimeout(() => {

            window.print();

        }, 500);

    }

}

function formatRupiah(number) {

    return new Intl.NumberFormat(

        "id-ID",

        {

            style: "currency",

            currency: "IDR",

            minimumFractionDigits: 0

        }

    ).format(number);

}

window.onafterprint = () => {

    if (autoPrint === "true") {

        location.href = "/pages/sale.html";

    }

};

