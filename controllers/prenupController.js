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
    const data = {
      prenup: {},
      couple: {},
      male: {},
      female: {}
    } // object that will be passed later on insert(prenup)
    data.prenup[prenupRecordFields.DATE] = req.body.date
    data.prenup[prenupRecordFields.DATE_OF_WEDDING] = req.body.weddingDate

    data.male[personFields.FIRST_NAME] = req.body.maleFirst
    data.male[personFields.MID_NAME] = req.body.maleMid
    data.male[personFields.LAST_NAME] = req.body.maleLast

    data.female[personFields.FIRST_NAME] = req.body.femaleFirst
    data.female[personFields.MID_NAME] = req.body.femaleMid
    data.female[personFields.LAST_NAME] = req.body.femaleLast

    // insert male name to PERSON_TABLE
    db.insert(db.tables.PERSON_TABLE, data.male, function (maleId) {
      if (maleId) {
        data.couple[coupleFields.MALE] = maleId

        // insert female name to PERSON_TABLE
        db.insert(db.tables.PERSON_TABLE, data.female, function (femaleId) {
          if (femaleId) {
            data.couple[coupleFields.FEMALE] = femaleId

            // insert the couple to COUPLE_TABLE
            db.insert(db.tables.COUPLE_TABLE, data.couple, function (coupleId) {
              if (coupleId) {
                data.prenup[prenupRecordFields.COUPLE] = coupleId

                // finally insert to the prenup table
                db.insert(db.tables.PRENUPTIAL_TABLE, data.prenup, function (result) {
                  if (result !== false) {
                    // insert res.render() or res.redirect()
                  }
                })
              } else {
                res.send('COUPLE ID ERROR')
              }
            })
          } else {
            res.send('FEMALE ID ERROR')
          }
        })
      } else {
        res.send('MALE ID ERROR')
      }
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
