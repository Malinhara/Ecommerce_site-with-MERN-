const escapeHTML = require('escape-html');
const Product = require('../model/product model');
const userservice = require('./User service');
const {  generatedCode } = require('./User service');
const authMiddleware = require('../middleware/authMiddleware'); 

exports.addProduct = [
  authMiddleware, // Apply the auth middleware
  async (req, res) => {
  try {
    const id = userservice.id;
    const useremail = req.headers['useremail'];
    const confirmcode = req.headers['confirmationCode'];
  

   
    const sanitizedDesc = escapeHTML(req.body.description).replace(/<\/?[^>]+(>|$)/g, "");
    const sanitizedimgurl = escapeHTML(req.body.imgUrl).replace(/<\/?[^>]+(>|$)/g, "");
    const sanitizediname = escapeHTML(req.body.name).replace(/<\/?[^>]+(>|$)/g, "");

    await Product.create({
      name: sanitizediname,
      description: sanitizedDesc,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity,
      imageUrl: sanitizedimgurl
    });

    return res.status(200).json({ message: 'Product added successfully' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
]




exports.updateProduct = [
  authMiddleware, // Apply the auth middleware
  async (req, res) => {
  try {

    const productId = req.params.Id;
   


    // Check if the product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(409).json({ error: 'Product not found' });
    }

    const sanitizedDesc = escapeHTML(req.body.description).replace(/<\/?[^>]+(>|$)/g, "");
    const sanitizedimgurl = escapeHTML(req.body.imgUrl).replace(/<\/?[^>]+(>|$)/g, "");
    const sanitizediname = escapeHTML(req.body.name).replace(/<\/?[^>]+(>|$)/g, "");

    // Update all fields with user input data
    existingProduct.name = sanitizediname;
    existingProduct.description = sanitizedDesc ;
    existingProduct.price = req.body.price;
    existingProduct.category = req.body.category;
    existingProduct.quantity = req.body.quantity;
    existingProduct.imgUrl = sanitizedimgurl;

    // Save the updated product
    const updatedProduct = await existingProduct.save();

    return res.status(201).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
]



exports.deleteProduct = [
  authMiddleware, // Apply the auth middleware
  async (req, res) => {
  try {
    const productId = req.params.Id;
  

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {

      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
]



exports.getAllProducts = [
  authMiddleware, // Apply the auth middleware
  async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ products });
  }
  catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
]



exports.getoneProduct = [
  authMiddleware, // Apply the auth middleware
  async (req, res) => {
  try {
    const productId = req.params.Id; // Get the product ID from request parameters
    const product = await Product.findById(productId); // Find the product by its ID
    if (!product) {
      return res.status(404).json({ error: 'Product not found' }); // Handle case when product is not found
    }
    return res.status(200).json({ product }); // Return the found product
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
]
