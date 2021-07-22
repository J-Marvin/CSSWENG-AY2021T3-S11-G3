const express = require('express')
const path = require('path')

// controllers
const indexController = require('../controllers/indexController.js')

const app = express()

// Setting the view path here ensures the proper path will be set when the application is built
app.set('views', path.join(__dirname, '../views'))

// Home page
app.get('/', indexController.getIndex)

module.exports = app
