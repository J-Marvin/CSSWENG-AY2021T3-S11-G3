const db = require('../models/db.js')
const memberFields = require('../models/members')
const { Condition, queryTypes } = require('../models/condition')

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
  }
}

module.exports = controller
