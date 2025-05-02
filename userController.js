const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Please enter all fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'user';
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: userRole 
    });

    await newUser.save();
    const generateToken = (user) => {
      return jwt.sign(
          { userId: user._id, role: user.role }, 
          "your_secret_key", 
          { expiresIn: '1h' } 
      );
  };

    res.status(201).json({ message: "New user has been created", token, role: newUser.role });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      "secret_key", 
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
};
