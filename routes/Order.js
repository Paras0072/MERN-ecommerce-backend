const express = require('express');
const { createOrder, deleteOrder, updateOrder, fetchAllOrders, fetchOrdersByUser } = require('../controller/Order');



const router = express.Router();
// /orders is already added in base path 
router
  .post("/", createOrder)
  .get("/own/", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get("/", fetchAllOrders);
  
exports.router = router;