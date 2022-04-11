const express = require('express');
const app = express();
const joi = require('joi');
const port = 3000;
const gameRoutes = require('./routes/games');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gameapp', {
    "useNewUrlParser": true,
    "useUnifiedTopology": true
})
    .catch(error => {
        console.log('Databaseconnection error: ' + error.message);
        process.exit(2)
    })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log('Connected to MongoDB');
});

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/games', gameRoutes);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));