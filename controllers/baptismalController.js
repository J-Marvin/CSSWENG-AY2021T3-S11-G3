const bapRegFields = require('../models/baptismalRegistry')
const db = require('../models/db')
const { tables } = require('../models/db')
const { Condition, queryTypes } = require('../models/condition')
const memberFields = require('../models/members')
const personFields = require('../models/person')
const { sendError } = require('../controllers/errorController')
const { BAPTISMAL_REG } = require('../models/members')
const { updateMemberToMember, updateMemberToNonMember, updateNonMemberToMember, updateNonMemberToNonMember } = require('./updateController')

const baptismalController = {
  /**
   * This function renders a specific baptismal record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getViewBaptismalRecord: function (req, res) {
    const bapId = req.params.bap_id
    if (parseInt(req.session.editId) === parseInt(bapId) || parseInt(req.session.level) >= 2) {
      const joinTables = [
        {
          tableName: { member: db.tables.PERSON_TABLE },
          sourceCol: db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.PERSON,
          destCol: 'member.' + personFields.ID
        },
        {
          tableName: { officiant: db.tables.PERSON_TABLE },
          sourceCol: db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.OFFICIANT,
          destCol: 'officiant.' + personFields.ID
        }
      ]

      const columns = [
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.ID + ' as reg_id',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.DATE + ' as date',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.DATE_CREATED + ' as date_created',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.LOCATION + ' as place',
        'member.' + personFields.FIRST_NAME + ' as member_first_name',
        'member.' + personFields.MID_NAME + ' as member_mid_name',
        'member.' + personFields.LAST_NAME + ' as member_last_name',
        'member.' + personFields.MEMBER + ' as member_id',
        'officiant.' + personFields.FIRST_NAME + ' as officiant_first_name',
        'officiant.' + personFields.MID_NAME + ' as officiant_mid_name',
        'officiant.' + personFields.LAST_NAME + ' as officiant_last_name',
        'officiant.' + personFields.MEMBER + ' as officiant_id'
      ]

      const condition = new Condition(queryTypes.where)

      condition.setKeyValue(bapRegFields.ID, bapId)

      db.find(db.tables.BAPTISMAL_TABLE, condition, joinTables, columns, function (result) {
        if (result.length > 0) {
          const data = {
            scripts: ['deleteBaptismal'],
            styles: ['view'],
            record: result[0]
          }
          data.canSee = (parseInt(req.session.editId) === parseInt(bapId)) || (parseInt(req.session.level) >= 2)
          data.backLink = parseInt(req.session.level) >= 2 ? '/baptismal_main_page' : '/forms_main_page'
          res.render('view-baptismal', data)
        } else {
          sendError(req, res, 404, '404 Baptismal Record Not Found')
        }
      })
    } else {
      sendError(req, res, 401)
    }
  },
  /**
   * This function renders the add baptismal record page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getAddBaptismalRecordPage: function (req, res) {
    const memberId = req.params.member_id

    if (parseInt(req.session.level) >= 1) {
      const data = {}
      const joinTables = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      db.find(db.tables.MEMBER_TABLE, [], joinTables, '*', function (result) {
        if (result) {
          data.members = result

          // Find members with no baptismal record
          data.noBapMembers = result.filter(function (elem) {
            return elem[memberFields.BAPTISMAL_REG] === null
          })
          data.scripts = ['addBaptismal']
          data.styles = ['forms']
          data.backLink = parseInt(req.session.level) >= 2 ? '/baptismal_main_page' : '/forms_main_page'
          data.memberId = memberId
          res.render('add-baptismal', data)
        }
      })
    } else {
      sendError(req, res, 401, '401 Unauthorized Access')
    }
  },

  getEditBaptismal: function (req, res) {
    const bapId = req.params.bap_id

    if (parseInt(req.session.editId) === parseInt(bapId) || parseInt(req.session.level) >= 2) {
      const joinTables = [
        {
          tableName: { member: db.tables.PERSON_TABLE },
          sourceCol: db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.PERSON,
          destCol: 'member.' + personFields.ID
        },
        {
          tableName: { officiant: db.tables.PERSON_TABLE },
          sourceCol: db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.OFFICIANT,
          destCol: 'officiant.' + personFields.ID
        }
      ]

      const columns = [
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.ID + ' as reg_id',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.DATE + ' as date',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.DATE_CREATED + ' as date_created',
        db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.LOCATION + ' as place',
        'member.' + personFields.FIRST_NAME + ' as member_first_name',
        'member.' + personFields.MID_NAME + ' as member_mid_name',
        'member.' + personFields.LAST_NAME + ' as member_last_name',
        'member.' + personFields.MEMBER + ' as member_id',
        'member.' + personFields.ID + ' as person_id',
        'officiant.' + personFields.FIRST_NAME + ' as officiant_first_name',
        'officiant.' + personFields.MID_NAME + ' as officiant_mid_name',
        'officiant.' + personFields.LAST_NAME + ' as officiant_last_name',
        'officiant.' + personFields.MEMBER + ' as officiant_id',
        'officiant.' + personFields.ID + ' as officiant_person_id'
      ]

      const condition = new Condition(queryTypes.where)

      condition.setKeyValue(bapRegFields.ID, bapId)

      db.find(db.tables.BAPTISMAL_TABLE, condition, joinTables, columns, function (result) {
        if (result.length > 0) {
          const data = {
            scripts: ['editBaptismal', 'edit'],
            styles: ['view'],
            record: result[0]
          }
          data.canSee = (parseInt(req.session.editId) === parseInt(bapId)) || (parseInt(req.session.level) >= 2)
          data.backLink = parseInt(req.session.level) >= 2 ? '/baptismal_main_page' : '/forms_main_page'
          db.find(db.tables.MEMBER_TABLE, [], {
            tableName: tables.PERSON_TABLE,
            sourceCol: tables.PERSON_TABLE + '.' + personFields.ID,
            destCol: tables.MEMBER_TABLE + '.' + memberFields.PERSON
          }, '*', function (members) {
            if (members) {
              data.members = members
              data.noBapMembers = members.filter(elem => elem[BAPTISMAL_REG] === null || elem[BAPTISMAL_REG] === data.record.reg_id)
              res.render('edit-baptismal', data)
            } else {
              sendError(req, res, 404, '404 Baptismal Record Not Found')
            }
          })
        } else {
          sendError(req, res, 404, '404 Baptismal Record Not Found')
        }
      })
    } else {
      sendError(req, res, 401)
    }
  },

  /**
   * This function processes the creation of the baptismal record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  postAddBaptismalRecord: function (req, res) {
    const data = {}
    const memberCond = new Condition(queryTypes.where)
    let bapId = req.params.bap_id

    memberCond.setKeyValue(memberFields.PERSON, req.body.personId)

    data[bapRegFields.DATE_CREATED] = req.body.currentDate
    data[bapRegFields.DATE] = req.body.date
    data[bapRegFields.LOCATION] = req.body.location
    data[bapRegFields.PERSON] = req.body.personId

    const officiant = JSON.parse(req.body.officiant)
    const peopleInfo = {}

    if (officiant.isMember) {
      data[bapRegFields.OFFICIANT] = officiant.person_id
    } else {
      peopleInfo[personFields.FIRST_NAME] = officiant.first_name
      peopleInfo[personFields.MID_NAME] = officiant.mid_name
      peopleInfo[personFields.LAST_NAME] = officiant.last_name
    }

    db.insert(db.tables.PERSON_TABLE, peopleInfo, function (result) {
      if (result) {
        if (!officiant.isMember) {
          
          data[bapRegFields.OFFICIANT] = result[0]
        }
        
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
      } else {
        res.send(false)
      }
    })
  },

  putUpdateBaptismalMember: function (req, res) {
    function sendReply (result) {
      if (result) {
        res.send(req.body.recordId)
      } else {
        res.send(false)
      }
    }
    const ids = {
      oldPersonId: req.body.oldPersonId,
      newPersonId: req.body.newPersonId,
      recordId: req.body.recordId
    }

    const fields = {
      recordId: tables.BAPTISMAL_TABLE + '.' + bapRegFields.ID,
      memberRecordField: memberFields.BAPTISMAL_REG,
      recordPersonField: bapRegFields.PERSON
    }
    updateMemberToMember(ids, fields, tables.BAPTISMAL_TABLE, sendReply)
  },

  putUpdateBaptismalOfficiant: function (req, res) {
    const isOldMember = req.body.isOldMember === 'true'
    const person = JSON.parse(req.body.person)
    const isNewMember = person.isMember
    const ids = {
      recordId: req.body.recordId,
      oldPersonId: req.body.oldPersonId,
      newPersonId: person.personId
    }

    if (isOldMember && isNewMember) { // From member to member
      const fields = {
        recordId: tables.BAPTISMAL_TABLE + '.' + bapRegFields.ID,
        memberRecordField: memberFields.BAPTISMAL_REG,
        recordPersonField: bapRegFields.OFFICIANT
      }
      updateMemberToMember(ids, fields, tables.BAPTISMAL_TABLE, sendReply)
    } else if (isOldMember && !isNewMember) { // From member to non member
      const fields = {
        recordId: bapRegFields.ID,
        memberRecordField: null,
        recordPersonField: bapRegFields.OFFICIANT
      }
      updateMemberToNonMember(person, ids, fields, tables.BAPTISMAL_TABLE, sendReply)
    } else if (!isOldMember && isNewMember) { // From non member to member
      const fields = {
        recordId: bapRegFields.ID,
        memberRecordField: null, // No editing to member table since officiant
        recordPersonField: bapRegFields.OFFICIANT
      }

      updateNonMemberToMember(ids, fields, tables.BAPTISMAL_TABLE, sendReply)
    } else {
      updateNonMemberToNonMember(person, sendReply)
    }

    function sendReply (result) {
      if (result) {
        res.send(JSON.stringify(result))
      } else {
        res.send(false)
      }
    }
  },

  putUpdateBaptismalMisc: function (req, res) {
    const data = {}
    data[bapRegFields.LOCATION] = req.body.location
    data[bapRegFields.DATE] = req.body.date

    const recordId = req.body.recordId
    const recordCond = new Condition(queryTypes.where)
    recordCond.setKeyValue(bapRegFields.ID, recordId)

    db.update(tables.BAPTISMAL_TABLE, data, recordCond, function (result) {
      res.send(JSON.stringify(result))
    })
  },

  delBaptismal: function (req, res) {
    const id = req.body.recordId
    const joinTables = [
      {
        tableName: { member: tables.PERSON_TABLE },
        sourceCol: tables.BAPTISMAL_TABLE + '.' + bapRegFields.PERSON,
        destCol: 'member.' + personFields.ID
      },
      {
        tableName: { officiant: tables.PERSON_TABLE },
        sourceCol: tables.BAPTISMAL_TABLE + '.' + bapRegFields.OFFICIANT,
        destCol: 'officiant.' + personFields.ID
      }
    ]
    const columns = [
      'member.' + personFields.ID + ' as member_person_id',
      'member.' + personFields.MEMBER + ' as member_member_id',
      'officiant.' + personFields.MEMBER + ' as officiant_member_id',
      'officiant.' + personFields.ID + ' as officiant_person_id'
    ]
    const recordCond = new Condition(queryTypes.where)
    recordCond.setKeyValue(tables.BAPTISMAL_TABLE + '.' + bapRegFields.ID, id)

    db.find(db.tables.BAPTISMAL_TABLE, recordCond, joinTables, columns, function (result) {
      if (result) {
        const nonMembers = []
        result = result[0]

        if (result.member_id === null) {
          nonMembers.push(result.person_id)
        }

        if (result.officiant_member_id === null) {
          nonMembers.push(result.officiant_person_id)
        }

        db.delete(db.tables.BAPTISMAL_TABLE, recordCond, function (result) {
          const nonMemberCond = new Condition(queryTypes.whereIn)
          nonMemberCond.setArray(personFields.ID, nonMembers)
          if (result) {
            db.delete(db.tables.PERSON_TABLE, nonMemberCond, function (result) {
              if (result === 0) {
                result = true
              }

              if (result) {
                res.send(true)
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

module.exports = baptismalController
