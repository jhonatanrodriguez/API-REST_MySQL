
module.exports = app => {
    const product = require("../controllers/product.controller.js");

    var router = require("express").Router();

    //create a new producto
    router.post("/", product.create);
    
    //retrieve all product
    router.get("/", product.findAll);

    //retrieve all costly products
    router.get("/price/", product.findAllCostlyProducts);

    //retrieve a single product with id
    router.get("/:id", product.findOne);

    //update a product with id
    router.put("/:id", product.update);

    //deletea product with id
    router.delete("/:id", product.delete);

    //delete all product
    router.delete("/", product.deleteAll);

    app.use('/api/product', router);
};