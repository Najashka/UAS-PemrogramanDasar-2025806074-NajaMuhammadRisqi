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


// ===============================
// State
// ===============================

let editingId = null;