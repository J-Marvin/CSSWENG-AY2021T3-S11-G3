const bcrypt = require('bcrypt')
const db = require('../models/db')
const async = require('async')

const loginController = {
  getLoginPage: function (req, res) {
    res.render('login')
  },
  postLogIn: function (req, res) {
    const password = req.body.password

    db.findAll(db.tables.ACCOUNT_TABLE, function (result) {
      async.each(result, function (account, callback) {
        bcrypt.compare(password, account.hashed_password, function (err, same) {
          if (err) {
            console.log(err)
          } else if (same) {
            res.send(account.level)
          }
        })
      }, function (err) {
        if (err) {
          console.log(err)
        }
      })
    })
  }
}

module.exports = loginController
