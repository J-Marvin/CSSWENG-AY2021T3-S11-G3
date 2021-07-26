const db = require('../models/db.js')
const sqlite3 = require('better-sqlite3')
const path = require('path')

const controller = {
  getIndex: function (req, res) {

    let data = {
      'workplace': "Manila"
    }

    db.insertOne(db.tables.MEMBER_TABLE, data, function(result) {
      console.log(result)
    })
    res.render('index')
  }
}

module.exports = controller
