const db = require('../models/db.js')
const memberFields = require('../models/members')
const personFields = require('../models/person')
const addressFields = require('../models/address')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/couple')
const weddingRegFields = require('../models/weddingRegistry')
const infDedFields = require('../models/infantDedication')
const bapRegFields = require('../models/baptismalRegistry')
const { Condition, queryTypes } = require('../models/condition')
const { sendError } = require('./errorController')
const moment = require('moment')
const bcrypt = require('bcrypt')
const accountFields = require('../models/accounts.js')
const { tables } = require('../models/db.js')
const saltRounds = 10

const controller = {
  /**
   * This function renders the main page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getMainPage: function (req, res) {
    req.session.editId = null
    const level = req.session.level
    if (level !== undefined && level !== null) {
      res.render('main-page', {
        level: req.session.level,
        styles: ['mainPage'],
        scripts: [''],
        canSee: !(parseInt(req.session.level) === 1)
      })
    } else {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    }
  },
  /**
   * This function renders the member main page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getMemberMainPage: function (req, res) {
    const level = req.session.level
    // const level = '3'
    req.session.editId = null
    if (level === undefined || level === null || parseInt(level) === 1) {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    } else {
      const joinTables = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        },
        {
          tableName: db.tables.ADDRESS_TABLE,
          sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.ADDRESS,
          destCol: db.tables.ADDRESS_TABLE + '.' + addressFields.ID
        }
      ]

      db.find(db.tables.MEMBER_TABLE, null, joinTables, '*', function (result) {
        if (result) {
          const data = {
            styles: ['lists'],
            scripts: ['convertDataTable'],
            canSee: parseInt(req.session.level) === 3
          }

          result.forEach(function (member) {
            member.address = member[addressFields.ADDRESS_LINE] + ', ' + member[addressFields.CITY] + ', ' + member[addressFields.COUNTRY]
            member.age = moment().diff(moment(member[memberFields.BIRTHDAY]), 'years')
          })

          data.members = result
          data.backLink = '/main_page'
          res.render('member-main-page', data)
        } else {
          sendError(req, res, 404)
        }
      })
    }
  },
  /**
   * This function renders the forms main page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getFormsMainPage: function (req, res) {
    req.session.editId = null
    res.render('forms-main-page', {
      level: req.session.level,
      styles: ['mainPage'],
      scripts: [''],
      canSee: !(parseInt(req.session.level) === 1),
      backLink: 'main_page'
    })
  },
  /**
   * This function renders the child dedication record main page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getDedicationMainPage: function (req, res) {
    const level = req.session.level
    req.session.editId = null

    if (level === undefined || level === null || parseInt(level) === 1) {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        scripts: ['convertDataTable'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    } else {
      const joinTables = [
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID,
          destCol: db.tables.INFANT_TABLE + '.' + infDedFields.PARENTS
        },
        {
          tableName: { infant: db.tables.PERSON_TABLE },
          sourceCol: db.tables.INFANT_TABLE + '.' + infDedFields.PERSON,
          destCol: 'infant.' + personFields.ID
        },
        {
          type: 'leftJoin',
          tableName: { guardianOne: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: 'guardianOne.' + personFields.ID
        },
        {
          type: 'leftJoin',
          tableName: { guardianTwo: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: 'guardianTwo.' + personFields.ID
        }
      ]

      const columns = [
        db.tables.INFANT_TABLE + '.' + infDedFields.ID,
        'infant.' + personFields.FIRST_NAME + ' as infant_first_name',
        'infant.' + personFields.MID_NAME + ' as infant_mid_name',
        'infant.' + personFields.LAST_NAME + ' as infant_last_name',
        'guardianOne.' + personFields.FIRST_NAME + ' as guardianOne_first_name',
        'guardianOne.' + personFields.MID_NAME + ' as guardianOne_mid_name',
        'guardianOne.' + personFields.LAST_NAME + ' as guardianOne_last_name',
        'guardianTwo.' + personFields.FIRST_NAME + ' as guardianTwo_first_name',
        'guardianTwo.' + personFields.MID_NAME + ' as guardianTwo_mid_name',
        'guardianTwo.' + personFields.LAST_NAME + ' as guardianTwo_last_name',
        db.tables.INFANT_TABLE + '.' + infDedFields.DATE + ' as date'
      ]
      db.find(db.tables.INFANT_TABLE, null, joinTables, columns, function (result) {
        res.render('dedication-main-page', {
          styles: ['lists'],
          scripts: ['convertDataTable'],
          dedication: result,
          backLink: 'forms_main_page'
        })
      })
    }
  },
  /**
   * This function renders the prenuptial record main page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getPrenupMainPage: function (req, res) {
    req.session.editId = null
    const level = req.session.level

    if (level === undefined || level === null || parseInt(level) === 1) {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    } else {
      const joinTables = [
        {
          tableName: db.tables.PRENUPTIAL_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID,
          destCol: db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.COUPLE
        },
        {
          tableName: { bride: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: 'bride.' + personFields.ID
        },
        {
          tableName: { groom: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: 'groom.' + personFields.ID
        }
      ]

      const columns = [
        db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID,
        db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.DATE_OF_WEDDING,
        db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.DATE,
        'bride.' + personFields.FIRST_NAME + ' as bride_first_name',
        'bride.' + personFields.MID_NAME + ' as bride_mid_name',
        'bride.' + personFields.LAST_NAME + ' as bride_last_name',
        'groom.' + personFields.FIRST_NAME + ' as groom_first_name',
        'groom.' + personFields.MID_NAME + ' as groom_mid_name',
        'groom.' + personFields.LAST_NAME + ' as groom_last_name'
      ]

      db.find(db.tables.COUPLE_TABLE, null, joinTables, columns, function (result) {
        res.render('prenup-main-page', {
          styles: ['lists'],
          scripts: ['convertDataTable'],
          prenup: result,
          backLink: 'forms_main_page'
        })
      })
    }
  },
  /**
   * This function renders the wedding main page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getWeddingMainPage: function (req, res) {
    const level = req.session.level
    req.session.editId = null
    if (level === undefined || level === null || parseInt(level) === 1) {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    } else {
      const joinTables = [
        {
          tableName: db.tables.WEDDING_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID,
          destCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.COUPLE
        },
        {
          tableName: { bride: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: 'bride.' + personFields.ID
        },
        {
          tableName: { groom: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: 'groom.' + personFields.ID
        }
      ]

      const columns = [
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.ID,
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.DATE_OF_WEDDING,
        db.tables.WEDDING_TABLE + '.' + weddingRegFields.DATE + ' as date',
        'bride.' + personFields.FIRST_NAME + ' as bride_first_name',
        'bride.' + personFields.MID_NAME + ' as bride_mid_name',
        'bride.' + personFields.LAST_NAME + ' as bride_last_name',
        'groom.' + personFields.FIRST_NAME + ' as groom_first_name',
        'groom.' + personFields.MID_NAME + ' as groom_mid_name',
        'groom.' + personFields.LAST_NAME + ' as groom_last_name'
      ]

      db.find(db.tables.COUPLE_TABLE, null, joinTables, columns, function (result) {
        res.render('wedding-main-page', {
          styles: ['lists'],
          scripts: ['convertDataTable'],
          prenup: result,
          backLink: 'forms_main_page'
        })
      })
    }
  },
  /**
   * This function renders the baptismal record main page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getBapRecordsMainPage: function (req, res) {
    const level = req.session.level
    req.session.editId = null

    if (level === undefined || level === null || parseInt(level) === 1) {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    } else {
      const joinTables = [
        {
          tableName: { member: db.tables.PERSON_TABLE },
          sourceCol: db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.PERSON,
          destCol: 'member.' + personFields.ID
        },
        {
          tableName: { officiant: db.tables.PERSON_TABLE },
          sourceCol: db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.OFFICIANT,
          destCol: 'officiant.' + personFields.ID
        }
      ]

      const columns = [
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.ID + ' as reg_id',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.DATE + ' as date',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.DATE_CREATED + ' as date_created',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.LOCATION + ' as place',
        'member.' + personFields.FIRST_NAME + ' as member_first_name',
        'member.' + personFields.MID_NAME + ' as member_mid_name',
        'member.' + personFields.LAST_NAME + ' as member_last_name',
        'member.' + personFields.MEMBER + ' as member_id',
        'officiant.' + personFields.FIRST_NAME + ' as officiant_first_name',
        'officiant.' + personFields.MID_NAME + ' as officiant_mid_name',
        'officiant.' + personFields.LAST_NAME + ' as officiant_last_name',
        'officiant.' + personFields.MEMBER + ' as officiant_id'
      ]

      db.find(db.tables.BAPTISMAL_TABLE, [], joinTables, columns, function (result) {
        const data = {}
        data.records = result
        data.scripts = ['convertDataTable']
        data.styles = ['lists']
        data.backLink = 'forms_main_page'

        res.render('baptismal-main-page', data)
      })
    }
  },
  /**
   * This function
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getSettings: function (req, res) {
    if (parseInt(req.session.level) === 3) {
      const data = {
        scripts: ['settings'],
        styles: ['settings'],
        passwords: {}
      }
      db.findAll(db.tables.ACCOUNT_TABLE, '*', function (result) {
        // data.passwords = result
        for (let i = 0; i < result.length; i++) {
          if (result[i].level === '1') {
            data.passwords.low = result[i].hashed_password
          } else if (result[i].level === '2') {
            data.passwords.med = result[i].hashed_password
          } else if (result[i].level === '3') {
            data.passwords.high = result[i].hashed_password
          }
        }
        res.render('settings-page', data)
      })
    } else {
      sendError(req, res, 401)
    }
  },
  /**
   * This function changes the password of the given level and password
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  postChangePassword: function (req, res) {
    // process passwords
    if (parseInt(req.session.level) === 3) {
      const level = req.body.level
      const password = req.body.password

      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          res.send(false)
        } else {
          const levelCondition = new Condition(queryTypes.where)
          levelCondition.setKeyValue(accountFields.ID, level)
          const data = {}
          data[accountFields.PASSWORD] = hash
          db.update(tables.ACCOUNT_TABLE, data, levelCondition, function (result) {
            if (result) {
              res.send(true)
            } else {
              res.send(false)
            }
          })
        }
      })
    } else {
      sendError(req, res, 401)
    }
  },
  /**
   * This function changes the password of the given level and password
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  postComparePasswords: function (req, res) {
    const confirmPass = req.body.confirmPass
    const currPass = req.body.currPass
    bcrypt.compare(confirmPass, currPass, function (err, result) {
      if (err) {
        res.send(false)
      }
      res.send(result) // sends boolean true or false
    })
  },
  /**
   * This function drops all tables in the database
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  postDropAllTables: function (req, res) {
    db.deleteAndReset()
    res.send(true)
  }
}

module.exports = controller
