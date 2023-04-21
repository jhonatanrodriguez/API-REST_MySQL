const orderService = require('./orderService')

function deleteOrderById(order, orderId, done){
    orderService.deleteOrderById(order, orderId, done)
}

function getShopping(order, done){
    orderService.getShopping(order, done)
}

function getShoppingTotal(order, done){
    orderService.getShoppingTotal(order, done)
}

function getShoppingProduct(order, done){
    orderService.getShoppingProduct(order, done)
}
module.exports = { deleteOrderById,  getShopping, getShoppingTotal, getShoppingProduct }