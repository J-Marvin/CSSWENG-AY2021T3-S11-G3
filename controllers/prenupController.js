const db = require('../models/db')
const personFields = require('../models/person')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/couple')
const { Condition, queryTypes } = require('../models/condition')
const { validationResult } = require('express-validator')
const memberFields = require('../models/members')
const { sendError } = require('./errorController')
const { updateMemberToMember, updateMemberToNonMember, updateNonMemberToMember, updateNonMemberToNonMember } = require('./updateController')

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
        db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.COUPLE + ' as coupleId',
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
          data.canSee = parseInt(req.session.editId) === parseInt(prenupId) || parseInt(req.session.level) >= 2
          data.styles = ['view']
          data.scripts = ['deletePrenup']
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
  getAddPrenup: function (req, res) {
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
          // find all groom members
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
            if (result !== null) {
              groomNames = result
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
                      req.session.editId = result[0]
                      res.redirect('/view_prenup/' + result[0])
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
      console.log(prenupId)
      const data = {
        scripts: ['editPrenup', 'edit'],
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
          db.find(db.tables.PRENUPTIAL_TABLE, cond, joinTables2, '*', function (result) {
            if (result !== null) {
              data.bride = result[0]

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
                    if (result !== null) {
                      groomNames = result
                      data.groomNames = groomNames
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
      sendError(req, res, 401)
    }
  },
  /**
   * This function will update the bride
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  putUpdatePrenupBride: function (req, res) {
    const isOldMember = req.body.isOldMember === 'true'
    const person = JSON.parse(req.body.person)
    const isNewMember = person.isMember
    const prenupRecId = req.body.recordId
    const coupleId = req.body.coupleId
    const oldPersonId = req.body.oldPersonId

    const ids = {
      oldPersonId: oldPersonId,
      newPersonId: person.personId,
      recordId: coupleId,
      updateRecordId: prenupRecId
    }
    const fields = {
      recordId: coupleFields.ID,
      memberRecordField: memberFields.PRENUP_RECORD,
      recordPersonField: coupleFields.FEMALE
    }
    if (isOldMember && isNewMember) { // member to member
      updateMemberToMember(ids, fields, db.tables.COUPLE_TABLE, sendReply)
    } else if (isOldMember && !isNewMember) { // member to non-member
      updateMemberToNonMember(person, ids, fields, db.tables.COUPLE_TABLE, sendReply)
    } else if (!isOldMember && isNewMember) { // non-member to member
      updateNonMemberToMember(ids, fields, db.tables.COUPLE_TABLE, sendReply)
    } else {
      person.personId = ids.oldPersonId
      updateNonMemberToNonMember(person, sendReply)
    }

    function sendReply (result) {
      if (result) {
        res.send(JSON.stringify(result))
      } else {
        res.send(false)
      }
    }
  },
  /**
   * This function will update the groom
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  putUpdatePrenupGroom: function (req, res) {
    const isOldMember = req.body.isOldMember === 'true'
    const person = JSON.parse(req.body.person)
    const isNewMember = person.isMember
    const prenupRecId = req.body.recordId
    const coupleId = req.body.coupleId
    const oldPersonId = req.body.oldPersonId

    const ids = {
      oldPersonId: oldPersonId,
      newPersonId: person.personId,
      recordId: coupleId,
      updateRecordId: prenupRecId
    }
    const fields = {
      recordId: coupleFields.ID,
      memberRecordField: memberFields.PRENUP_RECORD,
      recordPersonField: coupleFields.MALE
    }
    if (isOldMember && isNewMember) { // member to member
      updateMemberToMember(ids, fields, db.tables.COUPLE_TABLE, sendReply)
    } else if (isOldMember && !isNewMember) { // member to non-member
      updateMemberToNonMember(person, ids, fields, db.tables.COUPLE_TABLE, sendReply)
    } else if (!isOldMember && isNewMember) { // non-member to member
      updateNonMemberToMember(ids, fields, db.tables.COUPLE_TABLE, sendReply)
    } else {
      person.personId = ids.oldPersonId
      updateNonMemberToNonMember(person, sendReply)
    }

    function sendReply (result) {
      if (result) {
        res.send(JSON.stringify(result))
      } else {
        res.send(false)
      }
    }
  },
  /**
   * This function will update the prenup date
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  putUpdatePrenupDate: function (req, res) {
    const newWeddingDate = req.body.newWeddingDate
    const prenupId = req.body.prenupId
    const cond = new Condition(queryTypes.where)
    cond.setKeyValue(db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID, prenupId)

    db.update(db.tables.PRENUPTIAL_TABLE, { date_of_wedding: newWeddingDate }, cond, function (result) {
      if (result !== null) {
        res.send(true)
      }
    })
  },
  /**
   * This function deletes a row in the prenuptial table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  deletePrenup: function (req, res) {
    const nonMembers = JSON.parse(req.body.nonMembers)
    const couples = JSON.parse(req.body.couples)
    const recordId = req.body.recordId

    const nonMembersCond = new Condition(queryTypes.whereIn)
    nonMembersCond.setArray(personFields.ID, nonMembers)

    const couplesCond = new Condition(queryTypes.whereIn)
    couplesCond.setArray(coupleFields.ID, couples)

    const recordCond = new Condition(queryTypes.where)
    recordCond.setKeyValue(prenupRecordFields.ID, recordId)

    db.delete(db.tables.COUPLE_TABLE, couplesCond, function (result) {
      if (result) {
        db.delete(db.tables.PERSON_TABLE, nonMembersCond, function (result) {
          if (nonMembers.length === 0 || result) {
            db.delete(db.tables.PRENUPTIAL_TABLE, recordCond, function (result) {
              if (result || result === 0) {
                res.send(true)
              } else {
                res.send(false)
              }
            })
          } else {
            res.send(false)
          }
        })
      } else {
        res.send(false)
      }
    })
  }
}

module.exports = prenupController
