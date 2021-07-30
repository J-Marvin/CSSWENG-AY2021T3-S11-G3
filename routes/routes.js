const express = require('express')
const path = require('path')
const validation = require('../helpers/validation')

const indexController = require('../controllers/indexController')
const loginController = require('../controllers/loginController')
const memberController = require('../controllers/memberController')
const prenupController = require('../controllers/prenupController')

const app = express()
app.set('views', path.join(__dirname, '../views'))

app.get('/', loginController.getLoginPage)
app.get('/login_page', loginController.getLoginPage)
app.get('/logout', indexController.getLogoutPage)
app.get('/login', indexController.getMainPage)
app.get('/member_main_page', indexController.getMemberMainPage)
app.get('/add_member', memberController.getAddMemberPage)

app.get('/edit_member/:member_id', memberController.getEditMember)
app.get('/forms_main_page', indexController.getFormsMainPage)
app.get('/add_prenup', prenupController.getPrenupPage)
app.get('/edit_member/:member_id/add_prenup', prenupController.getPrenupPage)

app.post('/login', loginController.postLogIn)
app.post('/add_member', validation.addMemberValidation(), memberController.createMember)
app.post('/create_prenup', validation.addPrenupValidation(), prenupController.createPrenup)
// app.post('/create_prenup_member')
app.post('/update_member', memberController.postUpdateMember)
module.exports = app
