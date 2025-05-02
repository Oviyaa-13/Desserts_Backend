const Stock = require('../models/stockModel');
const { v4: uuidv4 } = require('uuid');
const initializeStocks = async (req, res) => {
  try {
    const stockItems = [
      {
        productId: uuidv4(),
        productName: 'Caramel Flan',
        quantity: 30,
        price:417,
      },
      {
        productId: uuidv4(),
        productName: 'Cinnamon Roll Cake',
        quantity: 30,
        price: 353,
      },
      {
        productId: uuidv4(),
        productName: 'Almond Cake',
        quantity: 30,
        price: 801,
      },
      {
        productId: uuidv4(),
        productName: 'Cherry Clafoutis',
        quantity: 30,
        price: 688,
      },
      {
        productId: uuidv4(),
        productName: 'Lemon Meringue Pie',
        quantity: 30,
        price: 85,
      },
      {
        productId: uuidv4(),
        productName: 'Pistachio Cookies',
        quantity: 30,
        price:642,
      },
      {
        productId: uuidv4(),
        productName: 'Mango Sticky Rice',
        quantity: 30,
        price: 818,
      },
      {
        productId: uuidv4(),
        productName: 'Raspberry Cheesecake',
        quantity: 30,
        price: 980,
      },
      {
        productId: uuidv4(),
        productName: 'Mocha Mousse',
        quantity: 30,
        price: 542,
      },
      {
        productId: uuidv4(),
        productName: 'Chocolate Souffle',
        quantity: 30,
        price: 521,
      },
      {
        productId: uuidv4(),
        productName: 'Red Velvet Cake',
        quantity: 30,
        price:700 ,
      },
      {
        productId: uuidv4(),
        productName: 'Mocha Cupcakes',
        quantity: 35,
        price: 254,
      },
      {
        productId: uuidv4(),
        productName: 'Brownie Sundae',
        quantity: 45,
        price: 300,
      },
      {
        productId: uuidv4(),
        productName: 'Churros',
        quantity: 40,
        price: 463,
      },
      {
        productId: uuidv4(),
        productName: 'Spiced Pumpkin Cookies',
        quantity: 20,
        price: 482,
      },
      {
        productId: uuidv4(),
        productName: 'Spiced Apple Cake',
        quantity: 55,
        price: 271,
      },
      {
        productId: uuidv4(),
        productName: 'Lemon Chia Cake',
        quantity: 50,
        price: 382,
      },
      {
        productId: uuidv4(),
        productName: 'Cinnamon Apple Muffins',
        quantity: 25,
        price: 350,
      },
      {
        productId: uuidv4(),
        productName: 'Lemon Bars',
        quantity: 60,
        price: 670,
      },
      {
        productId: uuidv4(),
        productName: 'Pecan Pie',
        quantity: 30,
        price: 670,
      }
    ];
    for (const item of stockItems) {
      const stock = new Stock(item);
      await stock.save();
    }

    res.status(200).json({ message: 'Stock records initialized' });
  } catch (err) {
    res.status(500).json({ error: 'Error initializing stock records', details: err.message });
  }
};
//get
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stocks', error });
  }
};

const updateStock = async (req, res) => {
  const { productId } = req.params; 
  const { productName, quantity, price } = req.body;

  console.log('Received update request for stock with productId:', productId);
  console.log('Update payload:', { productName, quantity, price });

  try {
    const updatedStock = await Stock.findOneAndUpdate(
      { productId }, 
      { productName, quantity, price },
      { new: true, runValidators: true }
    );

    console.log('Updated stock:', updatedStock);

    if (!updatedStock) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    res.json({ message: 'Stock updated successfully', stock: updatedStock });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

//add
const addStock = async (req, res) => {
  try {
    const { productName, quantity, price } = req.body;

    const newStock = new Stock({
      productName,
      quantity,
      price
    });

    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (err) {
    res.status(500).json(err);
  }
};

//delete
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStocks,
  initializeStocks,
  updateStock,
  addStock,
  deleteStock,
};
