import { requireAuth } from "../auth/guard.js";
import { renderLayout } from "../layout/layout.js";

requireAuth("admin");

renderLayout(`

<h1>Dashboard</h1>

<p>Selamat datang di Sales Inventory System.</p>

`);