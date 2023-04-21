
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerId:{
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        require: true
    },
    dateSale:{
        type:Date,
        require:true
    }
})
const Order = mongoose.model("order", orderSchema);
module.exports = Order;
