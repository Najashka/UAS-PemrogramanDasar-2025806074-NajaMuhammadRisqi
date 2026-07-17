import db from "../config/db.js";


export const getProducts = (callback)=>{


    const sql = `

    SELECT 

    products.id,
    products.name,
    products.price,
    products.stock,

    categories.name AS category,

    suppliers.name AS supplier


    FROM products


    JOIN categories
    ON products.category_id = categories.id


    JOIN suppliers
    ON products.supplier_id = suppliers.id

    `;


    db.query(sql, callback);

};





export const createProduct = (data, callback)=>{


    const sql = `

    INSERT INTO products

    (
    category_id,
    supplier_id,
    name,
    price,
    stock
    )


    VALUES (?,?,?,?,?)

    `;



    db.query(

        sql,

        [
            data.category_id,
            data.supplier_id,
            data.name,
            data.price,
            data.stock
        ],

        callback

    );


};