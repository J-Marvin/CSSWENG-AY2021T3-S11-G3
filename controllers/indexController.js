const db = require('../models/db.js')
const sqlite3 = require('better-sqlite3')
const path = require('path')

const file = sqlite3(path.join('database', 'church.db'), { verbose: console.log })

const controller = {
  getIndex: function (req, res) {
    db.initDB(file)
    res.render('index')
  }
}

module.exports = controller
