const express = require('express');
require('express-async-errors');
const sequelize = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user.model');

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Users Service at ${port}`);
});

app.post('/signup', async (req, res) => {
  let { name, email, password } = req.body;
  password = await bcrypt.hash(password, 12);

  await User.create({ name, email, password });
  const payload = {
    email,
    name,
  };
  jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
    if (err) console.log(err);
    res.status(200).json({ token, name, email });
  });
});

app.post('/signin', async (req, res) => {
  let { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (await bcrypt.compare(password, user.password)) {
    const payload = {
      email: user.email,
      name: user.name,
    };
    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) console.log(err);
      res.status(200).json({ token, name: user.name, email });
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

sequelize.sync();
