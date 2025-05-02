const Order = require('../models/orderModel');

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderdate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error occurred while fetching orders:', error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

const markOrderAsDone = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOneAndUpdate(
      { orderid: orderId },
      { $set: { orderstatus: 'Done' } },
      { new: true }
    );

    if (order) {
      res.status(200).json({ msg: 'Order marked as done' });
    } else {
      res.status(404).json({ msg: 'Order not found' });
    }
  } catch (error) {
    console.error('Error occurred while updating order status:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllOrders,
  markOrderAsDone,
};

