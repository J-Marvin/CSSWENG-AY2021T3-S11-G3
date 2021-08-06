const db = require('../models/db.js')
const memberFields = require('../models/members')
const personFields = require('../models/person.js')
const addressFields = require('../models/address.js')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/couple')

const controller = {
  getMainPage: function (req, res) {
    req.session.editMemberId = null
    res.render('main-page', {
      level: req.session.level,
      styles: ['mainPage'],
      scripts: [''],
      canSee: !(parseInt(req.session.level) === 1)
    })
  },
  getMemberMainPage: function (req, res) {
    const level = req.session.level
    req.session.editMemberId = null
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
        result.forEach(function (member) {
          member.address = member[addressFields.ADDRESS_LINE] + ', ' + member[addressFields.CITY] + ', ' + member[addressFields.COUNTRY]
        })

        res.render('member-main-page', {
          styles: ['lists'],
          members: result,
          canSee: parseInt(req.session.level) === 3
        })
      })
    }
  },

  getFormsMainPage: function (req, res) {
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
        'bride.' + personFields.FIRST_NAME + ' as bride_first_name',
        'bride.' + personFields.MID_NAME + ' as bride_mid_name',
        'bride.' + personFields.LAST_NAME + ' as bride_last_name',
        'groom.' + personFields.FIRST_NAME + ' as groom_first_name',
        'groom.' + personFields.MID_NAME + ' as groom_mid_name',
        'groom.' + personFields.LAST_NAME + ' as groom_last_name'
      ]

      db.find(db.tables.COUPLE_TABLE, null, joinTables, columns, function (result) {
        console.log(result)

        res.render('forms-main-page', {
          styles: ['lists'],
          prenup: result
        })
      })
    }
  }
}

module.exports = controller
