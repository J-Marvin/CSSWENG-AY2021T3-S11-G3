const express = require('express')
const path = require('path')
const validation = require('../helpers/validation')

const indexController = require('../controllers/indexController')
const loginController = require('../controllers/loginController')
const memberController = require('../controllers/memberController')
const prenupController = require('../controllers/prenupController')

const app = express()
app.set('views', path.join(__dirname, '../views'))

app.get('/', indexController.getIndex)
app.get('/login_page', loginController.getLoginPage)
app.get('/add_member', memberController.getAddMemberPage)
app.get('/add_prenup', prenupController.getPrenupPage)
app.get('/edit_member/:member_id', memberController.getEditMember)

app.post('/login', loginController.postLogIn)
app.post('/add_member', validation.addMemberValidation(), memberController.createMember)
app.post('/add_prenup', prenupController.createPrenup)
module.exports = app
