const db = require('../models/db')
const coupleFields = require('../models/couple')
const personFields = require('../models/person')
const witnessFields = require('../models/witness')
const memberFields = require('../models/members')
const infDedFields = require('../models/infantDedication')
const { Condition, queryTypes } = require('../models/condition')

const dedicationController = {
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
          data.males = data.members.filter((element) => { return element[memberFields.SEX] === 'Male' })
          data.females = data.members.filter((element) => { return element[memberFields.SEX] === 'Female' })
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
    const dedicationId = parseInt(req.params.dedication_id)
    if (parseInt(req.session.level) >= 2 || req.session.editId === dedicationId) {
      const cond1 = new Condition(queryTypes.where)
      cond1.setKeyValue(db.tables.INFANT_TABLE + '.' + infDedFields.ID, dedicationId)
      const witnessCond = new Condition(queryTypes.where)
      witnessCond.setKeyValue(db.tables.WITNESS_TABLE + '.' + witnessFields.DEDICATION, dedicationId)

      /* Similar to
        FROM inf_dedication
        JOIN people AS child ON child.person_id=inf_dedication.dedication_id
        JOIN couples ON couples.couple_id = inf_dedication.parents_id
        JOIN people AS parent1 ON parent1.person_id=couples.female_id
        LEFT JOIN peopl AS parent2 ON parent2.person_id=couples.male_id
      */
      // Original Table is Child Dedication Table
      const joinTables = [
        // Join to Person Table as child to get child info
        {
          tableName: { child: db.tables.PERSON_TABLE },
          sourceCol: db.tables.INFANT_TABLE + '.' + infDedFields.PERSON,
          destCol: 'child.' + personFields.ID
        },
        // Join to Couple Table
        {
          tableName: db.tables.COUPLE_TABLE,
          sourceCol: db.tables.INFANT_TABLE + '.' + infDedFields.PARENTS,
          destCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID
        },
        // Join to Person Tables as parent1 to get first parent/guardian
        {
          tableName: { parent1: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: 'parent1.' + personFields.ID
        },
        // Left Join to Person Tables as parent2 to get second/guardian
        {
          type: 'leftJoin',
          tableName: { parent2: db.tables.PERSON_TABLE },
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: 'parent2.' + personFields.ID
        }
      ]

      const columns = [
        db.tables.INFANT_TABLE + '.' + infDedFields.ID + ' as dedication_id',
        db.tables.INFANT_TABLE + '.' + infDedFields.PERSON + ' as infant_person_id',
        db.tables.INFANT_TABLE + '.' + infDedFields.PARENTS + ' as parents_id',
        db.tables.INFANT_TABLE + '.' + infDedFields.DATE + ' as date',
        db.tables.INFANT_TABLE + '.' + infDedFields.DEDICATION_DATE + ' as dedication_date',
        db.tables.INFANT_TABLE + '.' + infDedFields.PLACE + ' as place',
        db.tables.INFANT_TABLE + '.' + infDedFields.OFFICIANT + ' as officiant',
        'parent1.' + personFields.ID + ' as guardianOne_person_id',
        'parent1.' + personFields.MEMBER + ' as guardianOne_member_id',
        'parent1.' + personFields.FIRST_NAME + ' as guardianOne_first_name',
        'parent1.' + personFields.MID_NAME + ' as guardianOne_mid_name',
        'parent1.' + personFields.LAST_NAME + ' as guardianOne_last_name',
        'parent2.' + personFields.ID + ' as guardianTwo_person_id',
        'parent2.' + personFields.MEMBER + ' as guardianTwo_member_id',
        'parent2.' + personFields.FIRST_NAME + ' as guardianTwo_first_name',
        'parent2.' + personFields.MID_NAME + ' as guardianTwo_mid_name',
        'parent2.' + personFields.LAST_NAME + ' as guardianTwo_last_name',
        'child.' + personFields.MEMBER + ' as infant_member_id',
        'child.' + personFields.FIRST_NAME + ' as infant_first_name',
        'child.' + personFields.MID_NAME + ' as infant_middle_name',
        'child.' + personFields.LAST_NAME + ' as infant_last_name'
      ]

      const witnessJoin = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.WITNESS_TABLE + '.' + witnessFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      const witnessColumns = [
        db.tables.WITNESS_TABLE + '.' + witnessFields.DEDICATION + ' as dedication_id',
        db.tables.WITNESS_TABLE + '.' + witnessFields.PERSON + ' as witness_person_id',
        db.tables.WITNESS_TABLE + '.' + witnessFields.ID + ' as witness_id',
        db.tables.PERSON_TABLE + '.' + personFields.MEMBER + ' as witness_member_id',
        db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as witness_first_name',
        db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as witness_mid_name',
        db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as witness_last_name',
        db.tables.WITNESS_TABLE + '.' + witnessFields.TYPE + ' as type'
      ]

      db.find(db.tables.INFANT_TABLE, [cond1], joinTables, columns, function (result) {
        if (result) {
          const data = {
            ...result[0]
          }
          data.canSee = (parseInt(req.session.dedicationId) === parseInt(dedicationId)) || (parseInt(req.session.level) >= 2)
          if ((parseInt(req.session.level) <= 2)) {
            data.canSee = false
          }
          data.styles = ['view']
          // data.scripts = ['']
          data.backLink = parseInt(req.session.level) >= 2 ? '/dedication_main_page' : '/forms_main_page'
          db.find(db.tables.WITNESS_TABLE, witnessCond, witnessJoin, witnessColumns, function (result) {
            if (result) {
              data.witnesses = result
              // Filters all Godfathers
              data.witnessMale = data.witnesses.filter((witness) => { return witness.type === 'Godfather' })
              // Filters all Godmothers
              data.witnessFemale = data.witnesses.filter((witness) => { return witness.type === 'Godmother' })
              console.log(data)
              res.render('view-dedication', data)
            }
          })
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
    data[infDedFields.DEDICATION_DATE] = req.body.date

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
    // people.witnesses = JSON.parse(req.body.witnesses)
    people.witnessMale = JSON.parse(req.body.witnessMale)
    people.witnessFemale = JSON.parse(req.body.witnessFemale)

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
                if (people.witnessFemale.length + people.witnessMale.length > 0) {
                  const dedicationId = result[0]

                  const witnessMaleInfo = []
                  const witnessFemaleInfo = []
                  const witnesses = []

                  people.witnessMale.forEach(function (witness) {
                    const currWitness = {}
                    if (witness.isMember) {
                      currWitness[witnessFields.TYPE] = 'Godfather'
                      currWitness[witnessFields.DEDICATION] = dedicationId
                      currWitness[witnessFields.PERSON] = witness.person_id
                      witnesses.push(currWitness)
                    } else { // For every non-member witness, add to witnessInfo to insert to people table
                      currWitness[personFields.FIRST_NAME] = witness.first_name
                      currWitness[personFields.MID_NAME] = witness.mid_name
                      currWitness[personFields.LAST_NAME] = witness.last_name

                      witnessMaleInfo.push(currWitness)
                    }
                  })

                  people.witnessFemale.forEach(function (witness) {
                    const currWitness = {}
                    if (witness.isMember) {
                      currWitness[witnessFields.TYPE] = 'Godmother'
                      currWitness[witnessFields.DEDICATION] = dedicationId
                      currWitness[witnessFields.PERSON] = witness.person_id
                      witnesses.push(currWitness)
                    } else { // For every non-member witness, add to witnessInfo to insert to people table
                      currWitness[personFields.FIRST_NAME] = witness.first_name
                      currWitness[personFields.MID_NAME] = witness.mid_name
                      currWitness[personFields.LAST_NAME] = witness.last_name

                      witnessFemaleInfo.push(currWitness)
                    }
                  })

                  db.insert(db.tables.PERSON_TABLE, witnessMaleInfo, function (result) {
                    if (result) {
                      result = result[0]

                      const maleWitnesses = witnessMaleInfo.map(function (witness) {
                        const witnessInfo = {}
                        witnessInfo[witnessFields.DEDICATION] = dedicationId
                        witnessInfo[witnessFields.PERSON] = result
                        witnessInfo[witnessFields.TYPE] = 'Godfather'
                        result -= 1

                        return witnessInfo
                      })

                      db.insert(db.tables.PERSON_TABLE, witnessFemaleInfo, function (result) {
                        if (result) {
                          result = result[0]

                          const femaleWitnesses = witnessFemaleInfo.map(function (witness) {
                            const witnessInfo = {}
                            witnessInfo[witnessFields.DEDICATION] = dedicationId
                            witnessInfo[witnessFields.PERSON] = result
                            witnessInfo[witnessFields.TYPE] = 'Godmother'
                            result -= 1

                            return witnessInfo
                          })

                          const allWitnesses = witnesses.concat(maleWitnesses).concat(femaleWitnesses)

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
  },

  putUpdateDedication: function (req, res) {
    // If Child non-member to member
    // If parent1 non-member to member
    // If parent2 non-member to member

    // If child non-member change info
    // If parent1 non-member change info
    // If parent2 non-member change info

    // If child member to non-member
    // if parent1 member to non-member
    // If parent2 member to non-member

    // People to be inserted into people table
    // Cases:
    // If child member to non-member
    // if parent1 member to non-member
    // If parent2 member to non-member
    const peopleInfo = []

    const people = {}
    const offsets = {
      child: 0,
      parent1: 0,
      parent2: 0
    }

    people.child = JSON.parse(req.body.child)
    people.parent1 = JSON.parse(req.body.parent1)
    people.parent2 = JSON.parse(req.body.parent2)

    if (people.child.toNonMember) {
      const child = {}
      child[personFields.FIRST_NAME] = people.child.first_name
      child[personFields.MID_NAME] = people.child.mid_name
      child[personFields.LAST_NAME] = people.child.last_name

      peopleInfo.push(child)
    }

    if (people.parent1.toNonMember) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.parent1.first_name
      parent[personFields.MID_NAME] = people.parent1.mid_name
      parent[personFields.LAST_NAME] = people.parent1.last_name

      peopleInfo.push(parent)
      offsets.child += 1
    }

    if (people.parent2 !== null && people.parent2.toNonMember) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.parent2.first_name
      parent[personFields.MID_NAME] = people.parent2.mid_name
      parent[personFields.LAST_NAME] = people.parent2.last_name

      peopleInfo.push(parent)
      offsets.parent1 += 1
      offsets.child += 1
    }
  }
}

module.exports = dedicationController
