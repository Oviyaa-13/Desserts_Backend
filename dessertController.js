const Dessert = require('../models/dessertModel');
const { v4: uuidv4 } = require('uuid');

//get
const getAllDesserts = async (req, res) => {
    try {
        const desserts = await Dessert.find();
        res.send(desserts);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

//new creation
const postDessert = async (req, res) => {
    try {
        const {
            Product_Name, category, price, ingredients, calories, image, description, availability, rating, reviews, allergens
        } = req.body;

        const newDessert = new Dessert({
            productId: uuidv4(),
            Product_Name,
            category,
            price,
            ingredients,
            calories,
            image,
            description,
            availability,
            rating,
            reviews,
            allergens
        });

        await newDessert.save();
        res.status(201).json(newDessert);
    } catch (error) {
        console.error("Error saving dessert:", error);
        res.status(500).send("Server error");
    }
};

//updation
const updateDessert = async (req, res) => {
    try {
        const { productId } = req.params;
        const {
          Product_Name, category, price, ingredients, calories, image, description, availability, rating, reviews, allergens
        } = req.body;

        const updatedDessert = await Dessert.findOneAndUpdate(
            { productId },
            {
              Product_Name,
                category,
                price,
                ingredients,
                calories,
                image,
                description,
                availability,
                rating,
                reviews,
                allergens
            },
            { new: true }
        );

        if (!updatedDessert) {
            return res.status(404).send("Dessert not found");
        }

        res.json(updatedDessert);
    } catch (error) {
        console.error("Error updating dessert:", error);
        res.status(500).send("Server error");
    }
};

//deletion
const deleteDessert = async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedDessert = await Dessert.findOneAndDelete({ productId });

        if (!deletedDessert) {
            return res.status(404).send("Dessert not found");
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting dessert:", error);
        res.status(500).send("Server error");
    }
};

module.exports = { getAllDesserts, postDessert, updateDessert, deleteDessert };
