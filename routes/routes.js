const express = require('express')
const path = require('path')

const indexController = require('../controllers/indexController.js')
const loginController = require('../controllers/loginController.js')

const app = express()
app.set('views', path.join(__dirname, '../views'))

app.get('/', indexController.getIndex)
app.get('/login_page', loginController.getLoginPage)
app.post('/login', loginController.postLogIn)
module.exports = app
