const db = require('../models/db')
const coupleFields = require('../models/couple')
const personFields = require('../models/person')
const infantDedicationFields = require('../models/infantDedication')
const witnessFields = require('../models/witness')
const memberFields = require('../models/members')

const dedicationController = {
  getDedicationPage: function (req, res) {
    res.send('Temp')
  },

  getAddDedicationPage: function(req, res) {
    const join = [
      {
        tableName: db.tables.PERSON_TABLE,
        sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
        destCol: db.tables.PERSON_TABLE + '.' + personFields.ID,
      }
    ]
    db.find(db.tables.MEMBER_TABLE, [], join, '*', function (result) {
      if (result) {
        const data = {}
        data.members = result
        data.scripts = [
          'addDedication'
        ]
        res.render('add-child-temp', data)
      }
    })
  },

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
    data[infantDedicationFields.OFFICIANT] = req.body.officiant
    data[infantDedicationFields.DATE] = new Date().toISOString()
    data[infantDedicationFields.PLACE] = req.body.place

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

    // If second guardian is available
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
      data[infantDedicationFields.PERSON] = people.child.person_id
    }

    // Insert people (not including witnesses)
    console.log(peopleInfo)
    db.insert(db.tables.PERSON_TABLE, peopleInfo, function (result) {
      if (result) {
        if (result.length > 0) {
          if (people.child.person_id === null || people.child.person_id === undefined) {
            data[infantDedicationFields.PERSON] = result[0] - offsets.child
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
            data[infantDedicationFields.PARENTS] = result

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
                            res.send("WITNESS TABLE ERROR")
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
        res.send("INSERT PEOPLE ERROR")
      }
    })
  }
}

module.exports = dedicationController
