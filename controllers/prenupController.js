const db = require('../models/db.js')
const personFields = require('../models/person')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/Couple.js')

const prenupController = {
  /**
   * This function inserts a new row in the prenuptial table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createPrenup: function (req, res) {
    const data = {} // object that will be passed later on insertOne(prenup)
    data[prenupRecordFields.DATE] = req.body.date
    data[prenupRecordFields.DATE_OF_WEDDING] = req.body.wedddingDate

    const couple = {}
    const male = {}
    male[personFields.FIRST_NAME] = req.body.maleFirst
    male[personFields.MID_NAME] = req.body.maleMid
    male[personFields.LAST_NAME] = req.body.maleLast

    const female = {}
    female[personFields.FIRST_NAME] = req.body.femaleFirst
    female[personFields.MID_NAME] = req.body.femaleMid
    female[personFields.LAST_NAME] = req.body.femaleLast

    // insert male name to PERSON_TABLE
    db.insertOne(db.tables.PERSON_TABLE, male, function (maleId) {
      couple[coupleFields.MALE] = maleId

      // insert female name to PERSON_TABLE
      db.insertOne(db.tables.PERSON_TABLE, female, function (femaleId) {
        couple[coupleFields.FEMALE] = femaleId

        // insert the couple to COUPLE_TABLE
        db.insertOne(db.tables.COUPLE_TABLE, couple, function (coupleId) {
          data[prenupRecordFields.COUPLE] = coupleId

          // finally insert to the prenup table
          db.insertOne(db.tables.PRENUPTIAL_TABLE, data, function (result) {
            if (result !== false) {
            // insert res.render() or res.redirect()
            }
          })
        })
      })
    })
  },
  /**
   * This function updates a row in the prenuptial table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  updatePrenup: function (req, res) {
    const data = req.query.data
    const condition = req.query.condition

    db.updateOne(db.tables.MEMBER_TABLE, data, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  },
  /**
   * This function deletes a row in the prenuptial table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  deletePrenup: function (req, res) {
    const condition = req.query.condition

    db.updateOne(db.tables.MEMBER_TABLE, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  }
}

module.exports = prenupController
