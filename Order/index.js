const express = require('express');
const app = express()
const orderRouter = require('./orderRouter')

app.use(express.json())
app.use(orderRouter)
app.listen(5000, ()=>{
    console.log('listening');
})