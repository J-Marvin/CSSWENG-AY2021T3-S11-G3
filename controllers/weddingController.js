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
    function addOtherData (data, brideParents, groomParents) {
      // insert brideParents to COUPLE
      db.insertOne(db.tables.COUPLE_TABLE, brideParents, function (brideParentsId) {
        data[weddingRegFields.BRIDE_PARENTS] = brideParentsId
        // insert groomParents to COUPLE
        db.insertOne(db.tables.COUPLE_TABLE, groomParents, function (groomParentsId) {
          data[weddingRegFields.GROOM_PARENTS] = groomParentsId
          // finally insert data to WEDDING TABLE
          db.insertOne(db.tables.WEDDING_TABLE, data, function (result) {
            // insert res.render() or res.redirect()
          })
        })
      })
    }
    // reading request data starts here
    const data = {} // object that will be passed later on
    data[weddingRegFields.DATE] = req.body.date
    data[weddingRegFields.OFFICIANT] = req.body.officiant
    data[weddingRegFields.SOLEMNIZER] = req.body.solemnizer
    data[weddingRegFields.CONTRACT] = req.body.contract
    // data[weddingRegFields.CONTRACT_IMG] = req.body.contractImg
    data[weddingRegFields.SOLEMNIZER] = req.body.solemnizer

    const brideParents = {} // couple
    const groomParents = {} // couple

    const brideMother = {} // person
    brideMother[personFields.FIRST_NAME] = req.body.brideMotherFirst
    brideMother[personFields.MID_NAME] = req.body.brideMotherMid
    brideMother[personFields.LAST_NAME] = req.body.brideMotherLast

    const brideFather = {} // person
    brideFather[personFields.FIRST_NAME] = req.body.brideFatherFirst
    brideFather[personFields.MID_NAME] = req.body.brideFatherMid
    brideFather[personFields.LAST_NAME] = req.body.brideFatherLast

    const groomMother = {} // person
    groomMother[personFields.FIRST_NAME] = req.body.groomMotherFirst
    groomMother[personFields.MID_NAME] = req.body.groomMotherMid
    groomMother[personFields.LAST_NAME] = req.body.groomMotherLast

    const groomFather = {} // person
    groomFather[personFields.FIRST_NAME] = req.body.groomFatherFirst
    groomFather[personFields.MID_NAME] = req.body.groomFatherMid
    groomFather[personFields.LAST_NAME] = req.body.groomFatherLast

    // insert bride's mother
    db.insertOne(db.tables.PERSON_TABLE, brideMother, function (brideMotherId) {
      brideParents[coupleFields.FEMALE] = brideMotherId
      // insert bride's father
      db.insertOne(db.tables.PERSON_TABLE, brideFather, function (brideFatherId) {
        brideParents[coupleFields.MALE] = brideFatherId
        // insert groom's mother
        db.insertOne(db.tables.PERSON_TABLE, groomMother, function (groomMotherId) {
          groomParents[coupleFields.FEMALE] = groomMotherId
          // insert groom's father
          db.insertOne(db.tables.PERSON_TABLE, groomFather, function (groomFatherId) {
            groomParents[coupleFields.MALE] = groomFatherId
            addOtherData(data, brideParents, groomParents)
          })
        })
      })
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
