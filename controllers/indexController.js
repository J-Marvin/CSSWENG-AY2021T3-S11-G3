const db = require('../models/db.js')
const sqlite3 = require('better-sqlite3')
const memberFields = require('../models/members.js')

const controller = {
  getIndex: function (req, res) {
    const data = {}

    data[memberFields.WORKPLACE] = 'Baguio'

    db.insertOne(db.tables.MEMBER_TABLE, data, function(result) {
      console.log(result)
      res.render('index')
    })
  }
}

module.exports = controller
