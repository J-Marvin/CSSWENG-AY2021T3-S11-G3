const db = require('../models/db')

const personController = {
  postAddPerson: function (req, res, callback = null) {
    const people = JSON.parseInt(req.body.people)

    db.insert(db.tables.PERSON_TABLE, people, function (result) {
      if (result) {
        if (callback !== null) {
          callback(result)
        } else {
          res.send(result)
        }
      }
    })
  },

  putUpdatePerson: function (req, res, callback = null) {
    res.send(true)
  },

  delPerson: function(req, res) {
    res.send(true)
  }
}

module.exports = personController
