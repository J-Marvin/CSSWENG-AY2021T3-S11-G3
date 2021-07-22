const db = require('../models/db.js')

const controller = {
  getIndex: function (req, res) {
    db.initDB('members.db', 'database')
    res.render('index')
  }
}

module.exports = controller
