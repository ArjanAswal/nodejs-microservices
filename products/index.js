const express = require('express');

const app = express();

app.use(express.json());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`Products Service at ${port}`);
});
