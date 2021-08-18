/* TO BE CONTINUED NEXT SPRINT */
const path = require('path')

const db = require('../models/db.js')
const personFields = require('../models/person')
const coupleFields = require('../models/Couple.js')
const weddingRegFields = require('../models/weddingRegistry')
const { prependOnceListener } = require('../routes/routes.js')
const witnessFields = require('../models/witness.js')

const weddingController = {
  /**
   * This function renders the add wedding page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getAddWeddingPage: function (req, res) {
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
        }
      ]
      db.find(db.tables.WEDDING_TABLE, [], join, '*', function (result) {
        if (result) {
          const data = {}
          data.members = result
          data.styles = ['forms']
          data.scripts = ['addWedding']
          data.backLink = parseInt(req.session.level) >= 2 ? '/wedding_main_page' : '/forms_main_page'
          // data.males = data.members.filter((element) => { return element[memberFields.SEX] === 'Male' })
          // data.females = data.members.filter((element) => { return element[memberFields.SEX] === 'Female' })
          res.render('add-wedding-dedication', data)
        }
      })
    }
  },
  /**
   * This function renders the view of a specific wedding record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getViewWeddingPage: function (req, res) {
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
    const weddingId = parseInt(req.params.wedding_id)
    if (parseInt(req.session.level) >= 2 || req.session.editId === weddingId) {
      // process here
    } else {
      sendError('401 Unauthorized Access', 401)
    }
  },
  /**
   * This function inserts a new row in the wedding table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  createWedding: function (req, res) {
    // this is a function declaration, scroll down further below
    function addOtherData (data) {
      // insert brideParents to COUPLE
      db.insert(db.tables.COUPLE_TABLE, data.brideParents, function (brideParentsId) {
        if (brideParentsId) {
          data.wedding[weddingRegFields.BRIDE_PARENTS] = brideParentsId

          // insert groomParents to COUPLE
          db.insert(db.tables.COUPLE_TABLE, data.groomParents, function (groomParentsId) {
            if (groomParentsId) {
              data.wedding[weddingRegFields.GROOM_PARENTS] = groomParentsId
              // finally insert data to WEDDING TABLE
              db.insert(db.tables.WEDDING_TABLE, data.wedding, function (result) {
              // insert res.render() or res.redirect()
              })
            }
          })
        }
      })
    }
    // reading request data starts here
    const data = {
      wedding: {},
      brideParents: {}, // couple
      groomParents: {}, // couple
      brideMother: {}, // person
      brideFather: {}, // person
      groomMother: {}, // person
      groomFather: {} // person
    } // object that will be passed later on
    data.wedding[weddingRegFields.DATE] = req.body.date
    data.wedding[weddingRegFields.OFFICIANT] = req.body.officiant
    data.wedding[weddingRegFields.SOLEMNIZER] = req.body.solemnizer
    data.wedding[weddingRegFields.CONTRACT] = req.body.contract
    // data[weddingRegFields.CONTRACT_IMG] = req.body.contractImg
    data.wedding[weddingRegFields.SOLEMNIZER] = req.body.solemnizer

    data.brideMother[personFields.FIRST_NAME] = req.body.brideMotherFirst
    data.brideMother[personFields.MID_NAME] = req.body.brideMotherMid
    data.brideMother[personFields.LAST_NAME] = req.body.brideMotherLast

    data.brideFather[personFields.FIRST_NAME] = req.body.brideFatherFirst
    data.brideFather[personFields.MID_NAME] = req.body.brideFatherMid
    data.brideFather[personFields.LAST_NAME] = req.body.brideFatherLast

    data.groomMother[personFields.FIRST_NAME] = req.body.groomMotherFirst
    data.groomMother[personFields.MID_NAME] = req.body.groomMotherMid
    data.groomMother[personFields.LAST_NAME] = req.body.groomMotherLast

    data.groomFather[personFields.weddinglds.FIRST_NAME] = req.body.groomFatherFirst
    data.groomFather[personFields.MID_NAME] = req.body.groomFatherMid
    data.groomFather[personFields.LAST_NAME] = req.body.groomFatherLast

    // insert bride's mother
    db.insert(db.tables.PERSON_TABLE, data.brideMother, function (brideMotherId) {
      if (brideMotherId) {
        data.brideParents[coupleFields.FEMALE] = brideMotherId

        // insert bride's father
        db.insert(db.tables.PERSON_TABLE, data.brideFather, function (brideFatherId) {
          if (brideFatherId) {
            data.brideParents[coupleFields.MALE] = brideFatherId

            // insert groom's mother
            db.insert(db.tables.PERSON_TABLE, data.groomMother, function (groomMotherId) {
              if (groomMotherId) {
                data.groomParents[coupleFields.FEMALE] = groomMotherId

                // insert groom's father
                db.insert(db.tables.PERSON_TABLE, data.groomFather, function (groomFatherId) {
                  if (groomFatherId) {
                    data.groomParents[coupleFields.MALE] = groomFatherId
                    addOtherData(data) // call the last stack of inserts
                  } else {
                    res.send('groomFatherId ERROR')
                  }
                })
              } else {
                res.send('groomMotherId ERROR')
              }
            })
          } else {
            res.send('brideFatherId ERROR')
          }
        })
      } else {
        res.send('brideMotherId ERROR')
      }
    })
  },

  postAddWedding: function (req, res) {
    const data = {}

    const people = {
      bride: null,
      groom: null,
      brideMother: null,
      brideFather: null,
      groomMother: null,
      groomFather: null
    }
    const couples = {
      couple: {},
      brideParents: {},
      groomParents: {}
    }

    const peopleOffsets = {
      bride: 0,
      groom: 0,
      brideMother: 0,
      brideFather: 0,
      groomMother: 0,
      groomFather: 0
    }

    const coupleOffsets = {
      brideParents: 0,
      groomParents: 0
    }

    const peopleInfo = []
    const coupleInfo = []

    // Extract data from req.body
    people.bride = JSON.parse(req.body.bride)
    people.groom = JSON.parse(req.body.groom)
    people.brideMother = JSON.parse(req.body.bride_mother)
    people.brideFather = JSON.parse(req.body.bride_father)
    people.groomMother = JSON.parse(req.body.groom_mother)
    people.groomFather = JSON.parse(req.body.groom_father)
    people.witnessMale = JSON.parse(req.body.witness_male)
    people.witnessFemale = JSON.parse(req.body.witness_female)

    if (people.bride.isMember) {
      couples.couple[coupleFields.FEMALE] = people.bride.person_id
    } else {
      const bride = {}
      bride[personFields.FIRST_NAME] = people.bride.first_name
      bride[personFields.MID_NAME] = people.bride.mid_name
      bride[personFields.LAST_NAME] = people.bride.last_name

      peopleInfo.push(bride)
    }

    if (people.groom.isMember) {
      couples.couple[coupleFields.MALE] = people.groom.person_id
    } else {
      const groom = {}
      groom[personFields.FIRST_NAME] = people.groom.first_name
      groom[personFields.MID_NAME] = people.groom.mid_name
      groom[personFields.LAST_NAME] = people.groom.last_name

      peopleInfo.push(groom)

      peopleOffsets.bride += 1
    }

    // check Bride Parents
    if (people.brideMother !== null && people.brideMother.isMember) {
      couples.brideParents[coupleFields.FEMALE] = people.brideMother.person_id
    } else if (people.brideMother !== null) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.brideMother.first_name
      parent[personFields.MID_NAME] = people.brideMother.mid_name
      parent[personFields.LAST_NAME] = people.brideMother.last_name

      peopleInfo.push(parent)

      peopleOffsets.bride += 1
      peopleOffsets.groom += 1
    }

    if (people.brideFather !== null && people.brideFather.isMember) {
      couples.brideParents[coupleFields.MALE] = people.brideFather.person_id
    } else if (people.brideFather !== null) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.brideFather.first_name
      parent[personFields.MID_NAME] = people.brideFather.mid_name
      parent[personFields.LAST_NAME] = people.brideFather.last_name

      peopleInfo.push(parent)

      peopleOffsets.bride += 1
      peopleOffsets.groom += 1
      peopleOffsets.brideMother += 1
    }

    // Check Groom Parents

    if (people.groomMother !== null && people.groomMother.isMember) {
      couples.groomParents[coupleFields.FEMALE] = people.groomMother.person_id
    } else if (people.groomMother !== null) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.groomMother.first_name
      parent[personFields.MID_NAME] = people.groomMother.mid_name
      parent[personFields.LAST_NAME] = people.groomMother.last_name

      peopleInfo.push(parent)

      peopleOffsets.bride += 1
      peopleOffsets.groom += 1
      peopleOffsets.brideMother += 1
      peopleOffsets.brideFather += 1
    }

    if (people.groomFather !== null && people.groomFather.isMember) {
      couples.groomParents[coupleFields.MALE] = people.groomFather.person_id
    } else if (people.groomFather !== null) {
      const parent = {}
      parent[personFields.FIRST_NAME] = people.groomFather.first_name
      parent[personFields.MID_NAME] = people.groomFather.mid_name
      parent[personFields.LAST_NAME] = people.groomFather.last_name

      peopleInfo.push(parent)

      peopleOffsets.bride += 1
      peopleOffsets.groom += 1
      peopleOffsets.brideMother += 1
      peopleOffsets.brideFather += 1
      peopleOffsets.brideMother += 1
    }

    db.insert(db.tables.PERSON_TABLE, peopleInfo, function (result) {
      if (result) {
        result = result[0]

        if (!people.bride.isMember) {
          couples.couple[coupleFields.FEMALE] = result - peopleOffsets.bride
        }

        if (!people.groom.isMember) {
          couples.couple[coupleFields.MALE] = result - peopleOffsets.groom
        }

        if (!people.brideMother.isMember) {
          couples.brideParents[coupleFields.FEMALE] = result - peopleOffsets.brideMother
        }

        if (!people.brideFather.isMember) {
          couples.brideParents[coupleFields.MALE] = result - peopleOffsets.brideFather
        }

        if (!people.groomMother.isMember) {
          couples.groomParents[coupleFields.FEMALE] = result - peopleOffsets.groomMother
        }

        if (!people.groomFather.isMember) {
          couples.groomParents[coupleFields.MALE] = result.peopleOffsets.groomFather
        }

        if (people.brideMother !== null || people.brideFather !== null) {
          coupleInfo.push(couples.brideParents)
        }

        if (people.groomMother !== null || people.groomFather !== null) {
          coupleInfo.push(couples.groomParents)
          coupleOffsets.brideParents += 1
        }

        coupleInfo.push(couples.couple)
        coupleOffsets.brideParents += 1
        coupleOffsets.groomParents += 1

        db.insert(db.tables.COUPLE_TABLE, coupleInfo, function (result) {
          if (result) {
            result = result[0]
            data[weddingRegFields.BRIDE_PARENTS] = result - coupleOffsets.brideParents
            data[weddingRegFields.GROOM_PARENTS] = result - coupleOffsets.groomParents
            data[weddingRegFields.COUPLE] = result

            db.insert(db.tables.WEDDING_TABLE, data, function (result) {
              if (result) {
                const currWedding = result[0]

                const witnessMaleInfo = []
                const witnessFemaleInfo = []
                const witnesses = []

                people.witnessMale.forEach(function (witness) {
                  const currWitness = {}
                  if (witness.isMember) {
                    currWitness[witnessFields.TYPE] = 'Godfather' // Change
                    currWitness[witnessFields.WEDDING] = currWedding
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
                    currWitness[witnessFields.TYPE] = 'Godmother' // Change
                    currWitness[witnessFields.WEDDING] = currWedding
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
                      witnessInfo[witnessFields.WEDDING] = currWedding
                      witnessInfo[witnessFields.PERSON] = result
                      witnessInfo[witnessFields.TYPE] = 'Godfather' // Change
                      result -= 1

                      return witnessInfo
                    })

                    db.insert(db.tables.PERSON_TABLE, witnessFemaleInfo, function (result) {
                      if (result) {
                        result = result[0]

                        const femaleWitnesses = witnessFemaleInfo.map(function (witness) {
                          const witnessInfo = {}
                          witnessInfo[witnessFields.WEDDING] = currWedding
                          witnessInfo[witnessFields.PERSON] = result
                          witnessInfo[witnessFields.TYPE] = 'Godmother'
                          result -= 1

                          return witnessInfo
                        })

                        const allWitnesses = witnesses.concat(maleWitnesses).concat(femaleWitnesses)

                        db.insert(db.tables.WITNESS_TABLE, allWitnesses, function (result) {
                          if (result) {
                            req.session.editId = currWedding
                            res.send(JSON.stringify(currWedding))
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

  /**
   * This function updates a row in the wedding table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  updateWedding: function (req, res) {
    const data = req.query.data
    const condition = req.query.condition

    db.update(db.tables.MEMBER_TABLE, data, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  },
  /**
   * This function deletes a row in the wedding table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  deleteWedding: function (req, res) {
    const condition = req.query.condition

    db.update(db.tables.MEMBER_TABLE, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  }
}

module.exports = weddingController
