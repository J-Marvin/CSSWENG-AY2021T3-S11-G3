const db = require('../models/db.js')
const personFields = require('../models/person')
const memberFields = require('../models/members')

const controller = {
  getIndex: function (req, res) {
    res.render('index')
  },
  /**
   * This function inserts a new row in the member table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createMember: function (req, res) {
    const data = {}
    data[memberFields.ADDRESS] = req.body// .fieldName
    data[memberFields.AGE] = req.body// .fieldName
    data[memberFields.ALMA_MATER] = req.body// .fieldName
    data[memberFields.BIRTHDAY] = req.body// .fieldName
    data[memberFields.CIVIL_STATUS] = req.body// .fieldName
    data[memberFields.EDUCATIONAL_ATTAINMENT] = req.body// .fieldName
    data[memberFields.EMAIL] = req.body// .fieldName
    data[memberFields.MEMBER_STATUS] = req.body// .fieldName
    data[memberFields.MOBILE] = req.body// .fieldName
    data[memberFields.OCCUPATION] = req.body// .fieldName
    data[memberFields.PERSON] = req.body// .fieldName
    data[memberFields.WORKPLACE] = req.body// .fieldName

    db.insertOne(db.tables.MEMBER_TABLE, data, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  },
  /**
   * This function updates a row in the members table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  updateMember: function (req, res) {
    const data = req.query.data
    const condition = req.query.condition

    db.updateOne(db.tables.MEMBER_TABLE, data, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  },
  /**
   * This function deletes a row in the members table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  deleteMember: function (req, res) {
    const condition = req.query.condition

    db.updateOne(db.tables.MEMBER_TABLE, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  }
}

module.exports = controller
