const orderDao = require('./orderDAO')

function deleteOrderById(order, orderId, done){
    orderDao.deleteOrderById(order, orderId, done)
}

function  getShopping(order, done){
    orderDao. getShopping(order, done)
}

function getShoppingTotal(order, done){
    orderDao.getShoppingTotal(order, done)
}

function getShoppingProduct(order, done){
    orderDao.getShoppingProduct(order, done)
}
module.exports = { deleteOrderById,  getShopping, getShoppingTotal, getShoppingProduct }