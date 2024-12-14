const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const secretKey = process.env.SECRET_KEY; // Replace with your actual secret key
// const userId = localStorage.getItem("uid")

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_SERVERLINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User schema and model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Contact schema and model
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});




const Contact = mongoose.model('Contact', ContactSchema);


//admin login
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //role: { type: String, default: 'admin' } // Default role is 'user'
});
const AdminUser = mongoose.model('AdminUser',AdminSchema)

// Category schema and model
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["Men's Clothing", "Women's Clothing", "Jewelry", "Electronics"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true, // This can be a URL to the image
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Product model
const Product = mongoose.model('Product', productSchema);

// Registration route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received registration request:', { email, password }); // Debugging line
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();
    console.log('User saved:', savedUser); // Debugging line
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error); // Debugging line
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', { email, password }); // Debugging line
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Debugging line
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match'); // Debugging line
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    console.log('Login successful, token generated'); // Debugging line
    const uid = user._id;
    const name = user.name
    
    res.status(200).json({ token ,message:"Login Successful",uid,name});
    
  } catch (error) {
    console.error('Error during login:', error); // Debugging line
    res.status(500).json({ error: 'Error during login' });
  }
});

// Contact route
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received contact request:', { name, email, message }); // Debugging line
  try {
    const newContact = new Contact({ name, email, message });
    const savedContact = await newContact.save();
    console.log('Contact saved:', savedContact); // Debugging line
    res.status(201).json({ message: 'Message received!' });
  } catch (error) {
    console.error('Error saving contact:', error); // Debugging line
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.get("/admin/messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }); // Sort messages by creation date (latest first)
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Route to delete a message by ID
app.delete("/admin/messages/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMessage = await Contact.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});


app.post('/register', async (req, res) => {
  const { email, password, role } = req.body; // Accept role from the client
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role: role || 'user' });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});



app.post('/admin/register',cors({ origin: 'http://localhost:3000' }) ,async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminUser({ email, password: hashedPassword, role: 'admin' });
    const savedAdmin = await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully',success:true });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Error registering admin' });
  }
});



app.post('/admin/add-product', async (req, res) => {
  const { title, category, price, description, image } = req.body;

  if (!title || !category || !price || !description || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = new Product({
      title,
      category,
      price,
      description,
      image,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
});





// Login route
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', { email, password }); // Debugging line
  try {
    const user = await AdminUser.findOne({ email });
    if (!user) {
      console.log('User not found'); // Debugging line
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match'); // Debugging line
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    console.log('Login successful, token generated'); // Debugging line
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error); // Debugging line
    res.status(500).json({ error: 'Error during login' });
  }
});


app.get('/category/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ categoryId: req.params.id });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});


app.put('/product/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error updating product' });
  }
});


app.delete('/product/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});








app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a product
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a product
app.put("/api/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a product
app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
      image: { type: String },
      description: { type: String },
      category: { type: String, required: true },
    },
  ],
  total: { type: Number, required: true, default: 0 },
  shipping: { type: Number, default: 30.0 }, // Default shipping cost
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Method to calculate the total price of the cart
cartSchema.methods.calculateTotal = function () {
  this.total = this.products.reduce((sum, product) => sum + product.price * product.qty, 0);
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

app.post("/cart/add", async (req, res) => {
  console.log("Request received:", req.body); // Log the payload
  const { userId,product } = req.body;
  console.log("userid from backend while adding item to cart ",userId)
  if (!product || !product.price) {
    console.error("Invalid product data:", req.body);
    return res.status(400).json({ message: "Invalid product data" });
  }

  product.qty = product.qty || 1; // Set qty to 1 if it's not provided

  try {
    let cart = await Cart.findOne({ user: userId });

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ ...product, qty: product.qty }],
      });
    } else {
      // If product exists, update the quantity; else, add it
      const productIndex = cart.products.findIndex(item => item.title === product.title);
      if (productIndex !== -1) {
        cart.products[productIndex].qty += product.qty;
      } else {
        cart.products.push({ ...product, qty: product.qty });
      }
    }

    // Recalculate total and save the cart
    await cart.calculateTotal();

    console.log("Cart updated successfully:", cart);
    res.status(200).json(cart); // Send the updated cart as a response
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
});


app.get('/cart/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the cart for the logged-in user
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart); // Return the user's cart data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});
app.delete("/cart/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Filter out the product with the matching productId
    cart.products = cart.products.filter((item) => item._id.toString() !== productId);

    // Recalculate the total and save the cart
    await cart.calculateTotal();

    res.status(200).json(cart); // Return the updated cart
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/cart/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  const { qtyChange } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const product = cart.products.find((p) => p._id.toString() === productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Update the product quantity
    product.qty += qtyChange;

    // Remove product if quantity becomes 0
    if (product.qty <= 0) {
      cart.products = cart.products.filter((p) => p._id.toString() !== productId);
    }

    // Recalculate the total
    await cart.calculateTotal();

    res.json(cart); // Send the updated cart
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running on port 5000");
});
