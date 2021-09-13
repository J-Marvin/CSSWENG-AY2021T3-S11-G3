const observationFields = require('../models/observation')
const db = require('../models/db')
const { Condition, queryTypes } = require('../models/condition')

const observationController = {
  postAddObservation: function (req, res) {
    const data = {}

    data[observationFields.OBSERVER] = req.body.observer
    data[observationFields.OBSERVEE] = req.body.observee
    data[observationFields.COMMENT] = req.body.comment
    data[observationFields.DATE] = new Date().toISOString()

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
  },

  putUpdateObservation: function (req, res) {
    const data = {}
    const condition = new Condition(queryTypes.where)
    condition.setKeyValue(observationFields.ID, req.body.observation_id)

    data[observationFields.OBSERVER] = req.body.observer
    data[observationFields.OBSERVEE] = req.body.observee
    data[observationFields.COMMENT] = req.body.comment
    db.update(db.tables.OBSERVATION_TABLE, data, condition, function (result) {
      if (result) {
        res.send(true)
      } else {
        res.send(false)
      }
    })
  },

  delObservation: function (req, res) {
    const condition = new Condition(queryTypes.where)
    condition.setKeyValue(observationFields.ID, req.body.observation_id)

    db.delete(db.tables.OBSERVATION_TABLE, condition, function (result) {
      if (result) {
        res.send(true)
      } else {
        res.send(false)
      }
    })
  }
}

module.exports = observationController
