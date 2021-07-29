/* TO BE CONTINUED NEXT SPRINT */
const db = require('../models/db.js')
const personFields = require('../models/person')
const prenupRecordFields = require('../models/prenupRecord')
const coupleFields = require('../models/Couple.js')
const weddingRegFields = require('../models/weddingRegistry')

const weddingController = {
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
  /**
   * This function updates a row in the wedding table
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  updateWedding: function (req, res) {
    const data = req.query.data
    const condition = req.query.condition

    db.updateOne(db.tables.MEMBER_TABLE, data, condition, function (result) {
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

    db.updateOne(db.tables.MEMBER_TABLE, condition, function (result) {
      console.log(result)
      // insert res.render() or res.redirect()
    })
  }
}

module.exports = weddingController
