'use strict';

// App Dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// App Setup
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/api/v1/books', (request, response) => {
  client.query(
    'SELECT book_id, title, author, image_url FROM books'
  )
    .then(result => response.send(result.rows))
    .catch(console.error);
});

app.all('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
