const express = require('express')
const path = require('path')
const validation = require('../helpers/validation')

const indexController = require('../controllers/indexController')
const loginController = require('../controllers/loginController')
const memberController = require('../controllers/memberController')
const prenupController = require('../controllers/prenupController')
const churchController = require('../controllers/churchController')
const observationController = require('../controllers/observationController')
const dedicationController = require('../controllers/dedicationController')
const weddingController = require('../controllers/weddingController')
const baptismalController = require('../controllers/baptismalController')
const searchController = require('../controllers/searchController')

const app = express()
app.set('views', path.join(__dirname, '../views'))

app.get('/', loginController.getLoginPage)
app.get('/login_page', loginController.getLoginPage)
app.get('/logout', loginController.getLogout)
app.get('/main_page', indexController.getMainPage)
app.get('/member_main_page', indexController.getMemberMainPage)
app.get('/settings_page', indexController.getSettings)
app.get('/add_member', memberController.getAddMemberPage)
app.get('/add_dedication', dedicationController.getAddDedicationPage)
app.get('/view_dedication/:dedication_id', dedicationController.getViewDedication)
app.get('/edit_dedication/:dedication_id', dedicationController.getEditDedication)

app.get('/add_wedding', weddingController.getAddWeddingPage)
app.get('/view_wedding/:wedding_id', weddingController.getViewWeddingPage)
app.get('/edit_wedding/:wedding_id', weddingController.getEditWedding)
app.get('/edit_member/:member_id', memberController.getEditMember)
app.get('/edit_prenup/:prenup_id', prenupController.getEditPrenup)
app.get('/forms_main_page', indexController.getFormsMainPage)
app.get('/add_baptismal', baptismalController.getAddBaptismalRecordPage)
app.get('/edit_baptismal', baptismalController.getEditBaptismal)
app.get('/add_baptismal/:member_id', baptismalController.getAddBaptismalRecordPage)
app.get('/view_baptismal/:bap_id', baptismalController.getViewBaptismalRecord)

app.get('/advanced_search', searchController.getAdvancedSearch)
app.get('/search_member', searchController.getSearchMember)
app.get('/search_prenup', searchController.getSearchPrenup)
app.get('/search_wedding', searchController.getSearchWedding)
app.get('/search_baptismal', searchController.getSearchBaptismal)
app.get('/search_dedication', searchController.getSearchDedication)

app.get('/member/:member_id', memberController.getViewMember)

app.get('/prenup_main_page', indexController.getPrenupMainPage)
app.get('/add_prenup', prenupController.getPrenupPage)
app.get('/edit_member/:member_id/add_prenup', prenupController.getPrenupPage)
app.get('/view_prenup/:prenup_id', prenupController.getViewPrenup)
app.get('/edit_prenup/:prenup_id', prenupController.getEditPrenup)

app.get('/dedication_main_page', indexController.getDedicationMainPage)
app.get('/wedding_main_page', indexController.getWeddingMainPage)
app.get('/baptismal_main_page', indexController.getBapRecordsMainPage)

app.post('/login', loginController.postLogIn)
app.post('/add_member', validation.addMemberValidation(), memberController.createMember)

// app.post('/create_wedding_registry'/* validation function */, weddingController.createWedding)
app.post('/add_wedding_reg', weddingController.postAddWedding)

app.post('/create_prenup', validation.addPrenupValidation(), prenupController.createPrenup)
app.post('/create_prenup_member', validation.addMemberPrenupValid(), prenupController.createMemberPrenup)
app.post('/addPrenupBrideNonMember', validation.addPrenupBrideNonMember(), prenupController.createPrenupBrideNonMember)
app.post('/addPrenupGroomNonMember', validation.addPrenupGroomNonMember(), prenupController.createPrenupGroomNonMember)

app.post('/postUpdatePrenupMember', prenupController.postUpdatePrenupMember)
app.post('/postUpdatePrenupNonMember', prenupController.postUpdatePrenupNonMember)
app.post('/postUpdatePrenupBrideMember', prenupController.postUpdatePrenupBrideMember)
app.post('/postUpdatePrenupGroomMember', prenupController.postUpdatePrenupGroomMember)

app.post('/add_dedication', dedicationController.postAddDedication)
app.post('/add_baptismal', baptismalController.postAddBaptismalRecord)

app.post('/update_member', validation.addMemberValidation(), memberController.postUpdateMember)
app.post('/add_church', validation.churchValidation(), churchController.postAddChurch)
app.post('/add_observation', validation.observationValidation(), observationController.postAddObservation)
app.post('/checkCredentials', loginController.checkCredentials)
app.post('/postComparePasswords', indexController.postComparePasswords)
app.post('/postChangePassword', indexController.postChangePassword)
app.post('/deleteAndReset', indexController.postDropAllTables)

app.put('/update_observation', validation.observationValidation(), observationController.putUpdateObservation)
app.put('/update_church', validation.churchValidation(), churchController.putUpdateChurch)

app.delete('/delete_observation', observationController.delObservation)
app.delete('/delete_church', churchController.delChurch)

module.exports = app
