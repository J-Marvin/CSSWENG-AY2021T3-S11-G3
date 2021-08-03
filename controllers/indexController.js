const db = require('../models/db.js')
const memberFields = require('../models/members')
const { Condition, queryTypes } = require('../models/condition')
const personFields = require('../models/person.js')
const addressFields = require('../models/address.js')
// const prenupRecordFields = require('../models/prenupRecord')
// const coupleFields = require('../models/couple')

const controller = {
  getIndex: function (req, res) {
    res.render('index')
  },

  getMainPage: function (req, res) {
    res.render('main-page', {
      level: req.session.level,
      styles: ['mainPage'],
      scripts: ['']
    })
  },

  getMemberMainPage: function (req, res) {
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
          members: result
        })
      })
    }
  },

  getFormsMainPage: function (req, res) {
    res.render('forms-main-page')
  },

  joinSample: function (req, res) {
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
    const conditions = []

    const a = new Condition(queryTypes.where)
    a.setQueryObject({
      first_name: 'Garrus'
    })

    conditions.push(a)

    db.find(db.tables.MEMBER_TABLE, conditions, joinTables, '*', function (result) {
      console.log(result)
      res.send(result)
    })
  }
}

module.exports = controller
