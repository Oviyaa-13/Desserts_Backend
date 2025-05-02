const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes=require("./routes/userRoutes");
const dessertRoutes = require("./routes/dessertRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require('./routes/adminRoutes');
const stockRoutes = require('./routes/stockRoutes');
const mongoose=require('mongoose');
const cors=require('cors');

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://oviyaa:Oviyaa_0903@cluster0.wo10wno.mongodb.net/DESSERTS').then(()=>{
  console.log("MongoDb connected");
})
.catch(err => {
  console.error("Error connecting to MongoDB", err);
});
app.set("view engine",'ejs');
app.use('/', userRoutes);
app.use('/',dessertRoutes);
app.use('/',cartRoutes);
app.use('/',orderRoutes);
app.use('/stocks',stockRoutes);
app.use('/admin', adminRoutes);
app.listen(5000,()=>{
  console.log("server is running on port 5000")
})