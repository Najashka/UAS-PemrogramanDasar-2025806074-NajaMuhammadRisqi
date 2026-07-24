const token = localStorage.getItem("token");

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
};

export async function getProducts() {

    const response = await fetch("/api/products", {
        headers
    });

    const result = await response.json();

    if (!response.ok) {

        throw new Error(result.message);

    }

    return result;

}