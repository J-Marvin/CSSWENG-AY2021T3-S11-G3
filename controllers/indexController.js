const db = require('../models/db.js')
const memberFields = require('../models/members')
const { Condition, queryTypes } = require('../models/condition')
const personFields = require('../models/person.js')
const addressFields = require('../models/address.js')
// const prenupRecordFields = require('../models/prenupRecord')
// const coupleFields = require('../models/couple')

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
        })
      })
    }
  },

  getFormsMainPage: function (req, res) {
    res.render('forms-main-page')
  }
}

module.exports = controller
