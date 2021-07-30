const path = require('path')

const observationFields = require(path.join(__dirname, '../models/obvservation'))
const db = require(path.join(__dirname, '../models/db'))
const addressFields = require(path.join(__dirname, '../models/address'))
const { Condition, queryTypes } = require(path.join(__dirname, '../models/Condition'))

const observationController = {
  postAddObservation: function (req, res) {
    const data = {
    }
  }
}

module.exports = observationController
