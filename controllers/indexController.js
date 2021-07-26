const db = require('../models/db.js')
const sqlite3 = require('better-sqlite3')
const path = require('path')
const member_fields = require('../models/members.js')

const controller = {
  getIndex: function (req, res) {

    let data = {}

    
    data[member_fields.WORKPLACE] = "Baguio"

    db.insertOne(db.tables.MEMBER_TABLE, data, function(result) {
      console.log(result)
    })
    res.render('index')
  }
}

module.exports = controller
