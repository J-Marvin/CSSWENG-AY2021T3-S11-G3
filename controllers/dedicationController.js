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

  getAddDedicationPage: function (req, res) {
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
        res.render('add-child-dedication', data)
      }
    })
  },

  /**
   * This function renders the view of a specific child dedication record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getViewDedication: function (req, res) {
    const dedicationId = req.params.dedication_id
    console.log(dedicationId)
    if ((parseInt(req.session.level) >= 2) || (parseInt(req.session.dedicationId)) === dedicationId) {
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
        // father
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        },
        // mother
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      // All the fields needed here
      const columns = [
        // infant dedication table
        [
          db.tables.INFANT_TABLE + '.' + infDedFields.ID + ' as dedicationId',
          db.tables.INFANT_TABLE + '.' + infDedFields.PERSON + ' as personId',
          db.tables.INFANT_TABLE + '.' + infDedFields.PARENTS + ' as parentsId',
          db.tables.INFANT_TABLE + '.' + infDedFields.DATE + ' as date',
          db.tables.INFANT_TABLE + '.' + infDedFields.PLACE + ' as place',
          db.tables.INFANT_TABLE + '.' + infDedFields.OFFICIANT + ' as officiant',
          db.tables.COUPLE_TABLE + '.' + coupleFields.MALE + ' as dadId',
          db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE + ' as momId',
          db.tables.PERSON_TABLE + '.' + personFields.MEMBER + ' as memberId',
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as firstName',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as middleName',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as lastName'
        ],
        // getting the father's name
        [
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as dadFirst',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as dadMid',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as dadLast'
        ],
        // getting the mother's name
        [
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as momFirst',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as momMid',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as momLast'
        ]
      ]
      db.find(db.tables.INFANT_TABLE, cond1, joinTables, columns[0], function (result) {
        if (result.length > 0) {
          data = {
            // spread syntax
            ...result[0]
          }
          // get father and mother's name
          const dadId = data.dadId
          const momId = data.momId
          const condFather = new Condition(queryTypes.where)
          condFather.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.MALE, dadId)
          const condMother = new Condition(queryTypes.where)
          condMother.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE, momId)
          // get dad
          db.find(db.tables.COUPLE_TABLE, condFather, joinTables2[0], columns[1], function (result) {
            if (result.length > 0) {
              data.dadFirst = result[0].dadFirst
              data.dadMid = result[0].dadMid
              data.dadLast = result[0].dadLast
              // get mom
              db.find(db.tables.COUPLE_TABLE, condMother, joinTables2[1], columns[2], function (result) {
                if (result.length > 0) {
                  data.momFirst = result[0].momFirst
                  data.momMid = result[0].momMid
                  data.momLast = result[0].momLast
                  // canSee is set to the edit button
                  data.canSee = (parseInt(req.session.dedicationId) === parseInt(dedicationId)) || (parseInt(req.session.level) >= 2)
                  if ((parseInt(req.session.level) <= 2)) {
                    data.canSee = false
                  }
                  data.styles = ['view']
                  data.backLink = parseInt(req.session.level) >= 2 ? '/forms_main_page' : '/main_page'
                  res.render('view-dedication', data)
                  // res.send(data)
                }
              })
            }
          })
        } else {
          res.status(401)
          res.render('error', {
            title: '404 Record Not Found',
            css: ['global', 'error'],
            status: {
              code: '401',
              message: 'Record Not Found'
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
    if (req.body.guardian2 === null || req.body.guardian2 === undefined) {
      people.guardian2 = null
    } else {
      people.guardian2 = JSON.parse(req.body.guardian2)
    }
    people.child = JSON.parse(req.body.child)
    console.log(people.child)
    people.witnesses = req.body.witnesses

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
    } else {
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
    console.log(peopleInfo)
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
            data[infDedFields.PARENTS] = result

            console.log(data)

            db.insert(db.tables.INFANT_TABLE, data, function (result) {
              if (result) {
                console.log(people.witnesses)
                if (people.witnesses !== null && people.witness !== undefined) {
                  if (people.witnesses.length === 0) {
                    const dedicationId = result
                    db.insert(db.tables.PEOPLE_TABLE, people.witnesses, function (result) {
                      if (result) {
                        result = result[0]

                        const witnesses = people.witnesses.map(function (witness) {
                          const witnessInfo = {}
                          witnessInfo[witnessFields.DEDICATION] = dedicationId
                          witnessInfo[witnessFields.PERSON] = result
                          result -= 1

                          return witnessInfo
                        })

                        db.insert(db.tables.WITNESS_TABLE, witnesses, function (result) {
                          if (result) {
                            res.send(result)
                          } else {
                            res.send('WITNESS TABLE ERROR')
                          }
                        })
                      } else {
                        res.send('ERROR WITNESS PEOPLE')
                      }
                    })
                  }
                } else {
                  res.send(true)
                }
              } else {
                res.send('INFANT ERROR')
              }
            })
          } else {
            res.send('INSERT COUPLE ERROR')
          }
        })
      } else {
        console.log(result)
        res.send('INSERT PEOPLE ERROR')
      }
    })
  }
}

module.exports = dedicationController
