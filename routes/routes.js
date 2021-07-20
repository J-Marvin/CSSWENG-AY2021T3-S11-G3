const express = require('express');
const path = require('path');

const indexController = require('../controllers/indexController.js');

const app = express();
app.set('views', path.join(__dirname, '../views'));

app.get('/', indexController.getIndex);

module.exports = app;