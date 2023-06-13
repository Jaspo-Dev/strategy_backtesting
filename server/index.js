require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected.');
}).catch(err => console.log(err));

const api = require('./routes/api');
app.use('/savedata', api);

const port = process.env.PORT || 3111;

app.listen(port);