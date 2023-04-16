const sql = require("./db.js");
// constructor
const Product = function(Product){
    this.name = Product.name;
    this.description = Product.description;
    this.price = Product.price;
};
Product.create = (newProduct, result) => {
    sql.query("INSERT INTO product SET ?", newProduct, (err,res) => {
        if(err){
            console.log("error:", err);
            result(err, null);
            return;
        }
        console.log("created product:", { id: res.insertId, ...newProduct});
        result(null, { id: res.insertId, ...newProduct });
    });
};
Product.findById = (id, result) => {
    sql.query(`SELECT * FROM product WHERE id = ${id}`, (err, res)=>{
        if(err){
            console.log("error:", err);
            result(err, null);
            return;
        }
        if(res.length){
            console.log("found Product:", res[0]);
            result(null, res[0]);
            return;
        }
        //not found Product with the id
        result({kind: "not_found"}, null);
    });
};
Product.getAll = (name, result)=> {
    let query = "SELECT * FROM product";
    console.log(name);
    if(name){
        query += ` WHERE name LIKE '%${name}%'`;
    }
    sql.query(query, (err, res) =>{
        if (err){
            console.log("error:", err);
            result(null, err);
            return;
        }
        console.log("Products:", res);
        result(null, res);
    });
};
Product.getCostlyProducts = (price,result) => {
    let query = "SELECT * FROM product";
    console.log(price);
    if (price){
        query += ` WHERE price > ${price}`;
    }
    console.log(query);
    sql.query(query, (err, res) => {
        if(err){
            console.log("error:", err);
            result(null, err);
            return;
        }
        console.log("products:", res);
        result(null, res);
    });
};
Product.updateById = (id, product, result) => {
    sql.query("UPDATE product SET name=?, description = ?, price = ? WHERE id = ?",
    [product.name, product.description, product.price, id],
    (err, res) => {
      if(err){
        console.log("error:", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0){
        //not found product with the id
        result({ kind: "not_found"}, null);
        return;
      }
      console.log("updated product:", {id:id, ...product});
      result(null, { id: id, ...product});
      }
    );
};
Product.remove = (id, result) => {
    sql.query("DELETE FROM product WHERE id = ?", id, (err, res) => {
     if(err){
         console.log("error:", err);
         result(null, err);
         return;
     }
     if(res.affectedRows == 0){
         //not found product with the id
         result({kind: "not_found"}, null);
         return;
     }
     console.log("deleted product with id:", id);
     result(null, res);
    });
 };
Product.removeAll = result => {
    sql.query("DELETE FROM product", (err,res) => {
        if(err){
            console.log("error:", err);
            result(null, err);
            return;
        }
        console.log(`deleted ${res.affectedRows} products`);
        result(null, res);
    });
};
module.exports = Product;