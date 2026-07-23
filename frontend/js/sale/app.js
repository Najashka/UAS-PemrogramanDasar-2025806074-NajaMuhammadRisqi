import { requireAuth } from "../auth/guard.js";

requireAuth("admin", "cashier");