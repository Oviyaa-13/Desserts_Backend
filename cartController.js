const Cart = require('../models/cartModel');
const Dessert = require('../models/dessertModel');

// const addCart = async (req, res) => {
//   try {
//     const { products } = req.body;
//     const user_id = req.user.id;

//     // Check if products is defined and is an array
//     if (!products || !Array.isArray(products)) {
//       return res.status(400).send({ msg: "Products should be a non-empty array" });
//     }

//     const data = await cart.findOne({ user_id });
//     if (data) {
//       products.forEach(j => {
//         const exist = data.products.find(p => p.productId === j.productId);

//         if (exist) {
//           exist.quantity += j.quantity;
//         } else {
//           data.products.push({
//             productId: j.productId,
//             quantity: j.quantity
//           });
//         }
//       });

//       await data.save();
//       res.status(200).send({ msg: "Products added to cart" });

//     } else {
//       const newCart = new cart({
//         user_id,
//         products: products.map(r => ({
//           productId: r.productId,
//           quantity: r.quantity
//         }))
//       });
//       await newCart.save();
//       res.status(200).send({ msg: "Products added to cart" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ msg: "Internal server error" });
//   }
// };
//worked one
// const addCart = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log("User ID:", userId);

//     const { productId, quantity } = req.body;
//     console.log("Product ID:", productId, "Quantity:", quantity);

//     let cart = await Cart.findOne({ user_id: userId });
//     console.log("In Cart:", cart);

//     if (cart) {
//       const isProduct = cart.products.find(p => p.productId === productId);
//       if (isProduct) {
//         isProduct.quantity = (parseInt(isProduct.quantity) + parseInt(quantity)).toString();
//       } else {
//         cart.products.push({ productId, quantity });
//       }
//       await cart.save();
//       res.send(cart);
//     } else {
//       const newCart = new Cart({ user_id: userId, products: [{ productId, quantity }] });
//       await newCart.save();
//       res.send(newCart);
//     }
//   } catch (err) {
//     console.log("Error:", err);
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };
//after decrement logic on 10/8
const addCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user_id = req.user.id;

    if (quantity === 0) {
      return res.status(400).json({ error: "Quantity cannot be zero" });
    }

    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      cart = new Cart({ user_id, products: [] });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;

      if (cart.products[productIndex].quantity <= 0) {
        cart.products.splice(productIndex, 1);
      }
    } else {
      if (quantity > 0) {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    return res.status(200).json({ msg: "Cart updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const user_id = req.user.id;
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      if (cart.products.length === 0) {
        await Cart.deleteOne({ user_id });
        return res.status(200).json({ msg: "Cart deleted successfully" });
      } else {
        await cart.save();
        return res.status(200).json({ msg: "Product removed from cart" });
      }
    }

    return res.status(404).json({ msg: "Product not found in cart" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


const getCart = async (req, res) => {
  try {
    const user_id = req.user.id; 
    console.log("User ID:", user_id); 
    const cartData = await cart.findOne({ user_id: user_id });
    console.log("Cart Data:", cartData);

    if (cartData) {
      let totalprice = 0;
      const arr = [];
      for (const item of cartData.products) {
        const product = await Dessert.findOne({ id: item.productId });

        if (product) {
          const totalamt = product.price * item.quantity;
          totalprice += totalamt;

          arr.push({
            title: product.Product_Name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.imageUrl,
            quantity: item.quantity,
            amount: totalamt
          });
        } else {
          console.log(`Product with ID ${item.productId} not found`);
        }
      }

      res.status(200).json({ TotalPrice: totalprice, products: arr });
    } else {
      res.status(404).json({ msg: "Cart not found" });
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteproduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const user_id = req.user.id;
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

   
    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      if (cart.products.length === 0) {
        await Cart.deleteOne({ user_id });
        return res.status(200).json({ msg: "Cart deleted successfully" });
      } else {
        await cart.save();
        return res.status(200).json({ msg: "Product removed from cart" });
      }
    }

    return res.status(404).json({ msg: "Product not found in cart" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteCart = async(req,res)=>{
  try{
  const user_id = req.user.id;
  const data = await Cart.findOne({user_id});
 
  if(data){
    await cart.deleteOne({user_id});
    res.status(200).send({msg:"Cart deleted Successfully!!"})
  }
  else{
    res.status(404).send({msg:"Cart not found"})
  }
}
catch(error){
  res.status(500).send({msg:"Internal server error"})
}
}


module.exports = { addCart ,removeFromCart, getCart , deleteproduct,deleteCart};