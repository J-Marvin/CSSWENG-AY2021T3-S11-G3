const express = require('express')
const path = require('path')

const indexController = require('../controllers/indexController')
const loginController = require('../controllers/loginController')
const memberController = require('../controllers/memberController')

const app = express()
app.set('views', path.join(__dirname, '../views'))

app.get('/', indexController.getIndex)
app.get('/login_page', loginController.getLoginPage)
app.post('/login', loginController.postLogIn)
app.get('/add_member', memberController.getAddMemberPage)
app.post('/add_member', memberController.createMember)

module.exports = app
