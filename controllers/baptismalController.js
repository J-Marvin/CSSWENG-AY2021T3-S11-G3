const bapRegFields = require('../models/baptismalRegistry')
const db = require('../models/db')
const { Condition, queryTypes } = require('../models/condition')
const memberFields = require('../models/members')
const personFields = require('../models/person')

const baptismalController = {
  /**
   * This function renders a specific baptismal record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getViewBaptismalRecord: function (req, res) {
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
    const bapId = req.params.bap_id

    // req.session.level = 3
    if (parseInt(req.session.editId) === parseInt(bapId) || parseInt(req.session.level) >= 2) {
      const joinTables = [
        {
          tableName: db.tables.MEMBER_TABLE,
          sourceCol: db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.ID,
          destCol: db.tables.MEMBER_TABLE + '.' + memberFields.BAPTISMAL_REG
        },
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]

      const columns = [
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.ID + ' as reg_id',
        db.tables.MEMBER_TABLE + '.' + memberFields.ID + ' as member_id',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.DATE + ' as date',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.DATE_CREATED + ' as date_created',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.LOCATION + ' as place',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.OFFICIANT + ' as officiant',
        db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as first_name',
        db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as middle_name',
        db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as last_name'
      ]

      const condition = new Condition(queryTypes.where)

      condition.setKeyValue(bapRegFields.ID, bapId)

      db.find(db.tables.BAPTISMAL_TABLE, condition, joinTables, columns, function (result) {
        if (result) {
          const data = {
            scripts: [],
            styles: ['view'],
            record: result[0]
          }
          data.canSee = (parseInt(req.session.editId) === parseInt(bapId)) || (parseInt(req.session.level) >= 2)
          data.backLink = parseInt(req.session.level) >= 2 ? '/baptismal_main_page' : '/forms_main_page'
          res.render('view-baptismal', data)
        } else {
          sendError('404 Baptismal Record Not Found', 404)
        }
      })
    } else {
      sendError('401 Unauthorized Access', 401)
    }
  },
  /**
   * This function renders the add baptismal record page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getAddBaptismalRecordPage: function (req, res) {
    const data = {}

    const noBapRegCond = new Condition(queryTypes.whereNull)
    noBapRegCond.setField(memberFields.BAPTISMAL_REG)

    const joinTables = [
      {
        tableName: db.tables.PERSON_TABLE,
        sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
        destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
      }
    ]

    // Find members with no baptismal record
    db.find(db.tables.MEMBER_TABLE, noBapRegCond, joinTables, '*', function (result) {
      if (result) {
        data.members = result
        data.scripts = ['addBaptismal']
        data.styles = ['forms']
        data.backLink = parseInt(req.session.level) >= 2 ? '/baptismal_main_page' : '/forms_main_page'
        res.render('add-baptismal', data)
      }
    })
  },
  /**
   * This function processes the creation of the baptismal record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  postAddBaptismalRecord: function (req, res) {
    const data = {}
    const memberCond = new Condition(queryTypes.where)
    let bapId = null
    memberCond.setKeyValue(memberFields.ID, req.body.memberId)

    data[bapRegFields.DATE_CREATED] = req.body.currentDate
    data[bapRegFields.DATE] = req.body.date
    data[bapRegFields.LOCATION] = req.body.location
    data[bapRegFields.OFFICIANT] = req.body.officiant

    console.log(data)

    db.insert(db.tables.BAPTISMAL_TABLE, data, function (result) {
      if (result) {
        bapId = result[0]
        const memberData = {}
        memberData[memberFields.BAPTISMAL_REG] = bapId

        db.update(db.tables.MEMBER_TABLE, memberData, memberCond, function (result) {
          if (result) {
            req.session.editId = bapId
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
