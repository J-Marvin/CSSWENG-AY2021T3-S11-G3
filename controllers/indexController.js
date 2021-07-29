const db = require('../models/db.js')
const memberFields = require('../models/members')
const { Condition, queryTypes } = require('../models/condition')
const personFields = require('../models/Person.js')
const addressFields = require('../models/address.js')

const controller = {
  getIndex: function (req, res) {
    const queries = []
    let query = new Condition(queryTypes.where)
    query.setQueryObject({
      first_name: 'Jonathan'
    })
    queries.push(query)

    // query = new Condition(queryTypes.where)
    // query.setKeyValue('last_name', 'TEST')

    // queries.push(query)
    console.log(queries)
    db.find(db.tables.PERSON_TABLE, queries, '*', function (result) {
      console.log(result)
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
