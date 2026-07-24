import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";
import { apiFetch } from "../api/api.js";


requireAuth("admin");


renderLayout("Sales History", `


<div class="page-header">

    <h2>Sales History</h2>

</div>


<div class="card">


    <div class="table-header">


        <h3>Riwayat Penjualan</h3>


        <input
            id="searchSale"
            placeholder="Cari Customer">


    </div>



    <table class="table">


        <thead>

            <tr>

                <th>No</th>

                <th>Customer</th>

                <th>Tanggal</th>

                <th>Pembayaran</th>

                <th>Status</th>

                <th>Total</th>

                <th>Aksi</th>

            </tr>


        </thead>


        <tbody id="saleHistoryTable">


        </tbody>


    </table>


</div>


`);


// ===============================
// API
// ===============================

const SALES_API = "/api/sales";


// ===============================
// DOM
// ===============================

const saleHistoryTable =
    document.getElementById("saleHistoryTable");


// ===============================
// Load Sales History
// ===============================

async function loadSalesHistory() {


    try {


        const response = await apiFetch(SALES_API);


        if (!response) return;


        const sales = await response.json();



        if (!response.ok) {

            alert(sales.message);

            return;

        }



        saleHistoryTable.innerHTML = "";



        sales.forEach((sale, index) => {


            saleHistoryTable.innerHTML += `

            <tr>


                <td>${index + 1}</td>


                <td>${sale.customer}</td>


                <td>
                    ${new Date(sale.sale_date)
                    .toLocaleDateString("id-ID")}
                </td>


                <td>
                    ${sale.payment_method}
                </td>


                <td>
                    ${sale.status}
                </td>


                <td>
                    Rp ${Number(sale.total)
                    .toLocaleString("id-ID")}
                </td>


                <td>

                    <button>
                        Detail
                    </button>

                </td>


            </tr>


            `;


        });



    } catch(error) {


        console.error(error);


    }


}



loadSalesHistory();