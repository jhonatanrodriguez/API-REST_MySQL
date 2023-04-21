

const Product = require("../dao/product.dao.js");

//create and save a new Product
exports.create =  (req, res) => {
    //validate request
    if (!req.body){
        res.status(400).send({
            message: " Content can not be empty!"
        });
    }

    //create a product
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });

    //save product in the database
    Product.create(product, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occured while creating the Product."
        });
        else res.send(data);
    });
};

//retrieve all products from the database (with condition).
exports.findAll = (req, res) => {
    const name = req.query.name;

    Product.getAll(name, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving products."
        });
        else res.send(data);
    });
};

// find a single product by id
exports.findOne = (req, res) => {
    Product.findById(req.params.id, (err, data) =>{
        if(err){
            if(err.kind ===  "not_found"){
                res.status(404).send({
                    message: `Not found product with id ${req.params.id}.`
                });
            }else{
                res.status(500).send({
                    message: "Error retrieving Product with id" + req.params.id
                });
            }
        }else res.send(data);
    });
};

//find all costly products
exports.findAllCostlyProducts = (req, res) => {
    const price = req.query.price;
    Product.getCostlyProducts(price,(err, data) => {
        if(err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving products."
        });
        else res.send(data);
    });
};

// update a product identified by the id in the request
exports.update = (req, res) => {
    //validate request
    if(!req.body){
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    console.log(req.body);

    Product.updateById(
        req.params.id,
        new Product(req.body), (err, data) => {
            if(err){
                if(err.kind === "not_found"){
                    res.status(404).send({
                        message: `Not found Product with id ${req.params.id}.`
                    });
                }else{
                    res.status(500).send({
                        message: "Error updating Product with id" + req.params.id
                    });
                }
            }
            else res.send(data);
        }
    );
};

// delete a product with the specified id in the request

exports.delete = (req, res) => {
    Product.remove(req.params.id, (err, data) => {
        if(err){
            if(err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Product with id ${req.params.id}.`
                });
            }else{
                res.status(500).send({
                    message: "Could not delete product with id" + req.params.id
                });
            }
        }else res.send({message: `Product was deleted successfully`});
    });
};
//Delete all product from the database.
exports.deleteAll = (req, res) => {
    Product.removeAll((err, data) => {
        if(err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing all Products."
        });
        else res.send({message: `All products were deleted successfully!`});
    });
};