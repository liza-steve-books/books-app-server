'use strict';

// App Dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');

// App Setup
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/v1/books', (request, response) => {
  client.query(
    'SELECT book_id, title, author, image_url FROM books'
  )
    .then(result => response.send(result.rows))
    .catch(console.error);
});

app.get('/api/v1/books/:id', (request, response) => {
  client.query(
    `SELECT * FROM books
     WHERE book_id=$1`,
    [request.params.id]
  )
    .then((result) => response.send(result.rows))
    .catch(console.error);
});

app.post('/api/v1/books', (request, response) => {
  client.query(
    'INSERT INTO books (author, title, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
    [request.body.author, request.body.title, request.body.isbn, request.body.image_url, request.body.description]
  )
    .then(() => response.send('insert complete'))
    .catch(console.error);
});

app.all('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));