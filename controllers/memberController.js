const db = require('../models/db.js')
const personFields = require('../models/person')
const memberFields = require('../models/members')
const addressFields = require('../models/address')
const bapRegFields = require('../models/baptismalRegistry')
const churchFields = require('../models/church')
const { validationResult } = require('express-validator')
const observationFields = require('../models/observation')
const { Condition, queryTypes } = require('../models/condition.js')
const moment = require('moment')
const baptismalController = require('./baptismalController.js')

const memberController = {
  /**
   * This function displays the add member page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getAddMemberPage: function (req, res) {
    req.session.editId = null
    res.render('add-member-temp', {
      styles: ['forms'],
      scripts: ['member']
    })
  },

  getEditMember: function (req, res) {
    if (req.session.editId === parseInt(req.params.member_id) || parseInt(req.session.level) === 3) {
      const data = {
        styles: ['forms'],
        scripts: ['member']
      }
      const condition = new Condition(queryTypes.where)
      const churchCondition = new Condition(queryTypes.where)
      const observationCondition = new Condition(queryTypes.where)

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

      const joinChurchTables = [
        {
          tableName: db.tables.ADDRESS_TABLE,
          sourceCol: db.tables.CHURCH_TABLE + '.' + churchFields.ADDRESS,
          destCol: db.tables.ADDRESS_TABLE + '.' + addressFields.ID
        }
      ]

      condition.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, parseInt(req.params.member_id))
      churchCondition.setKeyValue(churchFields.MEMBER, parseInt(req.params.member_id))
      observationCondition.setKeyValue(observationFields.OBSERVEE, parseInt(req.params.member_id))
      db.find(db.tables.MEMBER_TABLE, condition, joinTables, '*', function (result) {
        if (result) {
          data.member = result[0]
          db.find(db.tables.CHURCH_TABLE, churchCondition, joinChurchTables, '*', function (result) {
            if (result) {
              data.churches = result

              db.find(db.tables.OBSERVATION_TABLE, observationCondition, null, '*', function (result) {
                if (result) {
                  data.observations = result
                  res.render('edit-member-temp', data)
                }
              })
            }
          })
        }
      })
    } else {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    }
  },

  getViewMember: function (req, res) {
    if (parseInt(req.session.editId) === parseInt(req.params.member_id) || parseInt(req.session.level) >= 2) {
      const data = {
      }
      const condition = new Condition(queryTypes.where)
      const churchCondition = new Condition(queryTypes.where)
      const observationCondition = new Condition(queryTypes.where)

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

      const joinChurchTables = [
        {
          tableName: db.tables.ADDRESS_TABLE,
          sourceCol: db.tables.CHURCH_TABLE + '.' + churchFields.ADDRESS,
          destCol: db.tables.ADDRESS_TABLE + '.' + addressFields.ID
        }
      ]

      condition.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, parseInt(req.params.member_id))
      churchCondition.setKeyValue(churchFields.MEMBER, parseInt(req.params.member_id))
      observationCondition.setKeyValue(observationFields.OBSERVEE, parseInt(req.params.member_id))
      db.find(db.tables.MEMBER_TABLE, condition, joinTables, '*', function (result) {
        if (result) {
          data.member = result[0]
          db.find(db.tables.CHURCH_TABLE, churchCondition, joinChurchTables, '*', function (result) {
            if (result) {
              data.churches = result
              db.find(db.tables.OBSERVATION_TABLE, observationCondition, null, '*', function (result) {
                if (result) {
                  data.observations = result
                  data.member.age = new Date(data.member.birthday)
                  const today = moment()
                  const b = moment(data.member.birthday)

                  data.member.age = moment.duration(today.diff(b)).years()
                  data.styles = ['view']
                  data.scripts = ['removeButtons', 'deleteMember']
                  data.canSee = (parseInt(req.session.level) === 3) || req.session.editId !== null
                  data.backLink = parseInt(req.session.level) >= 2 ? '/member_main_page' : '/main_page'
                  res.render('view-member', data)
                }
              })
            }
          })
        }
      })
    } else {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    }
  },

  /**
   * This function inserts a new row in the member table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createMember: function (req, res) {
    let errors = validationResult(req)

    if (req.session.level !== null && req.session.level !== undefined) {
      if (!errors.isEmpty()) {
        errors = errors.errors
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
        data.person[personFields.MID_NAME] = req.body.middle_name
        data.person[personFields.LAST_NAME] = req.body.last_name

        data.address[addressFields.ADDRESS_LINE] = req.body.address_line
        data.address[addressFields.ADDRESS_LINE2] = req.body.address_line2
        data.address[addressFields.CITY] = req.body.city
        data.address[addressFields.PROVINCE] = req.body.province
        data.address[addressFields.POSTAL_CODE] = req.body.postal_code
        data.address[addressFields.COUNTRY] = req.body.country

        data.member[memberFields.BIRTHDAY] = req.body.birthday
        data.member[memberFields.OCCUPATION] = req.body.occupation
        data.member[memberFields.WORKPLACE] = req.body.workplace
        data.member[memberFields.EMAIL] = req.body.email
        data.member[memberFields.MOBILE] = req.body.mobile
        data.member[memberFields.TELEPHONE] = req.body.telephone
        data.member[memberFields.EDUCATIONAL_ATTAINMENT] = req.body.educational_attainment
        data.member[memberFields.ALMA_MATER] = req.body.alma_mater
        data.member[memberFields.SKILLS] = req.body.skills
        data.member[memberFields.MEMBER_STATUS] = req.body.membership_status
        data.member[memberFields.FAMILY] = req.body.family_members
        data.member[memberFields.SEX] = req.body.sex
        data.member[memberFields.DATE] = new Date().toISOString()
        data.member[memberFields.MEMBER_TYPE] = req.body.membership_type

        if (req.body.membership_status !== 'Active' && req.body.membership_status !== 'Inactive') {
          data.member[memberFields.MEMBER_TYPE] = null
        }

        if (req.body.civil_status !== 'Others') {
          data.member[memberFields.CIVIL_STATUS] = req.body.civil_status
        } else {
          data.member[memberFields.CIVIL_STATUS] = req.body.civil_status_others
        }

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
                  db.update(db.tables.PERSON_TABLE, { member_id: result[0] }, personCondition, function (result) {
                    req.session.editId = memberId
                    res.redirect('/member/' + memberId)
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
    } else {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    }
  },
  /**
   * This function updates a row in the members table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  postUpdateMember: function (req, res) {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors = errors.errors

      let msg = ''

      errors.forEach((error) => {
        msg += error.msg + '\n'
      })

      res.send(msg)
    } else {
      const data = {
        person: {},
        address: {},
        member: {}
      }

      const addressCondition = new Condition(queryTypes.where)
      addressCondition.setKeyValue(addressFields.ID, req.body.address_id)
      const personCondition = new Condition(queryTypes.where)
      personCondition.setKeyValue(personFields.ID, req.body.person_id)
      const memberCondition = new Condition(queryTypes.where)
      memberCondition.setKeyValue(memberFields.ID, req.body.member_id)

      data.person[personFields.FIRST_NAME] = req.body.first_name
      data.person[personFields.MID_NAME] = req.body.middle_name
      data.person[personFields.LAST_NAME] = req.body.last_name

      data.address[addressFields.ADDRESS_LINE] = req.body.address_line
      data.address[addressFields.ADDRESS_LINE2] = req.body.address_line2
      data.address[addressFields.CITY] = req.body.city
      data.address[addressFields.PROVINCE] = req.body.province
      data.address[addressFields.POSTAL_CODE] = req.body.postal_code
      data.address[addressFields.COUNTRY] = req.body.country

      data.member[memberFields.BIRTHDAY] = req.body.birthday
      data.member[memberFields.OCCUPATION] = req.body.occupation
      data.member[memberFields.WORKPLACE] = req.body.workplace
      data.member[memberFields.EMAIL] = req.body.email
      data.member[memberFields.MOBILE] = req.body.mobile
      data.member[memberFields.TELEPHONE] = req.body.telephone
      data.member[memberFields.EDUCATIONAL_ATTAINMENT] = req.body.educational_attainment
      data.member[memberFields.ALMA_MATER] = req.body.alma_mater
      data.member[memberFields.SKILLS] = req.body.skills
      data.member[memberFields.FAMILY] = req.body.family_members
      data.member[memberFields.MEMBER_STATUS] = req.body.membership_status
      data.member[memberFields.CIVIL_STATUS] = req.body.civil_status
      data.member[memberFields.SEX] = req.body.sex

      data.member[memberFields.MEMBER_TYPE] = req.body.membership_type

      if (req.body.membership_status !== 'Active' && req.body.membership_status !== 'Inactive') {
        data.member[memberFields.MEMBER_TYPE] = null
      }

      db.update(db.tables.PERSON_TABLE, data.person, personCondition, function (result) {
        if (!result) {
          res.send(false)
        } else {
          db.update(db.tables.ADDRESS_TABLE, data.address, addressCondition, function (result) {
            if (!result) {
              res.send(false)
            } else {
              db.update(db.tables.MEMBER_TABLE, data.member, memberCondition, function (result) {
                if (result) {
                  res.send(true)
                } else {
                  res.send(false)
                }
              })
            }
          })
        }
      })
    }
  },
  /**
   * This function deletes a row in the members table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  deleteMember: function (req, res) {
    const recordId = req.body.recordId
    const bapRecordId = req.body.bapRecordId

    const addresses = JSON.parse(req.body.addresses)

    const addressCond = new Condition(queryTypes.whereIn)
    addressCond.setArray(addressFields.ID, addresses)

    const recordCond = new Condition(queryTypes.where)
    recordCond.setKeyValue(memberFields.ID, recordId)

    db.delete(db.tables.MEMBER_TABLE, recordCond, function (result) {
      if (result) {
        db.delete(db.tables.ADDRESS_TABLE, addressCond, function (result) {
          if (result) {
            if (bapRecordId !== null && bapRecordId !== undefined && bapRecordId !== '') {
              req.body.recordId = bapRecordId
              baptismalController.delBaptismal(req, res)
            } else {
              res.send(true)
            }
          } else {
            res.send(false)
          }
        })
      } else {
        res.send(false)
      }
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
    // this will look like {prenup_record_id: <some prenup id>} inside db.update
    const data = {}
    data[memberFields.PRENUP_RECORD] = recordId

    // set up the WHERE condition: WHERE member_id = <some member id>
    const condition = {}
    condition[memberFields.ID] = memberId
    db.update(db.tables.MEMBER_TABLE, data, condition, function (result) {
      if (result !== false) {
        // insert res.render() or res.redirect()
      }
    })
  }
}

module.exports = memberController
