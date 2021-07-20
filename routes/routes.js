const express = require('express');

const indexController = require('../controllers/indexController.js');

const app = express();

app.get('/', indexController.getIndex);

module.exports = app;