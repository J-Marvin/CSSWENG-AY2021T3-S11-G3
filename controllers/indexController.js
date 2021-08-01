const db = require('../models/db.js')
const memberFields = require('../models/members')
const { Condition, queryTypes } = require('../models/condition')
const personFields = require('../models/person.js')
const addressFields = require('../models/address.js')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/couple')

const controller = {
  getIndex: function (req, res) {
    res.render('index')
  },

  getMainPage: function (req, res) {
    res.render('main-page', {
      level: req.session.level
    })
  },

  getMemberMainPage: function (req, res) {
    res.render('member-main-page')
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
