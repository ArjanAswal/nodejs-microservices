const express = require('express');
require('express-async-errors');
const isAuthenticated = require('./isAuthenticated');

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Orders Service at ${port}`);
});
