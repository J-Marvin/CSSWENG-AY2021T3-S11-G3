const db = require('../models/db')
const personFields = require('../models/person')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/couple')
const { Condition, queryTypes } = require('../models/condition')
const { validationResult, query } = require('express-validator')
const memberFields = require('../models/members')
const { sendError } = require('./errorController')

const prenupController = {
  /**
   * This function renders the view of a specific prenuptial record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getViewPrenup: function (req, res) {
    const prenupId = req.params.prenup_id
    if (parseInt(req.session.editId) === parseInt(prenupId) || parseInt(req.session.level) >= 2) {
      /*
      tables needed: PRENUPTIAL_TABLE, COUPLE_TABLE, PEOPLE_TABLE, MEMBER_TABLE
      SQL:
      SELECT *
      FROM pre_nuptial
      JOIN couples ON couples.couple_id = pre_nuptial.couple_id
      JOIN people ON people.person_id = couples.female_id
      */
      let data = {} // the prenuptial details to be rendered

      const joinTables = [
        // Join prenup to couple table with same id
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.COUPLE,
          destCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID
        },

        // Join table to person table from bride's person ID
        {
          tableName: { bride: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: 'bride.' + personFields.ID
        },

        // Join table to person table from groom's person ID
        {
          tableName: { groom: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: 'groom.' + personFields.ID
        },

        // Left join table to members id where member's person id is the same as bride's person id
        {
          type: 'leftJoin',
          tableName: { bride_member: db.tables.MEMBER_TABLE },
          sourceCol: 'bride.' + personFields.ID,
          destCol: 'bride_member.' + memberFields.PERSON
        },
        // Left join table to members id where member's person id is the same as groom's person id
        {
          type: 'leftJoin',
          tableName: { groom_member: db.tables.MEMBER_TABLE },
          sourceCol: 'groom.' + personFields.ID,
          destCol: 'groom_member.' + memberFields.PERSON
        }
      ]
      // All the fields needed here
      const columns = [
        db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID + ' as prenupId',
        db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.DATE_OF_WEDDING + ' as weddingDate',
        db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.DATE + ' as date',
        'bride.' + personFields.FIRST_NAME + ' as brideFirst',
        'bride.' + personFields.MID_NAME + ' as brideMid',
        'bride.' + personFields.LAST_NAME + ' as brideLast',
        'groom.' + personFields.FIRST_NAME + ' as groomFirst',
        'groom.' + personFields.MID_NAME + ' as groomMid',
        'groom.' + personFields.LAST_NAME + ' as groomLast',
        'groom_member.' + memberFields.ID + ' as groomMemberId',
        'bride_member.' + memberFields.ID + ' as brideMemberId'
      ]

      const cond = new Condition(queryTypes.where)
      cond.setKeyValue(db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID, prenupId)

      db.find(db.tables.PRENUPTIAL_TABLE, cond, joinTables, columns, function (result) {
        if (result !== null && result.length > 0) {
          data = {
            // spread syntax
            ...result[0]
          }
          // canSee is set to the edit button
          data.canSee = (parseInt(req.session.editId) === parseInt(prenupId)) || (parseInt(req.session.level) >= 2)
          if ((parseInt(req.session.level) <= 2)) {
            data.canSee = false
          }
          data.styles = ['view']
          data.backLink = parseInt(req.session.level) >= 2 ? '/forms_main_page' : '/main_page'
          res.render('view-prenup', data)
        } else {
          sendError(req, res, 404, '404 Prenup Record Not Found')
        }
      })
    } else {
      sendError(req, res, 401)
    }
  },
  /**
   * This function gets all prenuptial details and renders the add prenuptial page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getPrenupPage: function (req, res) {
    /**
     * This function selects the member based on member_id and renders this
     * one member in the dropdown options in add-prenup-temp.hbs
     */
    function selectMember (member) {
      // let brideNames = []
      // let groomNames = []
      const conditions3 = new Condition(queryTypes.where)
      const joinTables3 = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      // find the row record of this member
      conditions3.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, member)
      db.find(db.tables.MEMBER_TABLE, conditions3, joinTables3, '*', function (result) {
        const memberInfo = result
        const cond = new Condition(queryTypes.where) // setup the where condition
        // check if member is male
        if (memberInfo[0][memberFields.SEX] === 'Male') {
          const groomNames = result
          console.log('groomNames: ' + groomNames)

          // find all bride members
          // cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.SEX, 'Female')
          cond.setQueryObject(
            {
              sex: 'Female',
              civil_status: 'Single'
            }
          )
          const cond2 = new Condition(queryTypes.whereNull)
          cond2.setField(db.tables.MEMBER_TABLE + '.' + memberFields.PRENUP_RECORD)

          db.find(db.tables.MEMBER_TABLE, [cond, cond2], joinTables3, '*', function (result) {
            if (result !== null) {
              const brideNames = result
              console.log('brideNames: ' + brideNames)
              req.session.editId = member
              res.render('add-prenup-temp', {
                scripts: ['addPrenup'],
                styles: ['forms'],
                Origin: 'coming from edit member',
                brideNames: brideNames,
                groomNames: groomNames,
                lockGroomNonMember: true
              })
            }
          })

        // if the member is a female
        } else {
          const brideNames = result
          console.log('brideNames: ' + brideNames)
          // find all groom members
          // cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.SEX, 'Male')
          cond.setQueryObject(
            {
              sex: 'Male',
              civil_status: 'Single'
            }
          )
          const cond2 = new Condition(queryTypes.whereNull)
          cond2.setField(db.tables.MEMBER_TABLE + '.' + memberFields.PRENUP_RECORD)

          db.find(db.tables.MEMBER_TABLE, [cond, cond2], joinTables3, '*', function (result) {
            if (result !== null) {
              const groomNames = result
              console.log('groomNames: ' + groomNames)
              req.session.editId = member
              res.render('add-prenup-temp', {
                scripts: ['addPrenup'],
                styles: ['forms'],
                Origin: 'coming from edit member',
                brideNames: brideNames,
                groomNames: groomNames,
                lockBrideNonMember: true
              })
            }
          })
        } // end of else
      })
    }
    /**
     * This function selects all the single members and renders all names
     * in the dropdown option in add-prenup-temp.hbs
     */
    function selectAllMembers () {
      const cond1 = new Condition(queryTypes.where)
      const cond2 = new Condition(queryTypes.whereNull)
      const cond3 = new Condition(queryTypes.where)
      const cond4 = new Condition(queryTypes.whereNull)

      const joinTables1 = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      let brideNames = []
      let groomNames = []
      // set the WHERE clause
      cond1.setQueryObject(
        {
          sex: 'Female',
          civil_status: 'Single'
        }
      )
      cond2.setField(db.tables.MEMBER_TABLE + '.' + memberFields.PRENUP_RECORD)
      // get all female members
      db.find(db.tables.MEMBER_TABLE, [cond1, cond2], joinTables1, '*', function (result) {
        if (result !== null) {
          brideNames = result
          console.log(brideNames)
          // conditions = []

          // set the WHERE clause
          cond3.setQueryObject(
            {
              sex: 'Male',
              civil_status: 'Single'
            }
          )
          cond4.setField(db.tables.MEMBER_TABLE + '.' + memberFields.PRENUP_RECORD)

          // get all male members
          db.find(db.tables.MEMBER_TABLE, [cond3, cond4], joinTables1, '*', function (result) {
            // console.log(result)
            if (result !== null) {
              groomNames = result
              console.log(groomNames)
              req.session.editId = null
              res.render('add-prenup-temp', {
                styles: ['forms'],
                scripts: ['addPrenup'],
                Origin: 'coming from forms creation',
                brideNames: brideNames,
                groomNames: groomNames
              })
            }
          })
        }
      })
    }
    // function execution starts here
    const member = req.params.member_id
    if (member === undefined) {
      selectAllMembers()
    } else {
      selectMember(member)
    }
  },
  /**
   * This function creates a prenuptial row into the prenuptial table
   * when both partners are non-members
   * @param req
   * @param res
   */
  createPrenup: function (req, res) {
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
        prenup: {},
        couple: {},
        male: {},
        female: {}
      } // object that will be passed later on insert(prenup)
      data.prenup[prenupRecordFields.DATE] = req.body.current_date
      data.prenup[prenupRecordFields.DATE_OF_WEDDING] = req.body.wedding_date

      data.male[personFields.FIRST_NAME] = req.body.groom_first_name
      data.male[personFields.MID_NAME] = req.body.groom_mid_name
      data.male[personFields.LAST_NAME] = req.body.groom_last_name

      data.female[personFields.FIRST_NAME] = req.body.bride_first_name
      data.female[personFields.MID_NAME] = req.body.bride_mid_name
      data.female[personFields.LAST_NAME] = req.body.bride_last_name

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
                      console.log(result)
                      req.session.editId = result[0]
                      res.redirect('/view_prenup/' + result[0])
                      // if (parseInt(req.session.level) === 1) {
                      //   console.log('here if')
                      //   res.redirect('/main_page')
                      // } else {
                      //   console.log('here else')
                      //   res.redirect('/view_prenup/' + result[0])
                      // }
                    } else {
                      res.send('ADD PRENUP ERROR')
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
    }
  },
  /**
   * This function inserts a new row (member) in the prenuptial table
   * when both partners are members
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createMemberPrenup: function (req, res) {
    /*
    updating the
    */
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
        prenup: {},
        couple: {},
        result: {}
      } // object that will be passed later on insert(prenup)
      // these two variables contains <member_id>, <first_name>, <middle_name>, <last_name>
      // INDICES
      const MEMBER_ID = 0
      const PERSON_ID = 1
      const FIRST = 2
      const MIDDLE = 3
      const LAST = 4

      const bride = req.body.input_bride_member
      const groom = req.body.input_groom_member
      const date = req.body.current_date
      const weddingDate = req.body.wedding_date

      const brideInfo = bride.split(', ')
      const groomInfo = groom.split(', ')

      const brideMemberId = brideInfo[MEMBER_ID]
      const bridePersonId = brideInfo[PERSON_ID]
      data.result.brideFirst = brideInfo[FIRST]
      data.result.brideMid = brideInfo[MIDDLE]
      data.result.brideLast = brideInfo[LAST]

      const groomMemberId = groomInfo[MEMBER_ID]
      const groomPersonId = groomInfo[PERSON_ID]
      data.result.groomFirst = groomInfo[FIRST]
      data.result.groomMid = groomInfo[MIDDLE]
      data.result.groomLast = groomInfo[LAST]

      data.result.currentDate = date
      data.result.weddingDate = weddingDate

      data.prenup[prenupRecordFields.DATE] = date
      data.prenup[prenupRecordFields.DATE_OF_WEDDING] = weddingDate
      /**
       * ALGO:
       * INSERT INTO COUPLE TABLE
       * INSERT INTO PRENUPTIAL
       * UPDATE BOTH PARTNER'S prenuptial_record_id
       */
      data.couple[coupleFields.FEMALE] = bridePersonId
      data.couple[coupleFields.MALE] = groomPersonId

      // insert to couple table and callback returns the inserted couple_id
      db.insert(db.tables.COUPLE_TABLE, data.couple, function (coupleId) {
        if (coupleId !== null) {
          data.prenup[prenupRecordFields.COUPLE] = coupleId

          // insert to prenuptial table and callback returns the inserted prenuptial record_id
          db.insert(db.tables.PRENUPTIAL_TABLE, data.prenup, function (prenupRecId) {
            if (prenupRecId !== null) {
              const memberCondition = new Condition(queryTypes.where)
              memberCondition.setKeyValue(memberFields.ID, brideMemberId)

              // finally update prenuptial_id of the bride in MEMBERS table
              db.update(db.tables.MEMBER_TABLE, { prenup_record_id: prenupRecId }, memberCondition, function (result) {
                if (result !== null) {
                  // finally update prenuptial_id of the groom in MEMBERS table
                  memberCondition.setKeyValue(memberFields.ID, groomMemberId)
                  db.update(db.tables.MEMBER_TABLE, { prenup_record_id: prenupRecId }, memberCondition, function (result) {
                    if (result !== null) {
                      // redirect to view prenup if level >= 2 else go back to main page
                      req.session.editId = prenupRecId
                      res.redirect('/view_prenup/' + prenupRecId)
                    } else {
                      res.send('UPDATE MEMBER ID ERROR')
                    }
                  })
                } else {
                  res.send('UPDATE MEMBER PRENUPTIAL ERROR')
                }
              })
            } else {
              res.send('PRENUP ERROR')
            }
          })
        } else {
          res.send('COUPLE ID ERROR')
        }
      })
    }
  },
  /**
   * This function inserts a new row (member) in the prenuptial table
   * when both the BRIDE IS A NON-MEMBER and the GROOM IS A MEMBER
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createPrenupBrideNonMember: function (req, res) {
    /*
      ALGO (<number>):
      the bride's info will first be inserted to
      (0) PEOPLE table (returns person_id) ->
      (1) COUPLE table (returns couple_id) ->
      (2) PRENUPTIAL table (returns prenuptial_record_id)
      (same as createPrenup function/route)
    */
    const brideFirst = req.body.bride_first_name
    const brideMid = req.body.bride_mid_name
    const brideLast = req.body.bride_last_name
    /*
      the groom's info will then proceed the same as createMemberPrenup
      ALGO (<number>):
      (1) INSERT INTO COUPLE TABLE (returns person_id)
      (2) INSERT INTO PRENUPTIAL (returns prenuptial_record_id)
      (3) UPDATE THE GROOM'S prenuptial_record_id (UPDATE members SET prenuptial_record_id = <some_ID>)
    */
    // this gets the select value specifically <member_id>, <person_id>, <first_name>, <middle_name>, <last_name>
    const groom = req.body.input_groom_member
    const groomInfo = groom.split(', ')
    // INDICES
    const MEMBER_ID = 0
    const PERSON_ID = 1
    const FIRST = 2
    const MIDDLE = 3
    const LAST = 4

    const groomMemberId = groomInfo[MEMBER_ID]
    const groomPersonId = groomInfo[PERSON_ID]
    const groomFirst = groomInfo[FIRST]
    const groomMid = groomInfo[MIDDLE]
    const groomLast = groomInfo[LAST]

    const date = req.body.current_date
    const weddingDate = req.body.wedding_date

    /* insert the bride's info first (i.e. ALGO (0)) */
    const data = {
      prenup: {}, // ALGO (2)
      couple: {}, // ALGO (1)
      female: {} // ALGO (0)
    }
    // ALGO (0)
    data.female[personFields.FIRST_NAME] = brideFirst
    data.female[personFields.MID_NAME] = brideMid
    data.female[personFields.LAST_NAME] = brideLast
    // insert to PEOPLE table
    db.insert(db.tables.PERSON_TABLE, data.female, function (personId) {
      if (personId !== null) {
        // ALGO (1)
        data.couple[coupleFields.FEMALE] = personId
        data.couple[coupleFields.MALE] = groomPersonId
        // insert to COUPLE table
        db.insert(db.tables.COUPLE_TABLE, data.couple, function (coupleId) {
          if (coupleId !== null) {
            // ALGO (2)
            data.prenup[prenupRecordFields.COUPLE] = coupleId
            data.prenup[prenupRecordFields.DATE] = date
            data.prenup[prenupRecordFields.DATE_OF_WEDDING] = weddingDate
            // insert groom's MEMBER record
            db.insert(db.tables.PRENUPTIAL_TABLE, data.prenup, function (prenupRecId) {
              // lastly, update here
              if (prenupRecId !== null) {
                // set the WHERE clause: WHERE members.prenup_record_id
                const memberCondition = new Condition(queryTypes.where)
                memberCondition.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, groomMemberId)
                db.update(db.tables.MEMBER_TABLE, { prenup_record_id: prenupRecId }, memberCondition, function (result) {
                  if (result !== null) {
                    // redirect to view prenup if level >= 2 else go back to main page
                    req.session.editId = prenupRecId
                    res.redirect('/view_prenup/' + prenupRecId)
                  } else {
                    res.send('UPDATE PRENUP ERROR')
                  }
                })
              } else {
                res.send("GROOM'S PRENUP ERROR")
              }
            })
          } else {
            res.send('COUPLE ID ERROR')
          }
        })
      } else {
        res.send('PERSON (BRIDE) ID ERROR')
      }
    })
  },
  /**
   * This function inserts a new row (member) in the prenuptial table
   * when both the GROOM IS A NON-MEMBER and the BRIDE IS A MEMBER
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createPrenupGroomNonMember: function (req, res) {
    /*
      ALGO (<number>):
      the groom's info will first be inserted to
      (0) PEOPLE table (returns person_id) ->
      (1) COUPLE table (returns couple_id) ->
      (2) PRENUPTIAL table (returns prenuptial_record_id)
      (same as createPrenup function/route)
    */
    const groomFirst = req.body.groom_first_name
    const groomMid = req.body.groom_mid_name
    const groomLast = req.body.groom_last_name
    /*
      the bride's info will then proceed the same as createMemberPrenup
      ALGO (<number>):
      (1) INSERT INTO COUPLE TABLE (returns person_id)
      (2) INSERT INTO PRENUPTIAL (returns prenuptial_record_id)
      (3) UPDATE THE GROOM'S prenuptial_record_id (UPDATE members SET prenuptial_record_id = <some_ID>)
    */
    // this gets the select value specifically <member_id>, <person_id>, <first_name>, <middle_name>, <last_name>
    const bride = req.body.input_bride_member
    const brideInfo = bride.split(', ')
    // INDICES
    const MEMBER_ID = 0
    const PERSON_ID = 1
    const FIRST = 2
    const MIDDLE = 3
    const LAST = 4

    const brideMemberId = brideInfo[MEMBER_ID]
    const bridePersonId = brideInfo[PERSON_ID]
    const brideFirst = brideInfo[FIRST]
    const brideMid = brideInfo[MIDDLE]
    const brideLast = brideInfo[LAST]

    const date = req.body.current_date
    const weddingDate = req.body.wedding_date

    /* insert the bride's info first (i.e. ALGO (0)) */
    const data = {
      prenup: {}, // ALGO (2)
      couple: {}, // ALGO (1)
      male: {} // ALGO (0)
    }
    // ALGO (0)
    data.male[personFields.FIRST_NAME] = groomFirst
    data.male[personFields.MID_NAME] = groomMid
    data.male[personFields.LAST_NAME] = groomLast
    // insert to PEOPLE table
    db.insert(db.tables.PERSON_TABLE, data.male, function (personId) {
      if (personId !== null) {
        // ALGO (1)
        data.couple[coupleFields.MALE] = personId
        data.couple[coupleFields.FEMALE] = bridePersonId
        // insert to COUPLE table
        db.insert(db.tables.COUPLE_TABLE, data.couple, function (coupleId) {
          if (coupleId !== null) {
            // ALGO (2)
            data.prenup[prenupRecordFields.COUPLE] = coupleId
            data.prenup[prenupRecordFields.DATE] = date
            data.prenup[prenupRecordFields.DATE_OF_WEDDING] = weddingDate
            // insert bride's MEMBER record
            db.insert(db.tables.PRENUPTIAL_TABLE, data.prenup, function (prenupRecId) {
              // lastly, update here
              if (prenupRecId !== null) {
                // set the WHERE clause: WHERE members.member_id = brideMemberId
                const memberCondition = new Condition(queryTypes.where)
                memberCondition.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, brideMemberId)
                db.update(db.tables.MEMBER_TABLE, { prenup_record_id: prenupRecId }, memberCondition, function (result) {
                  if (result !== null) {
                    // redirect to view prenup if level >= 2 else go back to main page
                    req.session.editId = prenupRecId
                    res.redirect('/view_prenup/' + prenupRecId)
                  } else {
                    res.send('ERROR')
                  }
                })
              } else {
                res.send("BRIDE'S PRENUP ERROR")
              }
            })
          } else {
            res.send('COUPLE ID ERROR')
          }
        })
      } else {
        res.send('PERSON (GROOM) ID ERROR')
      }
    })
  },
  /**
   * This function renders the edit prenup form page supplying the text fields with
   * details from the existing
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getEditPrenup: function (req, res) {
    const prenupId = req.params.prenup_id
    if (parseInt(req.session.level) === 3 || parseInt(req.session.editId === parseInt(prenupId))) {
    // if (parseInt(req.session.level) === 3) { // For testing purposes
      /*
      SELECT *
      FROM pre_nuptial
      JOIN couples ON pre_nuptial.couple_id = couples.couple_id
      JOIN people ON couples.male_id = people.person_id
      WHERE pre_nuptial.record_id = <some record id>
      */
      const data = {
        scripts: ['editPrenup'],
        styles: ['forms'],
        bride: {},
        groom: {}
      }
      // join table for the groom
      const joinTables1 = [
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.COUPLE,
          destCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID
        },
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      // join table for the bride
      const joinTables2 = [
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.COUPLE,
          destCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID
        },
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      const cond = new Condition(queryTypes.where)
      cond.setKeyValue(db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID, prenupId)
      // find the groom
      db.find(db.tables.PRENUPTIAL_TABLE, cond, joinTables1, '*', function (result) {
        if (result !== null) {
          data.groom = result[0]
          console.log('data.groom')
          console.log(data.groom)
          db.find(db.tables.PRENUPTIAL_TABLE, cond, joinTables2, '*', function (result) {
            if (result !== null) {
              data.bride = result[0]
              console.log('data.bride')
              console.log(data.bride)

              const femaleConds = [
                new Condition(queryTypes.where),
                new Condition(queryTypes.whereNull)
              ]

              const maleConds = [
                new Condition(queryTypes.where),
                new Condition(queryTypes.whereNull)
              ]
              const includeBrideCond = new Condition(queryTypes.orWhere)
              const includeGroomCond = new Condition(queryTypes.orWhere)

              const joinTables1 = [
                {
                  tableName: db.tables.PERSON_TABLE,
                  sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
                  destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
                }
              ]
              let brideNames = []
              let groomNames = []
              // set the WHERE clause
              femaleConds[0].setQueryObject(
                {
                  sex: 'Female',
                  civil_status: 'Single'
                }
              )
              femaleConds[1].setField(db.tables.MEMBER_TABLE + '.' + memberFields.PRENUP_RECORD)

              if (data.bride.member_id !== null && data.bride.member_id !== undefined) {
                includeBrideCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, data.bride.member_id)
                femaleConds.push(includeBrideCond)
              }

              if (data.groom.member_id !== null && data.groom.member_id !== undefined) {
                includeGroomCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, data.groom.member_id)
                maleConds.push(includeGroomCond)
              }

              // get all female members
              db.find(db.tables.MEMBER_TABLE, femaleConds, joinTables1, '*', function (result) {
                if (result !== null) {
                  brideNames = result
                  data.brideNames = brideNames
                  console.log("BRIDES")
                  console.log(brideNames)
                  // conditions = []

                  // set the WHERE clause
                  maleConds[0].setQueryObject(
                    {
                      sex: 'Male',
                      civil_status: 'Single'
                    }
                  )
                  maleConds[1].setField(db.tables.MEMBER_TABLE + '.' + memberFields.PRENUP_RECORD)

                  // get all male members
                  db.find(db.tables.MEMBER_TABLE, maleConds, joinTables1, '*', function (result) {
                    // console.log(result)
                    if (result !== null) {
                      groomNames = result
                      data.groomNames = groomNames
                      console.log(groomNames)
                      res.render('edit-prenup', data)
                    }
                  })
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
   * This function updates a row in the prenuptial table given that
   * both partners are members.
   * @param req - the incoming request containing either the query or body.
   *              the request should contain a boolean variable `partner`,
   *              if true indicates the `male` partner will be edited, else
   *              the `female` partner will be edited
   * @param res - the result to be sent out after processing the request
   */
  postUpdatePrenupMember: function (req, res) {
    /*
      This is innermost function declaration for updating new couple's prenuptial id
      "this couple takes over this prenuptial record"
    */
    function changeBothPartners (groom, bride, coupleId, prenupId) {
      const groomCond = new Condition(queryTypes.where)
      groomCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, groom.member_id)
      const brideCond = new Condition(queryTypes.where)
      brideCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, bride.member_id)
      // set couple male_id = null
      const coupleCond = new Condition(queryTypes.where)
      coupleCond.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.ID, coupleId)
      db.update(db.tables.COUPLE_TABLE, { male_id: null }, coupleCond, function (result) {
        if (result !== null) {
          // set couple female_id = null
          db.update(db.tables.COUPLE_TABLE, { female_id: null }, coupleCond, function (result) {
            // update new groom's prenup_record_id
            db.update(db.tables.MEMBER_TABLE, { prenup_record_id: prenupId }, groomCond, function (result) {
              if (result !== null) {
                // update the new member bride's prenup_record_id
                db.update(db.tables.MEMBER_TABLE, { prenup_record_id: prenupId }, brideCond, function (result) {
                  if (result !== null) {
                    // update new couple table male_id and female_id
                    db.update(db.tables.COUPLE_TABLE, { male_id: groom.person_id }, coupleCond, function (result) {
                      db.update(db.tables.COUPLE_TABLE, { female_id: bride.person_id }, coupleCond, function (result) {
                        res.send(true)
                      })
                    })
                  }
                })
              } else {
                console.log("update groom's prenup_record_id = prenupId error")
                res.send(false)
              }
            })
          })
        } else {
          console.log('set couple male_id = null')
          res.send(false)
        }
      })
    }
    // starts here
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
        groom: {},
        bride: {}
      }
      // old data groom
      const oldgroomMemberId = req.body.oldgroomMemberId
      // const oldgroomPersonId = req.body.oldgroomPersonId // male_id
      // const oldgroomFirst = req.body.oldgroomFirst
      // const oldgroomMiddle = req.body.oldgroomMiddle
      // const oldgroomLast = req.body.oldgroomLast

      // old data bride
      const oldbrideMemberId = req.body.oldbrideMemberId
      // const oldbridePersonId = req.body.oldbridePersonId // female_id
      // const bridebrideFirst = req.body.oldbrideFirst
      // const bridebrideMiddle = req.body.oldbrideMiddle
      // const bridebrideLast = req.body.oldbrideLast

      // new data groom
      const newgroomMemberId = req.body.newgroomMemberId
      const newgroomPersonId = req.body.newgroomPersonId // male_id
      // const newgroomFirst = req.body.newgroomFirst
      // const newgroomMiddle = req.body.newgroomMiddle
      // const newgroomLast = req.body.newgroomLast

      // new data bride
      const newbrideMemberId = req.body.newbrideMemberId
      const newbridePersonId = req.body.newbridePersonId // female_id
      // const newbridebrideFirst = req.body.newbrideFirst
      // const newbridebrideMiddle = req.body.newbrideMiddle
      // const newbridebrideLast = req.body.newbrideLast

      data.groom[memberFields.ID] = newgroomMemberId
      data.groom[memberFields.PERSON] = newgroomPersonId
      data.bride[memberFields.ID] = newbrideMemberId
      data.bride[memberFields.PERSON] = newbridePersonId

      const coupleId = req.body.coupleId
      const prenupId = req.body.prenupId
      const weddingDate = req.body.weddingDate

      const prenupCond = new Condition(queryTypes.where)
      prenupCond.setKeyValue(db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID, prenupId)

      if (oldbrideMemberId === newbrideMemberId) {
        console.log('oldbrideMemberId === newbrideMemberId')
        // bride retain
        // REMOVAL: set oldgroom's prenup_record_id = null
        const oldgroomPrenupCond = new Condition(queryTypes.where)
        oldgroomPrenupCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, oldgroomMemberId)
        // update prenuptial wedding date
        db.update(db.tables.PRENUPTIAL_TABLE, { date_of_wedding: weddingDate }, prenupCond, function (result) {
          db.update(db.tables.MEMBER_TABLE, { prenup_record_id: null }, oldgroomPrenupCond, function (result) {
            if (result !== null) {
              // set new groom's prenup id
              const newgroomPrenupCond = new Condition(queryTypes.where)
              newgroomPrenupCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, newgroomMemberId)
              db.update(db.tables.MEMBER_TABLE, { prenup_record_id: prenupId }, newgroomPrenupCond, function (result) {
                if (result !== null) {
                  // set the male_id in couples table
                  const coupleCond = new Condition(queryTypes.where)
                  coupleCond.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.ID, coupleId)
                  // set male_id = null
                  db.update(db.tables.COUPLE_TABLE, { male_id: null }, coupleCond, function (result) {
                    if (result !== null) {
                      // set new male_id
                      db.update(db.tables.COUPLE_TABLE, { male_id: newgroomPersonId }, coupleCond, function (result) {
                        req.session.editId = prenupId
                        res.send(true)
                      })
                    }
                  })
                } else {
                  console.log('new groom update prenup_record_id error')
                  res.send(false)
                }
              })
            } else {
              console.log('old groom update prenup_record_id to null error')
              res.send(false)
            }
          })
        })
      } else if (oldgroomMemberId === newgroomMemberId) {
        console.log('oldgroomMemberId === newgroomMemberId')
        // groom retain
        // REMOVAL: set oldbride's prenup_record_id = null
        const oldbridePrenupCond = new Condition(queryTypes.where)
        oldbridePrenupCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, oldbrideMemberId)
        // update prenuptial wedding date
        db.update(db.tables.PRENUPTIAL_TABLE, { date_of_wedding: weddingDate }, prenupCond, function (result) {
          console.log('BEFORE REMOVAL: set oldbride s prenup_record_id = null')
          db.update(db.tables.MEMBER_TABLE, { prenup_record_id: null }, oldbridePrenupCond, function (result) {
            if (result !== null) {
              console.log('oldbrideprenupCond success')
              // set new bride's prenup id
              const newbridePrenupCond = new Condition(queryTypes.where)
              newbridePrenupCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, newbrideMemberId)
              db.update(db.tables.MEMBER_TABLE, { prenup_record_id: prenupId }, newbridePrenupCond, function (result) {
                if (result !== null) {
                  // set the female_id in couples table
                  const coupleCond = new Condition(queryTypes.where)
                  coupleCond.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.ID, coupleId)
                  // set female_id = null
                  db.update(db.tables.COUPLE_TABLE, { female_id: null }, coupleCond, function (result) {
                    if (result !== null) {
                      // set new female_id
                      db.update(db.tables.COUPLE_TABLE, { female_id: newbridePersonId }, coupleCond, function (result) {
                        if (result !== null) {
                          req.session.editId = prenupId
                          res.send(true)
                        } else {
                          console.log('update couple female_id to new female_id error')
                          res.send(false)
                        }
                      })
                    } else {
                      console.log('update couple female_id to new female_id error')
                      res.send(false)
                    }
                  })
                } else {
                  console.log('new groom update prenup_record_id error')
                  res.send(false)
                }
              })
            } else {
              console.log('old groom update prenup_record_id to null error')
              res.send(false)
            }
          })
        })
      } else { // if both bride and groom are really changed in this prenup record
        console.log('editprenupMEMBER ELSE')
        // REMOVAL: set oldbride's prenup_record_id = null and set oldgroom's prenup_record_id = null
        const groomCond = new Condition(queryTypes.where)
        groomCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, oldgroomMemberId)
        // update prenuptial wedding date
        db.update(db.tables.PRENUPTIAL_TABLE, { date_of_wedding: weddingDate }, prenupCond, function (result) {
          // set oldgroom's prenup_record_id = null
          db.update(db.tables.MEMBER_TABLE, { prenup_record_id: null }, groomCond, function (result) {
            if (result !== null) {
              const brideCond = new Condition(queryTypes.where)
              brideCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, oldbrideMemberId)
              // set oldbride's prenup_record_id = null
              db.update(db.tables.MEMBER_TABLE, { prenup_record_id: null }, brideCond, function (result) {
                if (result !== null) {
                  changeBothPartners(data.groom, data.bride, coupleId, prenupId) // refer to uppermost function declaration
                } else {
                  console.log("set oldbride's prenup_record_id = null")
                  res.send(false)
                }
              })
            } else {
              console.log("set oldgroom's prenup_record_id = null error")
              res.send(false)
            }
          })
        })
      } // end of inner else
    } // end of outer else
  },
  /**
   * This function updates a row in the prenuptial table given that
   * both partners are non-members.
   * @param req - the incoming request containing either the query or body.
   *              the request should contain a boolean variable `partner`,
   *              if true indicates the `male` partner will be edited, else
   *              the `female` partner will be edited
   * @param res - the result to be sent out after processing the request
   */
  postUpdatePrenupNonMember: function (req, res) {
    /*
      This function removes the prenup_record_id in the MEMBERS table
      (..SET prenup_record_id = null..)
    */
    function removePrenupIds (oldgroomMemberId, oldbrideMemberId) {
      const cond1 = new Condition(queryTypes.where)
      cond1.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, oldgroomMemberId)
      const cond2 = new Condition(queryTypes.where)
      cond1.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, oldbrideMemberId)

      db.update(db.tables.MEMBER_TABLE, { prenup_record_id: null }, cond1, function (result) {})
      db.update(db.tables.MEMBER_TABLE, { prenup_record_id: null }, cond2, function (result) {})
    }
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
        male: {},
        female: {},
        prenup: {}
      }
      const oldbrideMemberId = req.body.oldbrideMemberId
      const oldgroomMemberId = req.body.oldgroomMemberId
      // remove the oldgroom and oldbride's prenup_record_id
      removePrenupIds(oldgroomMemberId, oldbrideMemberId)

      const coupleId = req.body.coupleId
      const prenupId = req.body.prenupId
      const coupleCond = new Condition(queryTypes.where)
      coupleCond.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.ID, coupleId)

      data.prenup[prenupRecordFields.DATE_OF_WEDDING] = req.body.weddingDate

      data.male[personFields.FIRST_NAME] = req.body.newgroomFirst
      data.male[personFields.MID_NAME] = req.body.newgroomMiddle
      data.male[personFields.LAST_NAME] = req.body.newgroomLast

      data.female[personFields.FIRST_NAME] = req.body.newbrideFirst
      data.female[personFields.MID_NAME] = req.body.newbrideMiddle
      data.female[personFields.LAST_NAME] = req.body.newbrideLast

      const weddingDate = req.body.weddingDate
      const prenupCond = new Condition(queryTypes.where)
      prenupCond.setKeyValue(db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID, prenupId)

      // update prenuptial wedding date
      db.update(db.tables.PRENUPTIAL_TABLE, { date_of_wedding: weddingDate }, prenupCond, function (result) {
        // insert non-member groom to PEOPLE
        db.insert(db.tables.PERSON_TABLE, data.male, function (maleId) {
          console.log('maleId' + maleId)
          if (maleId) {
            // insert non-member bride to PEOPLE
            db.insert(db.tables.PERSON_TABLE, data.female, function (femaleId) {
              console.log('femaleId' + femaleId)
              if (femaleId) {
                // set couple male_id = null
                db.update(db.tables.COUPLE_TABLE, { male_id: null }, coupleCond, function (result) {
                  if (result !== null) {
                    // set couple female_id = null
                    db.update(db.tables.COUPLE_TABLE, { female_id: null }, coupleCond, function (result) {
                      if (result !== null) {
                        // update couple male_id to new male_id
                        db.update(db.tables.COUPLE_TABLE, { male_id: maleId }, coupleCond, function (result) {
                          if (result !== null) {
                            // update couple female_id to new female_id
                            db.update(db.tables.COUPLE_TABLE, { female_id: femaleId }, coupleCond, function (result) {
                              if (result !== null) {
                                res.send(true)
                              } else {
                                console.log('update couple female_id to new female_id')
                                res.send(false)
                              }
                            })
                          } else {
                            console.log('update couple male_id to new male_id error')
                            res.send(false)
                          }
                        })
                      } else {
                        console.log('set couple female_id = null error')
                        res.send(false)
                      }
                    })
                  } else {
                    console.log('set couple male_id = null error')
                    res.send(false)
                  }
                })
              } else {
                console.log('insert non-member bride to PEOPLE error')
                res.send(false)
              }
            })
          } else {
            console.log('insert non-member groom to PEOPLE error')
            res.send(false)
          }
        })
      })
    }
  },
  /**
   * This function updates a row in the prenuptial table given that
   * the bride is a member and the groom is not.
   * @param req - the incoming request containing either the query or body.
   *              the request should contain a boolean variable `partner`,
   *              if true indicates the `male` partner will be edited, else
   *              the `female` partner will be edited
   * @param res - the result to be sent out after processing the request
   */
  postUpdatePrenupBrideMember: function (req, res) {
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
        male: {}
      }
      // old data groom
      const oldgroomMemberId = req.body.oldgroomMemberId
      // const oldgroomPersonId = req.body.oldgroomPersonId // male_id
      // const oldgroomFirst = req.body.oldgroomFirst
      // const oldgroomMiddle = req.body.oldgroomMiddle
      // const oldgroomLast = req.body.oldgroomLast

      // old data bride
      // const oldbrideMemberId = req.body.oldbrideMemberId
      // const oldbridePersonId = req.body.oldbridePersonId // female_id
      // const bridebrideFirst = req.body.oldbrideFirst
      // const bridebrideMiddle = req.body.oldbrideMiddle
      // const bridebrideLast = req.body.oldbrideLast

      // new data groom
      const newgroomFirst = req.body.newgroomFirst
      const newgroomMiddle = req.body.newgroomMiddle
      const newgroomLast = req.body.newgroomLast
      data.male[personFields.FIRST_NAME] = newgroomFirst
      data.male[personFields.MID_NAME] = newgroomMiddle
      data.male[personFields.LAST_NAME] = newgroomLast

      // new data bride
      // const newbrideMemberId = req.body.newbrideMemberId

      const coupleId = req.body.coupleId
      const prenupId = req.body.prenupId
      const weddingDate = req.body.weddingDate

      const prenupCond = new Condition(queryTypes.where)
      prenupCond.setKeyValue(db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID, prenupId)

      // bride retain
      // set oldgroom prenup_record_id = null
      const oldgroomPrenupCond = new Condition(queryTypes.where)
      oldgroomPrenupCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, oldgroomMemberId)
      // update prenuptial wedding date
      db.update(db.tables.PRENUPTIAL_TABLE, { date_of_wedding: weddingDate }, prenupCond, function (result) {
        db.update(db.tables.MEMBER_TABLE, { prenup_record_id: null }, oldgroomPrenupCond, function (result) {
          if (result !== null) {
            // set couple male_id = null
            const coupleCond = new Condition(queryTypes.where)
            coupleCond.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.ID, coupleId)
            db.update(db.tables.COUPLE_TABLE, { male_id: null }, coupleCond, function (result) {
              if (result !== null) {
                // insert non-member groom
                db.insert(db.tables.PERSON_TABLE, data.male, function (maleId) {
                  if (maleId !== null) {
                    // update couple new male_id
                    db.update(db.tables.COUPLE_TABLE, { male_id: maleId }, coupleCond, function (result) {
                      if (result !== null) {
                        res.send(true) // done
                      } else {
                        console.log('update couple new male_id error')
                        res.send(false)
                      }
                    })
                  } else {
                    console.log('insert non-member groom error')
                    res.send(false)
                  }
                })
              } else {
                console.log('update couple male_id = null error')
                res.send(false)
              }
            })
          } else {
            console.log('update oldgroom prenup_record_id = null error')
            res.send(false)
          }
        })
      })
    }
  },
  /**
   * This function updates a row in the prenuptial table given that
   * the groom is a member and the bride is not.
   * @param req - the incoming request containing either the query or body.
   *              the request should contain a boolean variable `partner`,
   *              if true indicates the `male` partner will be edited, else
   *              the `female` partner will be edited
   * @param res - the result to be sent out after processing the request
   */
  postUpdatePrenupGroomMember: function (req, res) {
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
        female: {}
      }
      // old data groom
      // const oldgroomMemberId = req.body.oldgroomMemberId
      // const oldgroomPersonId = req.body.oldgroomPersonId // male_id
      // const oldgroomFirst = req.body.oldgroomFirst
      // const oldgroomMiddle = req.body.oldgroomMiddle
      // const oldgroomLast = req.body.oldgroomLast

      // old data bride
      const oldbrideMemberId = req.body.oldbrideMemberId
      // const oldbridePersonId = req.body.oldbridePersonId // female_id
      // const bridebrideFirst = req.body.oldbrideFirst
      // const bridebrideMiddle = req.body.oldbrideMiddle
      // const bridebrideLast = req.body.oldbrideLast

      // new data bride
      const newbrideFirst = req.body.newbrideFirst
      const newbrideMiddle = req.body.newbrideMiddle
      const newbrideLast = req.body.newbrideLast
      data.female[personFields.FIRST_NAME] = newbrideFirst
      data.female[personFields.MID_NAME] = newbrideMiddle
      data.female[personFields.LAST_NAME] = newbrideLast

      // new data bride
      // const newgroomMemberId = req.body.newgroomMemberId

      const coupleId = req.body.coupleId
      const prenupId = req.body.prenupId
      const weddingDate = req.body.weddingDate
      const prenupCond = new Condition(queryTypes.where)
      prenupCond.setKeyValue(db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID, prenupId)

      // groom retain
      // set oldbride prenup_record_id = null
      const oldbridePrenupCond = new Condition(queryTypes.where)
      oldbridePrenupCond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.ID, oldbrideMemberId)
      // update prenuptial wedding date
      db.update(db.tables.PRENUPTIAL_TABLE, { date_of_wedding: weddingDate }, prenupCond, function (result) {
        db.update(db.tables.MEMBER_TABLE, { prenup_record_id: null }, oldbridePrenupCond, function (result) {
          if (result !== null) {
            // set couple female_id = null
            const coupleCond = new Condition(queryTypes.where)
            coupleCond.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.ID, coupleId)
            db.update(db.tables.COUPLE_TABLE, { female_id: null }, coupleCond, function (result) {
              if (result !== null) {
                // insert non-member bride
                db.insert(db.tables.PERSON_TABLE, data.female, function (femaleId) {
                  if (femaleId !== null) {
                    // update couple new male_id
                    db.update(db.tables.COUPLE_TABLE, { female_id: femaleId }, coupleCond, function (result) {
                      if (result !== null) {
                        res.send(true) // done
                      } else {
                        console.log('update couple new female_id error')
                        res.send(false)
                      }
                    })
                  } else {
                    console.log('insert non-member bride error')
                    res.send(false)
                  }
                })
              } else {
                console.log('update couple female_id = null error')
                res.send(false)
              }
            })
          } else {
            console.log('update oldbride prenup_record_id = null error')
            res.send(false)
          }
        })
      })
    }
  },
  /**
   * This function deletes a row in the prenuptial table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  deletePrenup: function (req, res) {
    const condition = req.query.condition

    db.delete(db.tables.PRENUPTIAL_TABLE, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  }
}

module.exports = prenupController
