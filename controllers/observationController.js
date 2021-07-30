const path = require('path')

const observationFields = require(path.join(__dirname, '../models/observation'))
const db = require(path.join(__dirname, '../models/db'))
const addressFields = require(path.join(__dirname, '../models/address'))
const { Condition, queryTypes } = require(path.join(__dirname, '../models/Condition'))

const observationController = {
  postAddObservation: function (req, res) {
    const data = {}

    data[observationFields.OBSERVER] = req.body.observer
    data[observationFields.OBSERVEE] = req.body.observee
    data[observationFields.COMMENT] = req.body.comment

    console.log(data)
    db.insert(db.tables.OBSERVATION_TABLE, data, function (result) {
      if (result) {
        data.observation_id = result[0]
        data.layout = false
        res.render('partials/observation', data, function (err, html) {
          if (err) {
            res.send(false)
          } else {
            res.send(html)
          }
        })
      }
    })
  }
}

module.exports = observationController
