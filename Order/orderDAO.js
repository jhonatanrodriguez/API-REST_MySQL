
const mongoose = require('mongoose')
require('../dbconfig/dbfile')

async function deleteOrderById(order, orderId, done) {
    const data = await order.findByIdAndDelete(orderId)
    done(undefined, data)
}

async function getShopping(order, done) {
    const data = await order.aggregate([

        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "compras_del_cliente"
            }
        },
        {
            $unwind: "$compras_del_cliente"
        },
        {
            $lookup: {
                from: "customers",
                localField: "customerId",
                foreignField: "_id",
                as: "clientes_que_compraron"
            }
        },
        {
            $unwind: "$clientes_que_compraron"
        },
        {
            $addFields: {
                Nombre_del_Cliente: "$clientes_que_compraron.customerName",
                Nombre_del_Producto: "$compras_del_cliente.productName",
                Precio_del_Producto: "$compras_del_cliente.productPrice",
                amountStored: "$compras_del_cliente.amountStored",
                Fecha_de_Venta: "$dateSale",
                ID_Cliente: "$clientes_que_compraron.customerId",
                productId:"$compras_del_cliente.productId"
            }
        },
        {
            $project: {
                _id:0,
                Nombre_del_Cliente: 1,
                Nombre_del_Producto: 1,
                Fecha_de_Venta: 1,
                Precio_del_Producto :1,
                amountStored: 1,
                ID_Cliente: 1,
                productId: 1,
                customerId: 1, 
                dateSale: 1
            }
        },
        {
            $group:{
                _id: {ID_Cliente:"$ID_Cliente",Nombre_del_Cliente:"$Nombre_del_Cliente",dateSale: "$dateSale"}, 
                totalSaleAmount: {$sum: {$multiply: ["$Precio_del_Producto","$amountStored"]}}

            }
        }
    ])
    done(undefined, data)
}

async function getShoppingTotal(order, done){
    const data = await order.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "compras_del_cliente"
            }
        },
        {
            $unwind: "$compras_del_cliente"
        },
        {
            $addFields: {
                PRECIO_DEL_PRODUCTO: "$compras_del_cliente.productPrice",
                CANTIDAD_DE_PRODUCTO: "$compras_del_cliente.amountStored"
            }
        },
        {
            $group: {
                _id: "_id",
                totalSaleAmount: {$sum:{$multiply: ["$PRECIO_DEL_PRODUCTO", "$CANTIDAD_DE_PRODUCTO"]}}
            }
        },
        {
            $project:{
                _id:0,
                totalSaleAmount: 1
            }
        }

    ])
    done(undefined, data)
}

async function getShoppingProduct(order, done){
    const data = await order.aggregate([
        {
            $lookup:{
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "compras_del_cliente"
            }
        },
        {
            $unwind:"$compras_del_cliente"
        },
        {
            $lookup:{
                from: "customers",
                localField: "customerId",
                foreignField: "_id",
                as: "clientes_que_compraron"
            }
        },
        {
            $unwind: "$clientes_que_compraron"
        },
        {
            $addFields:{
                Nombre_del_Cliente: "$clientes_que_compraron.customerName",
                ID_Cliente: "$clientes_que_compraron.customerId",
                Nombre_del_Producto: "$compras_del_cliente.productName",
                Precio_del_Producto: "$compras_del_cliente.productPrice",
                productId:"$compras_del_cliente.productId",
                CANTIDAD_DE_PRODUCTO: "$compras_del_cliente.amountStored",
                Fecha_de_Venta: "$dateSale"
            }
        },
        {
            $project: {
                _id:0,
                Nombre_del_Cliente: 1,
                Nombre_del_Producto: 1,
                Fecha_de_Venta: 1,
                Precio_del_Producto :1,
                ID_Cliente: 1,
                productId: 1,
                customerId: 1, 
                dateSale: 1,
            }
        },
        {
            $group:{
                _id: { ID_Cliente:"$ID_Cliente", Nombre_del_Cliente:"$Nombre_del_Cliente" }, 
                NOMBRE_DEL_PRODUCTO: { $push: "$Nombre_del_Producto"}

            }
        },
        {
            $unwind : "$NOMBRE_DEL_PRODUCTO"
        }, 

        {
            $group:{
                _id: {NOMBRE_DEL_PRODUCTO:"$NOMBRE_DEL_PRODUCTO", Precio_del_Producto:"$Precio_del_Producto"},
                Cantidad_de_Productos_vendidos:{$sum:1}
            }
        },
        {
            $sort:{"Cantidad_de_Productos_vendidos": -1}
        },
        {
            $project:{
                NOMBRE_DEL_PRODUCTO: 1,
                Cantidad_de_Productos_vendidos: 1,
            }
        }
    ])
    done(undefined, data)
}
module.exports = { deleteOrderById, getShopping, getShoppingTotal, getShoppingProduct }












