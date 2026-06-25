require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});