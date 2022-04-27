const express = require('express');
require('express-async-errors');
const sequelize = require('./database');
const isAuthenticated = require('./isAuthenticated');
const Product = require('./product.model');

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Products Service at ${port}`);
});

app.get('/products', async (req, res) => {
  const results = await Product.findAll();

  res.status(200).json(results);
});

app.post('/products', isAuthenticated, async (req, res) => {
  const { name, price, description, imageURL } = req.body;

  const product = await Product.create({
    name,
    price,
    description,
    imageURL,
    creator: req.user.email,
  });

  res.status(200).json(product);
});

sequelize.sync();
