const db = require('../models/db.js')
const personFields = require('../models/person')
const memberFields = require('../models/members')
const addressFields = require('../models/address')

const memberController = {
  /**
   * This function displays the add member page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getAddMemberPage: function(req, res) {
    res.render('add-member-temp')
  },

  /**
   * This function inserts a new row in the member table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createMember: function (req, res) {
    const data = {
      person: {},
      member: {},
      address: {}
    }

    data.person[personFields.FIRST_NAME] = req.body.first_name
    data.person[personFields.MID_NAME] = req.body.mid_name
    data.person[personFields.LAST_NAME] = req.body.last_name

    data.address[addressFields.ADDRESS_LINE] = req.body.address_line
    data.address[addressFields.BRGY] = req.body.barangay
    data.address[addressFields.CITY] = req.body.city
    data.address[addressFields.PROVINCE] = req.body.PROVINCE

    data.member[memberFields.AGE] = req.body.age
    data.member[memberFields.BIRTHDAY] = req.body.birthday
    data.member[memberFields.OCCUPATION] = req.body.occupation
    data.member[memberFields.WORKPLACE] = req.body.workplace
    data.member[memberFields.EMAIL] = req.body.email
    data.member[memberFields.MOBILE] = req.body.mobile
    data.member[memberFields.EDUCATIONAL_ATTAINMENT] = req.body.educational_attainment
    data.member[memberFields.ALMA_MATER] = req.body.alma_mater

    // insert to PEOPLE table
    db.insertOne(db.tables.PERSON_TABLE, data.person, function (personId) {
      // update person_id
      if (personId) {
        data.member[memberFields.PERSON] = personId

        // insert to ADDRESS table
        db.insertOne(db.tables.ADDRESS_TABLE, data.address, function (addressId) {
          // update address_id
          if (addressId) {
            data.member[memberFields.ADDRESS] = addressId
            // finally insert to MEMBER table
            db.insertOne(db.tables.MEMBER_TABLE, data.member, function (result) {
              // insert res.render() or res.redirect()
              res.send(result)
            })
          } else {
            res.send('ERROR')
          }
        })
      } else {
        res.send('ERROR')
      }
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

module.exports = memberController
