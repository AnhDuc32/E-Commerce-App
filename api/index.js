require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

const mongodbPass = process.env.MONGODB_PASS;

mongoose
  .connect(`mongodb+srv://anhducnguyen3204:${mongodbPass}@cluster0.f07mi.mongodb.net/`)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('MongoDB connection failed', err);
  });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

const User = require('./models/user');
const Order = require('./models/order');

// Send verification email to the user
const sendVerificationEmail = async (email, verificationToken) => {
  // Create a node mailer transporter
  const transporter = nodemailer.createTransport({
    // Configure the email service
    service: 'gmail',
    auth: {
      user: 'anhducnguyen3204@gmail.com',
      pass: 'xexwsbcjvhaccgbj',
    },
  });

  // Compose the email message
  const mailOptions = {
    from: 'amazon.com',
    to: email,
    subject: 'Verify your email',
    text: `Click on the link to verify your email: http://192.168.1.148:8000/verify/${verificationToken}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('Error sending verification email', error);
  }
};

// Endpoint for sign up
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email is already exists');
      return res.status(400).json('Email is already exists');
    }

    // Create a new user
    const newUser = new User({ name, email, password });

    // Generate and store verification token
    newUser.verificationToken = crypto.randomBytes(28).toString('hex');

    // Save the user to the database
    await newUser.save();

    // Send verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(201).json({
      message: 'Sign up successfull. Please check your email for verification.',
    });
  } catch (error) {
    console.log('Error signing up user', error);
    res.status(500).json('Sign up failed');
  }
});

// Endpoint for verifying email
app.get('/verify/:token', async (req, res) => {
  try {
    const token = req.params.token;

    // Find the user with the verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json('Invalid or expired token');
    }

    // Update the user's email verification status
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json('Email verified successfully');
  } catch (error) {
    console.log('Error verifying email', error);
    res.status(500).json('Email verification failed');
  }
});

const secretKey = process.env.JWT_SECRET;

// Endpoint for Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Endpoint to store a new Address
app.post('/addresses', async (req, res) => {
  try {
    const { userId, address } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the new Address to the user's addresses array
    user.addresses.push(address);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Address created Successfully' });
  } catch (error) {
    console.log('Error adding address');
    res.status(500).json({ message: 'Error adding address' });
  }
});

// Endpoint to get all the addresses of a particular user
app.get('/addresses/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    console.log('Error retrieving the addresses');
    res.status(500).json({ message: 'Error retrieving the addresses' });
  }
});

// Endpoint to store the orders
app.post('/orders', async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an array of product objects from the cart Items
    const products = cartItems.map((item) => ({
      name: item.title,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }));

    // Create a new Order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    });

    await order.save();

    res.status(200).json({ message: 'Order created successfully' });
  } catch (error) {
    console.log('Error creating orders', error);
    res.status(500).json({ message: 'Error creating orders ' });
  }
});

// Endpoint to get the user profile
app.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log('Error retrieving the user profile', error);
    res.status(500).json({ message: 'Error retrieving the user profile' });
  }
});

// Endpoint to update the user profile
app.put('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, password } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.log('Error updating the user profile', error);
    res.status(500).json({ message: 'Error updating the user profile' });
  }
});

app.get('/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const order = await Order.find({ user: userId }).populate('user');

    if (!order || order.length === 0) {
      console.log('No orders found');
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.log('Error retrieving the orders', error);
    res.status(500).json({ message: 'Error retrieving the orders' });
  }
});

// Endpoint to create payment intent
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
