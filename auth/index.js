const express = require('express');
require('express-async-errors');

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Auth Service at ${port}`);
});
