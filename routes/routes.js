const express = require('express')
const path = require('path')
const validation = require('../helpers/validation')

const indexController = require('../controllers/indexController')
const loginController = require('../controllers/loginController')
const memberController = require('../controllers/memberController')
const prenupController = require('../controllers/prenupController')
const churchController = require('../controllers/churchController')
const observationController = require('../controllers/observationController')

const app = express()
app.set('views', path.join(__dirname, '../views'))

app.get('/', loginController.getLoginPage)
app.get('/login_page', loginController.getLoginPage)
app.get('/logout', loginController.getLogout)
app.get('/main_page', indexController.getMainPage)
app.get('/member_main_page', indexController.getMemberMainPage)
app.get('/add_member', memberController.getAddMemberPage)
app.get('/edit_member/:member_id', memberController.getEditMember)
app.get('/edit_prenup/:prenup_id', prenupController.getEditPrenup)

app.get('/member/:member_id', memberController.getViewMember)

app.get('/forms_main_page', indexController.getFormsMainPage)
app.get('/add_prenup', prenupController.getPrenupPage)
app.get('/edit_member/:member_id/add_prenup', prenupController.getPrenupPage)
app.get('/view_prenup/:prenup_id', prenupController.getViewPrenup)

app.post('/login', loginController.postLogIn)
app.post('/add_member', validation.addMemberValidation(), memberController.createMember)
// next four (4) routes for add prenuptial
app.post('/create_prenup', validation.addPrenupValidation(), prenupController.createPrenup)
app.post('/create_prenup_member', validation.addMemberPrenupValid(), prenupController.createMemberPrenup)
app.post('/addPrenupBrideNonMember', validation.addPrenupBrideNonMember(), prenupController.createPrenupBrideNonMember)
app.post('/addPrenupGroomNonMember', validation.addPrenupGroomNonMember(), prenupController.createPrenupGroomNonMember)

app.post('/update_member', validation.addMemberValidation(), memberController.postUpdateMember)
app.post('/add_church', validation.churchValidation(), churchController.postAddChurch)
app.post('/add_observation', validation.observationValidation(), observationController.postAddObservation)
app.post('/checkCredentials', loginController.checkCredentials)

app.put('/update_observation', validation.observationValidation(), observationController.putUpdateObservation)
app.put('/update_church', validation.churchValidation(), churchController.putUpdateChurch)

app.delete('/delete_observation', observationController.delObservation)
app.delete('/delete_church', churchController.delChurch)

module.exports = app
