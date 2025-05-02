const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Dessert = require('../models/dessertModel');
const { v4: uuidv4 } = require('uuid');

const addOrder = async (req, res) => {
  try {
    const { name, address, phoneno } = req.body;
    const user_id = req.user.id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    if (!cart.products || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    let totalAmount = 0;
    for (const item of cart.products) {
      const product = await Dessert.findOne({ productId: item.productId });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.Product_Name}` });
      }
      await Dessert.updateOne(
        { productId: item.productId },
        { $inc: { stock: -item.quantity } }
      );

      totalAmount += item.quantity * product.price;
    }
    const newOrder = new Order({
      orderid: uuidv4(),
      user_id: user_id,
      name: name,
      email: user.email,
      address: address,
      phone: phoneno,
      products: cart.products,
      totalamount: totalAmount,
      orderstatus: 'Pending'  
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ user_id });

    return res.status(200).json({ msg: "Order created successfully" });
  } catch (error) {
    console.error('Error occurred while adding order:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getOrder = async (req, res) => {
  try {
    const user_id = req.user.id;

    const order = await Order.findOne({ user_id });
    if (order) {
      const arr = [];
      for (const item of order.products) {
        const product = await Dessert.findOne({ productId: item.productId });
        if (product) {
          arr.push({
            title: product.Product_Name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.imageUrl,
            quantity: item.quantity,
          });
        }
      }

      res.status(200).json({
        orderId: order.orderid,
        products: arr,
        totalAmount: order.totalamount,
        orderDate: order.orderdate,
        estimateDate: order.deliverydate,
        orderStatus: order.orderstatus
      });
    } else {
      res.status(404).json({ msg: "Order not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const markOrderAsDone = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.orderstatus = 'Done';
    await order.save();

    res.status(200).json({ msg: "Order marked as done" });
  } catch (error) {
    console.error('Error marking order as done:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addOrder, getOrder, markOrderAsDone };

