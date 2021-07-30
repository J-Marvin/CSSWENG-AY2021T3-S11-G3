const db = require('../models/db.js')
const memberFields = require('../models/members')
const { Condition, queryTypes } = require('../models/condition')
const personFields = require('../models/Person.js')
const addressFields = require('../models/address.js')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/couple')

const controller = {
  getIndex: function (req, res) {
    // const queries = []
    // let query = new Condition(queryTypes.where)
    // query.setQueryObject({
    //   first_name: 'Jonathan'
    // })
    // queries.push(query)

    // // query = new Condition(queryTypes.where)
    // // query.setKeyValue('last_name', 'TEST')

    // // queries.push(query)
    // console.log(queries)
    // db.find(db.tables.PERSON_TABLE, queries, [], '*', function (result) {
    //   console.log(result)
    // })
    let joinTables = []
    // boolean variable indicating which partner, male or female
    const partner = false // req.query.partnerBool
    // if male
    if (partner === true) {
      joinTables = [
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.COUPLE,
          destCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID
        },
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
    // else if female
    } else {
      joinTables = [
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.COUPLE,
          destCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID
        },
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
    }
    const conditions = []
    const c = new Condition(queryTypes.where)
    c.setQueryObject({
      record_id: 4000001 // req.query.id
    })

    conditions.push(c)
    db.find(db.tables.PRENUPTIAL_TABLE, conditions, joinTables, '*', function (result) {
      if (result !== false) {
        console.log(result)
        // res.send(result)
        // res.render('', result)
      }
    })

    res.render('index')
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
