const bcrypt = require('bcrypt')
const db = require('../models/db')

const loginController = {
  getLoginPage: function (req, res) {
    res.render('login', {
      styles: ['login'],
      scripts: ['login']
    })
  },
  postLogIn: function (req, res) {
    const password = req.body.password

    new Promise((resolve, reject) => {
      db.findAll(db.tables.ACCOUNT_TABLE, '*', async function (result) {
        let level = 0
        for (let i = 0; i < result.length && level === 0; i++) {
          const same = await bcrypt.compare(password, result[i].hashed_password)
          if (same) {
            level = result[i].level
          }
        }
        resolve(level)
      })
    }).then((level) => {
      if (level) {
        res.render('main-page', {
          styles: ['mainPage'],
          Level: level
        })
      } else {
        res.status(401)
        res.render('error', {
          title: '401 Unauthorized Access',
          css: ['global', 'error'],
          status: {
            code: '401',
            message: 'Unauthorized access'
          }
        })
      }
    }).catch((err) => {
      if (err) {
        res.send(err.message)
      }
    })
  },
  checkCredentials: function (req, res) {
    const password = req.body.password

    new Promise((resolve, reject) => {
      db.findAll(db.tables.ACCOUNT_TABLE, '*', async function (result) {
        let level = 0
        for (let i = 0; i < result.length && level === 0; i++) {
          const same = await bcrypt.compare(password, result[i].hashed_password)
          if (same) {
            level = result[i].level
          }
        }
        resolve(level)
      })
    }).then((level) => {
      if (level) {
        res.send(level.toString())
      } else {
        res.send(false)
      }
    }).catch((err) => {
      if (err) {
        res.send(err.message)
      }
    })
  }
}

module.exports = loginController
