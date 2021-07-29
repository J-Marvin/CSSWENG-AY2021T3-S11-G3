const db = require('../models/db.js')
const personFields = require('../models/person')
const memberFields = require('../models/members')
const addressFields = require('../models/address')
const bapRegFields = require('../models/baptismalRegistry')
const { validationResult } = require('express-validator')
const { Condition, queryTypes } = require('../models/condition.js')

const memberController = {
  /**
   * This function displays the add member page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getAddMemberPage: function (req, res) {
    res.render('add-member-temp')
  },

  getEditMember: function (req, res) {
    const condition = new Condition(queryTypes.where)
    const joinTables = [
      {
        tableName: db.tables.PERSON_TABLE,
        sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
        destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
      },
      {
        tableName: db.tables.ADDRESS_TABLE,
        sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.ADDRESS,
        destCol: db.tables.ADDRESS_TABLE + '.' + addressFields.ID
      }
    ]

    condition.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, parseInt(req.params.member_id))
    db.find(db.tables.MEMBER_TABLE, condition, joinTables, '*', function (result) {
      if (result) {
        console.log(result)
        res.render('edit-member-temp.hbs', {
          member: result[0]
        })
      }
    })
  },

  /**
   * This function inserts a new row in the member table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createMember: function (req, res) {
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
      errors = errors.errors

      console.log(errors)
      let msg = ''

      errors.forEach((error) => {
        msg += error.msg + '<br>'
      })

      res.send(msg)
    } else {
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
      data.member[memberFields.SKILLS] = req.body.skills
      data.member[memberFields.DATE] = new Date().toString()

      // insert to PEOPLE table
      db.insert(db.tables.PERSON_TABLE, data.person, function (personId) {
        // update person_id
        if (personId) {
          data.member[memberFields.PERSON] = personId

          // insert to ADDRESS table
          db.insert(db.tables.ADDRESS_TABLE, data.address, function (addressId) {
            // update address_id
            if (addressId) {
              data.member[memberFields.ADDRESS] = addressId
              // finally insert to MEMBER table
              db.insert(db.tables.MEMBER_TABLE, data.member, function (result) {
                // insert res.render() or res.redirect()
                const personCondition = new Condition(queryTypes.where)
                personCondition.setKeyValue(personFields.ID, data.member[memberFields.PERSON])
                const memberId = result[0]
                db.updateOne(db.tables.PERSON_TABLE, { member_id: result[0] }, personCondition, function(result) {
                  res.redirect("/edit_member/" + memberId)

                })
              })
            } else {
              res.send('ERROR')
            }
          })
        } else {
          res.send('ERROR')
        }
      })
    }
  },
  /**
   * This function updates a row in the members table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  updateMember: function (req, res) {
    const data = {
      person: {},
      address: {},
      member: {}
    }

    const addressCondition = new Condition(queryTypes.where)
    addressCondition.setKeyValue(addressFields.ID, req.body.addressId)
    const personCondition = new Condition(queryTypes.where)
    personCondition.setKeyValue(personFields.ID, req.body.personId)
    const memberCondition = new Condition(queryTypes.where)
    memberCondition.setKeyValue(memberFields.ID, req.body.memberId)

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
    data.member[memberFields.SKILLS] = req.body.skills

    db.updateOne(db.tables.PERSON_TABLE, data.address, addressCondition, function (result) {
      if (!result) {
        res.send(false)
      } else {
        db.updateOne(db.tables.ADDRESS_TABLE, data.person, personCondition, function (result) {
          if (!result) {
            res.send(false)
          } else {
            db.updateOne(db.tables.MEMBER_TABLE, data.member, memberCondition, function (result) {
              res.send(result)
            })
          }
        })
      }
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

    db.insert(db.tables.BAPTISMAL_TABLE, data, function (result) {
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
