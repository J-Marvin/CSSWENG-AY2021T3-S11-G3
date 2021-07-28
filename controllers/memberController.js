const db = require('../models/db.js')
const personFields = require('../models/person')
const memberFields = require('../models/members')
const addressFields = require('../models/address')
const bapRegFields = require('../models/baptismalRegistry')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/Couple.js')

const memberController = {
  /**
   * This function inserts a new row in the member table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createMember: function (req, res) {
    const data = {}
    const temp1 = {} // temp object for inserting into PEOPLE table
    const temp2 = {} // temp object for inserting into ADDRESS table
    temp1[personFields.FIRST_NAME] = req.body.firstName// .fieldName
    temp1[personFields.MID_NAME] = req.body.middleName// .fieldName
    temp1[personFields.LAST_NAME] = req.body.lastName// .fieldName

    data[personFields.FIRST_NAME] = temp1.first_name
    data[personFields.MID_NAME] = temp1.middle_name
    data[personFields.LAST_NAME] = temp1.last_name

    // insert to PEOPLE table
    db.insertOne(db.tables.PERSON_TABLE, temp1, function (personId) {
      // update person_id
      data[memberFields.PERSON] = personId

      temp2[addressFields.STREET] = req.body.street// .fieldName
      temp2[addressFields.BRGY] = req.body.brgy// .fieldName
      temp2[addressFields.CITY] = req.body.city// .fieldName
      temp2[addressFields.PROVINCE] = req.body.province// .fieldName

      // insert to ADDRESS table
      db.insertOne(db.tables.ADDRESS_TABLE, data, function (addressId) {
        // update address_id
        data[memberFields.ADDRESS] = addressId
        data[addressFields.STREET] = temp2.street
        data[addressFields.BRGY] = temp2.barangay
        data[addressFields.CITY] = temp2.city
        data[addressFields.PROVINCE] = temp2.province

        // put all other fields
        data[memberFields.AGE] = req.body.age // .fieldName
        data[memberFields.ALMA_MATER] = req.body.address // .fieldName
        data[memberFields.BIRTHDAY] = req.body.birthday // .fieldName
        data[memberFields.CIVIL_STATUS] = req.body.civilStatus // .fieldName
        data[memberFields.EDUCATIONAL_ATTAINMENT] = req.body.educ // .fieldName
        data[memberFields.EMAIL] = req.body.email // .fieldName
        data[memberFields.MEMBER_STATUS] = req.body.memberStatus // .fieldName
        data[memberFields.MOBILE] = req.body.mobile // .fieldName
        data[memberFields.OCCUPATION] = req.body.occupation // .fieldName
        data[memberFields.WORKPLACE] = req.body.workplace // .fieldName

        // finally insert to MEMBER table
        db.insertOne(db.tables.MEMBER_TABLE, data, function (result) {
          // insert res.render() or res.redirect()
        })
      })
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
  },
  /**
   * This function inserts a baptismal registry into the BAPTISMAL REGISTRY table.
   * This baptismal registry belongs to this member.
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  insertBaptismal: function (req, res) {
    const data = {}
    // include algo for linking this member's bap_reg_id
    data[bapRegFields.DATE] = req.query.date
    data[bapRegFields.LOCATION] = req.query.location
    data[bapRegFields.OFFICIANT] = req.query.officiant

    db.insertOne(db.tables.BAPTISMAL_TABLE, data, function (result) {
      // insert res.render() or res.redirect()
    })
  },
  /**
   * This function receives the prenuptial 'record_id' and a member's 'prenup_record_id'
   * @param req - the incoming request containing containing the member_id
   * @param res - the result to be sent out after processing the request
   */
  linkPrenup: function (req, res) {
    /*
    sql query: UPDATE members SET prenup_record_id = record_id
    WHERE member_id = <some member id>
    */
    const recordId = req.query.recordId
    const memberId = req.query.memberId

    // set up the SET query: SET SET prenup_record_id = record_id
    // this will look like {prenup_record_id: <some prenup id>} inside db.updateOne
    const data = {}
    data[memberFields.PRENUP_RECORD] = recordId

    // set up the WHERE condition: WHERE member_id = <some member id>
    const condition = {}
    condition[memberFields.ID] = memberId
    db.updateOne(db.tables.MEMBER_TABLE, data, condition, function (result) {
      if (result !== false) {
        // insert res.render() or res.redirect()
      }
    })
  }
}

module.exports = memberController
