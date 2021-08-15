const db = require('../models/db')
const coupleFields = require('../models/couple')
const personFields = require('../models/person')
const witnessFields = require('../models/witness')
const memberFields = require('../models/members')
const infDedFields = require('../models/infantDedication')
const { Condition, queryTypes } = require('../models/condition')

const dedicationController = {
  /**
   * This function gets the dedication page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getDedicationPage: function (req, res) {
    res.send('Temp')
  },
  /**
   * This function renders the add dedication page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getAddDedicationPage: function (req, res) {
    if (req.session.level === null || req.session.level === undefined) {
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        },
        backLink: '/forms_main_page'
      })
    } else {
      const join = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      db.find(db.tables.MEMBER_TABLE, [], join, '*', function (result) {
        if (result) {
          const data = {}
          data.members = result
          data.styles = ['forms']
          data.scripts = ['addDedication']
          data.backLink = parseInt(req.session.level) >= 2 ? '/dedication_main_page' : '/forms_main_page'
          res.render('add-child-dedication', data)
        }
      })
    }
  },

  /**
   * This function renders the view of a specific child dedication record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getViewDedication: function (req, res) {
    /*
      This local function renders the error page
    */
    function sendError (title, code) {
      const msg = title
      res.status(code)
      res.render('error', {
        title: title,
        css: ['global', 'error'],
        status: {
          code: parseInt(code),
          message: msg
        },
        backLink: '/main_page'
      })
    }
    // function execution starts here
    // joinTables and columns INDICES
    const TABLE_PARENT1 = 0
    const TABLE_PARENT2 = 1
    const TABLE_WITNESSES = 2
    const COL_INF = 0
    const COL_PARENT1 = 1
    const COL_PARENT2 = 2
    const COL_WITNESSES = 3
    // read dedicationId from params
    const dedicationId = parseInt(req.params.dedication_id)
    console.log(dedicationId)
    if (parseInt(req.session.level) >= 2 || req.session.editId === dedicationId) {
      let data = {}
      /*
        infant_dedication tables needed: inf_dedication, couple, people
        SQL:
        SELECT *
        FROM inf_dedication
        JOIN couples ON couples.couple_id = inf_dedication.parents_id
        JOIN people ON people.person_id = inf_dedication.person_id
        WHERE inf_dedication.dedication_id = <dedication_id>;
      */
      const joinTables = [
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID,
          destCol: db.tables.INFANT_TABLE + '.' + infDedFields.PARENTS
        },
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.PERSON_TABLE + '.' + personFields.ID,
          destCol: db.tables.INFANT_TABLE + '.' + infDedFields.PERSON
        }
      ]
      const cond1 = new Condition(queryTypes.where)
      cond1.setKeyValue(db.tables.INFANT_TABLE + '.' + infDedFields.ID, dedicationId)
      const joinTables2 = [
        // parent1, index TABLE_PARENT1 = 0
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        },
        // parent2, index TABLE_PARENT2 = 1
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        },
        // witness, index TABLE_WITNESSES = 2
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.WITNESS_TABLE + '.' + witnessFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      // All the fields needed here
      const columns = [
        // infant dedication table, index COL_INF = 0
        [
          db.tables.INFANT_TABLE + '.' + infDedFields.ID + ' as dedication_id',
          db.tables.INFANT_TABLE + '.' + infDedFields.PERSON + ' as infant_person_id',
          db.tables.INFANT_TABLE + '.' + infDedFields.PARENTS + ' as parents_id',
          db.tables.INFANT_TABLE + '.' + infDedFields.DATE + ' as date',
          db.tables.INFANT_TABLE + '.' + infDedFields.PLACE + ' as place',
          db.tables.INFANT_TABLE + '.' + infDedFields.OFFICIANT + ' as officiant',
          db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE + ' as guardianOne_person_id',
          db.tables.COUPLE_TABLE + '.' + coupleFields.MALE + ' as guardianTwo_person_id',
          db.tables.PERSON_TABLE + '.' + personFields.MEMBER + ' as infant_member_id',
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as infant_first_name',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as infant_middle_name',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as infant_last_name'
        ],
        // getting the mother's name (parent1), index COL_PARENT1 = 1
        [
          db.tables.PERSON_TABLE + '.' + personFields.MEMBER + ' as guardianOne_member_id',
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as guardianOne_first_name',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as guardianOne_mid_name',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as guardianOne_last_name'
        ],
        // getting the father's name (parent2), index COL_PARENT2 = 2
        [
          db.tables.PERSON_TABLE + '.' + personFields.MEMBER + ' as guardianTwo_member_id',
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as guardianTwo_first_name',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as guardianTwo_mid_name',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as guardianTwo_last_name'
        ],
        // getting the witness, index COL_WITNESSES = 3
        [
          db.tables.WITNESS_TABLE + '.' + witnessFields.DEDICATION + ' as dedication_id',
          db.tables.WITNESS_TABLE + '.' + witnessFields.PERSON + ' as witness_person_id',
          db.tables.WITNESS_TABLE + '.' + witnessFields.ID + ' as witness_id',
          db.tables.PERSON_TABLE + '.' + personFields.MEMBER + ' as witness_member_id',
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as witness_first_name',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as witness_middle_name',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as witness_last_name'
        ]
      ]
      const condWitness = new Condition(queryTypes.where)
      condWitness.setKeyValue(db.tables.WITNESS_TABLE + '.' + witnessFields.DEDICATION, dedicationId)
      db.find(db.tables.INFANT_TABLE, cond1, joinTables, columns[COL_INF], function (result) {
        if (result.length > 0) {
          data = {
            // spread syntax
            ...result[0]
          }
          // get father and mother's name
          const parent1Id = data.guardianOne_person_id // saved in couples.female_id
          const parent2Id = data.guardianTwo_person_id // saved in couples.male_id
          console.log('parent1Id = ' + parent1Id)
          console.log('parent2Id = ' + parent2Id)
          // if single parent
          if (parent2Id === null || parent2Id === undefined) {
            const condParent1 = new Condition(queryTypes.where)
            condParent1.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE, parent1Id)

            // get only parent1
            db.find(db.tables.COUPLE_TABLE, condParent1, joinTables2[TABLE_PARENT1], columns[COL_PARENT1], function (parent1) {
              if (parent1.length > 0) {
                data.guardianOne_first_name = parent1[0].guardianOne_first_name
                data.guardianOne_mid_name = parent1[0].guardianOne_mid_name
                data.guardianOne_last_name = parent1[0].guardianOne_last_name
                data.guardianOne_member_id = parent1[0].guardianOne_member_id

                // get witnesses
                db.find(db.tables.WITNESS_TABLE, condWitness, joinTables2[TABLE_WITNESSES], columns[COL_WITNESSES], function (result) {
                  if (result.length > 0) {
                    data.witnesses = result
                    // canSee is set to the edit button
                    data.canSee = (parseInt(req.session.dedicationId) === parseInt(dedicationId)) || (parseInt(req.session.level) >= 2)
                    if ((parseInt(req.session.level) <= 2)) {
                      data.canSee = false
                    }
                    data.styles = ['view']
                    // data.scripts = ['']
                    data.backLink = parseInt(req.session.level) >= 2 ? '/dedication_main_page' : '/forms_main_page'
                    console.log(data)
                    res.render('view-dedication', data)
                  } else {
                    sendError('404 Witnesses Record Not Found', 404)
                  }
                })
              } else {
                sendError('404 Parent 1 Record Not Found', 404)
              }
            })
          // end of if-block
          } else { // if 2 parents/guardian is in the record
            const condParent1 = new Condition(queryTypes.where)
            condParent1.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE, parent1Id)
            const condParent2 = new Condition(queryTypes.where)
            condParent2.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.MALE, parent2Id)

            // get parent1
            db.find(db.tables.COUPLE_TABLE, condParent1, joinTables2[TABLE_PARENT1], columns[COL_PARENT1], function (parent1) {
              if (parent1.length > 0) {
                data.guardianOne_first_name = parent1[0].guardianOne_first_name
                data.guardianOne_mid_name = parent1[0].guardianOne_mid_name
                data.guardianOne_last_name = parent1[0].guardianOne_last_name
                data.guardianOne_member_id = parent1[0].guardianOne_member_id

                // get parent2
                db.find(db.tables.COUPLE_TABLE, condParent2, joinTables2[TABLE_PARENT2], columns[COL_PARENT2], function (parent2) {
                  if (parent2.length > 0) {
                    data.guardianTwo_first_name = parent2[0].guardianTwo_first_name
                    data.guardianTwo_mid_name = parent2[0].guardianTwo_mid_name
                    data.guardianTwo_last_name = parent2[0].guardianTwo_last_name
                    data.guardianTwo_member_id = parent2[0].guardianTwo_member_id

                    // get witnesses
                    db.find(db.tables.WITNESS_TABLE, condWitness, joinTables2[TABLE_WITNESSES], columns[COL_WITNESSES], function (result) {
                      if (result.length > 0) {
                        data.witnesses = result
                        // canSee is set to the edit button
                        data.canSee = (parseInt(req.session.dedicationId) === parseInt(dedicationId)) || (parseInt(req.session.level) >= 2)
                        if ((parseInt(req.session.level) <= 2)) {
                          data.canSee = false
                        }
                        data.styles = ['view']
                        // data.scripts = ['']
                        data.backLink = parseInt(req.session.level) >= 2 ? '/dedication_main_page' : '/forms_main_page'
                        res.render('view-dedication', data) // render data
                      } else {
                        sendError('404 Witnesses Record Not Found', 404)
                      }
                    })
                  } else {
                    sendError('404 Parent 2 Record Not Found', 404)
                  }
                })
              } else {
                sendError('404 Parent 1 Record Not Found', 404)
              }
            })
          } // end of else block
        } else {
          sendError('404 Record Not Found at Child Dedication Table', 404)
        }
      })
    } else {
      sendError('401 Unauthorized Access', 401)
    }
  },
  /**
   * This function adds a child dedication record to the database
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  postAddDedication: function (req, res) {
    // The Data to be inserted to Infant Dedication Table
    const data = {}

    // The information of the guardians and child
    const people = {
      guardian1: {},
      guardian2: {},
      child: {}
    }

    // The information of the couple to be inserted in the Couple Table
    const couple = {}

    // Store officiant, date and place to data
    data[infDedFields.OFFICIANT] = req.body.officiant
    data[infDedFields.DATE] = new Date().toISOString()
    data[infDedFields.PLACE] = req.body.place

    /* req.body.guardian1 fields:
       personId
       isMember
       first_name
       mid_name
       last_name

       as JSON String
       NOTE: If isMember is true, personId should not be null
     */
    people.guardian1 = JSON.parse(req.body.guardian1)

    // If second guardian is available`
    if (req.body.guardian2 === null || req.body.guardian2 === undefined || req.body.guardian2 === '') {
      people.guardian2 = null
    } else {
      people.guardian2 = JSON.parse(req.body.guardian2)
    }
    people.child = JSON.parse(req.body.child)
    people.witnesses = JSON.parse(req.body.witnesses)

    // people to be inserted in the people table
    const peopleInfo = []
    const offsets = {
      guardian1: 0,
      guardian2: 0,
      child: 0
    }
    // If first guardian is not a member
    if (!people.guardian1.isMember) {
      const guardian = {}
      guardian[personFields.FIRST_NAME] = people.guardian1.first_name
      guardian[personFields.MID_NAME] = people.guardian1.mid_name
      guardian[personFields.LAST_NAME] = people.guardian1.last_name
      peopleInfo.push(guardian)
    } else {
      couple[coupleFields.FEMALE] = people.guardian1.person_id
    }

    // If there is a second guardian and is not a member
    if (people.guardian2 !== null && !people.guardian2.isMember) {
      const guardian = {}
      guardian[personFields.FIRST_NAME] = people.guardian2.first_name
      guardian[personFields.MID_NAME] = people.guardian2.mid_name
      guardian[personFields.LAST_NAME] = people.guardian2.last_name
      peopleInfo.push(guardian)
      offsets.guardian1 = offsets.guardian1 + 1
    } else if (people.guardian2 !== null) {
      couple[coupleFields.MALE] = people.guardian2.person_id
    }

    if (!people.child.isMember) {
      const child = {}

      child[personFields.FIRST_NAME] = people.child.first_name
      child[personFields.MID_NAME] = people.child.mid_name
      child[personFields.LAST_NAME] = people.child.last_name
      peopleInfo.push(child)
      offsets.guardian1 = offsets.guardian1 + 1
      offsets.guardian2 = offsets.guardian2 + 1
    } else {
      data[infDedFields.PERSON] = people.child.person_id
    }

    // Insert people (not including witnesses)
    db.insert(db.tables.PERSON_TABLE, peopleInfo, function (result) {
      if (result) {
        if (result.length > 0) {
          if (people.child.person_id === null || people.child.person_id === undefined) {
            data[infDedFields.PERSON] = result[0] - offsets.child
          }
          if (people.guardian1.person_id === null || people.guardian1.person_id === undefined) {
            couple[coupleFields.FEMALE] = result[0] - offsets.guardian1
          }
          if (people.guardian2 !== null && (people.guardian2.person_id === null || people.guardian2.person_id === undefined)) {
            couple[coupleFields.MALE] = result[0] - offsets.guardian2
          }
        }

        // Insert guardians/parents to couple table
        db.insert(db.tables.COUPLE_TABLE, couple, function (result) {
          if (result) {
            data[infDedFields.PARENTS] = result[0]

            // Insert Acutal Dedication to table
            db.insert(db.tables.INFANT_TABLE, data, function (result) {
              if (result) {
                if (people.witnesses.length > 0) {
                  const dedicationId = result[0]

                  const witnessInfo = []
                  const witnesses = []

                  people.witnesses.forEach(function (witness) {
                    const currWitness = {}

                    // For every membmer witness, add to currWitnesses
                    if (witness.isMember) {
                      currWitness[witnessFields.DEDICATION] = dedicationId
                      currWitness[witnessFields.PERSON] = witness.person_id
                      witnesses.push(currWitness)
                    } else { // For every non-member witness, add to witnessInfo to insert to people table
                      currWitness[personFields.FIRST_NAME] = witness.first_name
                      currWitness[personFields.MID_NAME] = witness.mid_name
                      currWitness[personFields.LAST_NAME] = witness.last_name

                      witnessInfo.push(currWitness)
                    }
                  })

                  // Insert to Non-Member witnesses
                  db.insert(db.tables.PERSON_TABLE, witnessInfo, function (result) {
                    if (result) {
                      result = result[0]

                      // Concatenate all member witnesses with just inserted witnesses
                      const allWitnesses = witnesses.concat(witnessInfo.map(function (witness) {
                        const witnessInfo = {}
                        witnessInfo[witnessFields.DEDICATION] = dedicationId
                        witnessInfo[witnessFields.PERSON] = result
                        result -= 1

                        return witnessInfo
                      }))

                      // Insert to witness table
                      db.insert(db.tables.WITNESS_TABLE, allWitnesses, function (result) {
                        if (result) {
                          req.session.editId = dedicationId
                          res.send(JSON.stringify(dedicationId))
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

module.exports = dedicationController
