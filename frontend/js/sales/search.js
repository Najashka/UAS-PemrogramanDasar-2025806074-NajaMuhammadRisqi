import { state } from "./state.js";
import { getProducts } from "./api.js";

export async function loadProducts() {

    try {

        state.products = await getProducts();

        console.log(state.products);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}