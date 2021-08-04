const db = require('../models/db')
const personFields = require('../models/person')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/couple')
const { Condition, queryTypes } = require('../models/condition')
const { validationResult } = require('express-validator')
const memberFields = require('../models/members')

const prenupController = {
  /**
   * This function inserts a new row (non-member) in the prenuptial table
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
              res.render('add-prenup-temp', {
                scripts: ['addPrenup'],
                styles: ['forms'],
                Origin: 'coming from edit member',
                brideNames: brideNames,
                groomNames: groomNames
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
              res.render('add-prenup-temp', {
                scripts: ['addPrenup'],
                styles: ['forms'],
                Origin: 'coming from edit member',
                brideNames: brideNames,
                groomNames: groomNames
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
      cond2.setField(db.members.PRENUP_RECORD)
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
          cond4.setField(db.members.PRENUP_RECORD)

          // get all male members
          db.find(db.tables.MEMBER_TABLE, [cond3, cond4], joinTables1, '*', function (result) {
            // console.log(result)
            if (result !== null) {
              groomNames = result
              groomNames.unshift({}) // add a blank spot in the first index
              console.log(groomNames)
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
                      // render the success page along with the newly added prenup record
                      res.render('prenup-success', {
                        brideFirst: data.female[personFields.FIRST_NAME],
                        brideMid: data.female[personFields.MID_NAME],
                        brideLast: data.female[personFields.LAST_NAME],
                        groomFirst: data.male[personFields.FIRST_NAME],
                        groomMid: data.male[personFields.MID_NAME],
                        groomLast: data.male[personFields.LAST_NAME],
                        currentDate: data.prenup[prenupRecordFields.DATE],
                        weddingDate: data.prenup[prenupRecordFields.DATE_OF_WEDDING]
                      })
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
                      // render the success page along with the newly added prenup record
                      res.render('prenup-success', data.result)
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
                memberCondition.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.PRENUP_RECORD, groomMemberId)
                db.update(db.tables.MEMBER_TABLE, { prenup_record_id: prenupRecId }, memberCondition, function (result) {
                  if (result !== null) {
                    // render the success page along with the newly added prenup record
                    res.render('prenup-success', {
                      brideFirst: brideFirst,
                      brideMid: brideMid,
                      brideLast: brideLast,
                      groomFirst: groomFirst,
                      groomMid: groomMid,
                      groomLast: groomLast,
                      currentDate: date,
                      weddingDate: weddingDate
                    })
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
                    // render the success page along with the newly added prenup record
                    res.render('prenup-success', {
                      brideFirst: brideFirst,
                      brideMid: brideMid,
                      brideLast: brideLast,
                      groomFirst: groomFirst,
                      groomMid: groomMid,
                      groomLast: groomLast,
                      currentDate: date,
                      weddingDate: weddingDate
                    })
                  } else {
                    res.send('UPDATE PRENUP ERROR')
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

  getEditPrenup: function (req, res) {
    let joinTables = []
    // boolean variable indicating which partner, male or female
    const partner = req.query.partner
    // if male
    if (partner === true) {
      joinTables = [
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
    // else if female
    } else {
      joinTables = [
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
    }
    const conditions = []
    const c = new Condition(queryTypes.where)
    c.setQueryObject({
      record_id: req.query.id
    })

    conditions.push(c)
    /*
    This is equivalent to
      SELECT *
      FROM pre_nuptial
      JOIN couples ON couples.couple_id = pre_nuptial.couple_id
      JOIN people ON people.person_id = couples.male_id
      WHERE record_id = <integer id>;
    */
    db.find(db.tables.PRENUPTIAL_TABLE, conditions, joinTables, '*', function (result) {
      if (result !== false) {
        console.log(result)
        // res.send(result)
        // res.render('', result)
      } else {
        console.log('FIND ERROR')
        res.render('error')
      }
    })
  },
  /**
   * This function updates a row in the prenuptial table
   * @param req - the incoming request containing either the query or body.
   *              the request should contain a boolean variable `partner`,
   *              if true indicates the `male` partner will be edited, else
   *              the `female` partner will be edited
   * @param res - the result to be sent out after processing the request
   */
  updatePrenup: function (req, res) {
    const data = req.query.data
    const condition = req.query.condition
    db.update(db.tables.PRENUPTIAL_TABLE, data, condition, function (result) {
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

    db.delete(db.tables.PRENUPTIAL_TABLE, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  }
}

module.exports = prenupController
