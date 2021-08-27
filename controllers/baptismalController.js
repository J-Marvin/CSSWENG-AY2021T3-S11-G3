const bapRegFields = require('../models/baptismalRegistry')
const db = require('../models/db')
const { Condition, queryTypes } = require('../models/condition')
const memberFields = require('../models/members')

const baptismalController = {

  getViewBaptismalRecord: function (req, res) {
    const bapId = req.params.bap_id

    const joinTables = [
      {
        tableName: db.tables.MEMBER_TABLE,
        sourceCol: db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.ID,
        destCol: db.tables.MEMBER_TABLE + '.' + memberFields.BAPTISMAL_REG
      }
    ]

    const condition = Condition(queryTypes.where)
    condition.setKeyValue(bapRegFields.ID, bapId)

    db.find(db.tables.BAPTISMAL_TABLE, condition, joinTables, '*', function (result) {
      if (result) {
        const data = {
          scripts: [],
          styles: [],
          record: result[0]
        }

        res.render('view', data)
      } else {
        res.send(false) // change to error page
      }
    })
  },

  getAddBaptismalRecordPage: function (req, res) {
    const data = {}
    data.scripts = []
    data.styles = []

    const noBapRegCond = new Condition(queryTypes.whereNull)
    noBapRegCond.setField(memberFields.BAPTISMAL_REG)

    // Find members with no baptismal record
    db.find(db.tables.MEMBER_TABLE, noBapRegCond, [], '*', function (result) {
      if (result) {
        data.members = result
        res.render('temp', data)
      } else {
        // change to error page
        res.send(false)
      }
    })
  },

  postAddBaptismalRecord: function (req, res) {
    const data = {}
    const memberCond = new Condition(queryTypes.where)
    let bapId = null
    memberCond.setKeyValue(memberFields.ID, req.body.memberId)

    data[bapRegFields.DATE_CREATED] = req.body.dateCreated
    data[bapRegFields.DATE] = req.body.date
    data[bapRegFields.LOCATION] = req.body.location
    data[bapRegFields.OFFICIANT] = req.body.officiant
    data[bapRegFields.PERSON] = req.body.memberId

    db.insert(db.tables.BAPTISMAL_TABLE, data, function (result) {
      if (result) {
        bapId = result[0]
        const memberData = {}
        memberData[memberFields.BAPTISMAL_REG] = bapId

        db.update(db.tables.MEMBER_TABLE, memberData, memberCond, function (result) {
          if (result) {
            res.send(JSON.stringify(bapId))
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

module.exports = baptismalController
