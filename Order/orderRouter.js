
const express = require('express');
const router = express.Router();
const orderController = require('./orderController');
const mongoose = require("mongoose");
const axios = require('axios');
require('../dbconfig/dbfile')

const order = require('./orderModel');
const { response } = require('express');
const Order = require('./orderModel');


/* ----------Insertar un Pedido------------ */

router.post('/order/', async (req, res) => {
    try {
        const newOrder = new order({
            customerId: mongoose.Types.ObjectId(req.body.customerId),
            productId: mongoose.Types.ObjectId(req.body.productId),
            dateSale: req.body.dateSale
        });
        const data = await newOrder.save();
        if (data)
            res.status(200).send('Success')
    } catch (err) {
        console.log('error', err);
    }
})

/* ----------Ver pedido en detalle------------ */

router.get('/order/:id', (req, res) => {
    order.findById(req.params.id).then((order) => {
        if (order) {
            axios.get(`http://localhost:4000/customer/${order.customerId}`).then((response) => {
                let orderObject = {
                    CustomerName: response.data.customerName,
                }
                axios.get(`http://localhost:3000/product/${order.productId}`).then((response) => {

                    orderObject.ProductName = response.data.productName
                    orderObject.ProductDetails = response.data.productDetails
                    orderObject.productPrice = response.data.productPrice
                    console.log("In order", orderObject);

                    res.json(orderObject);
                })
            })
        } else {
            res.status(404).send('Orders not found');
        }
    }).catch((err) => {
        res.status(500).send('Internal Server Error!', err);
    });
})

/* ----------Eliminar un Pedido------------ */

router.delete('/order/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        orderController.deleteOrderById(order, orderId, (err, result) => {
            if (err) {
                res.status(400).send(' ')
            } else {
                res.status(200).send(result)
            }
        })
    } catch (err) {
        res.status(500).send('Internal server error', err)
    }
})

/* ----------Ver todas las compras de cada cliente------------ */

router.get('/order/', async(req, res) => {
    try {
        orderController.getShopping(order, (err, result) => {
            if (err) {
                res.status(400).send(' ', err)
            } else {
                res.status(200).send(result)
            }
        })
    } catch (err) {
        res.status(500).send('Internal server error',err)
    }
})

/* ----------Mostrar ventas generales------------ */

router.get('/sales/', (req, res)=>{
    try {
        orderController.getShoppingTotal(order, (err, result)=>
        {
            if (err) {
                res.status(400).send(' ', err)
            } else {
                res.status(200).send(result)
            }
        } )
        
    } catch (err) {
        res.status(500).send(err)
        console.log('Internal server error',err)
    }
})

/* ----------Mostrar cantidad de productos vendidos------------ */

router.get('/parcial/', (req, res)=>{
    try {
        orderController.getShoppingProduct(order, (err, result)=>{
            if (err) {
                res.status(400).send('', err)
            } else {
                res.status(200).send(result)
            }
        })
        
    } catch (err) {
        res.status(500).send('', err)
        console.log('Internal server error', err)
    }
})
module.exports = router


