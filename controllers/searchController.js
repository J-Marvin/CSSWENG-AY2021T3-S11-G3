const db = require('../models/db')
const { Condition, queryTypes } = require('../models/condition')
const { validationResult } = require('express-validator')
const addressFields = require('../models/address')
const bapRegFields = require('../models/baptismalRegistry')
const churchFields = require('../models/church')
const coupleFields = require('../models/couple')
const infDedFields = require('../models/infantDedication')
const memberFields = require('../models/members')
const personFields = require('../models/person')
const prenupRecordFields = require('../models/prenupRecord')
const observationFields = require('../models/observation')
const weddingRegFields = require('../models/weddingRegistry')
const witnessFields = require('../models/witness')
const { sendError } = require('../controllers/errorController')

const searchController = {

  getAdvancedSearch: function (req, res) {
    const data = {}
    data.scripts = ['advancedSearch']
    data.styles = ['forms']
    res.render('search-page', data)
  },

  postSearchMember: function (req, res) {
    /*
    The advanced search for member profiles allows you to search based
    on the following: name, sex, age, birthday, address (by city),
    civil status, highest educational attainment,
    current occupation, membership status.
    */
    const data = {}
    data.person[personFields.FIRST_NAME] = req.body.first_name
    data.person[personFields.MID_NAME] = req.body.middle_name
    data.person[personFields.LAST_NAME] = req.body.last_name

    data.member[memberFields.SEX] = req.body.sex
    data.member[memberFields.BIRTHDAY] = req.body.birthday
    data.member[memberFields.CIVIL_STATUS] = req.body.civil_status
    data.member[memberFields.EDUCATIONAL_ATTAINMENT] = req.body.educational_attainment
    data.member[memberFields.OCCUPATION] = req.body.occupation
    data.member[memberFields.MEMBER_STATUS] = req.body.membership_status

    data.address[addressFields.CITY] = req.body.city

    const joinTables = [
      {
        tableName: { person: db.tables.PERSON_TABLE },
        sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
        destCol: 'person.' + personFields.ID
      },
      {
        tableName: { address: db.tables.ADDRESS_TABLE },
        sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.ADDRESS,
        destCol: 'address.' + addressFields.ID
      }
    ]
    const conditions = [] // array of conditions
    // first name
    let cond = new Condition(queryTypes.where)
    cond.setKeyValue('person.' + personFields.FIRST_NAME, '%' + data.person[personFields.FIRST_NAME] + '%', 'LIKE')
    conditions.append(cond)

    // middle name
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('person.' + personFields.FIRST_NAME, '%' + data.person[personFields.MID_NAME] + '%', 'LIKE')
    conditions.append(cond)

    // last name
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('person.' + personFields.FIRST_NAME, '%' + data.person[personFields.MID_NAME] + '%', 'LIKE')
    conditions.append(cond)

    // address
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('address.' + addressFields.CITY, '%' + data.address[addressFields.CITY] + '%', 'LIKE')
    conditions.append(cond)

    // sex
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('member.' + memberFields.SEX, data.member[memberFields.SEX], '=')
    conditions.append(cond)

    // birthday
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('member.' + memberFields.BIRTHDAY, data.member[memberFields.BIRTHDAY], '=')
    conditions.append(cond)

    // civil status
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('member.' + memberFields.CIVIL_STATUS, data.member[memberFields.CIVIL_STATUS], '=')
    conditions.append(cond)

    // educational attainment
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('member.' + memberFields.EDUCATIONAL_ATTAINMENT, '%' + data.member[memberFields.EDUCATIONAL_ATTAINMENT] + '%', 'LIKE')
    conditions.append(cond)

    // occupation
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('member.' + memberFields.OCCUPATION, '%' + data.member[memberFields.OCCUPATION] + '%', 'LIKE')
    conditions.append(cond)

    // member status
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('member.' + memberFields.MEMBER_STATUS, data.member[memberFields.MEMBER_STATUS], '=')
    conditions.append(cond)

    db.find(db.tables.MEMBER_TABLE, conditions, joinTables, '*', function (result) {
      console.log(result)
      if (result !== null && result.length > 0) {
        res.send(result)
      }
    })
  },

  postSearchPrenup: function (req, res) {
    /*
    The advanced search for the prenuptial record allows you to search based
    on the following: bride’s name, groom’s name, date created, and
    proposed date of the wedding.

    */
    // continue here
  },

  postSearchWedding: function (req, res) {
    /*
    The advanced search for the wedding record allows you to search based
    on the following: bride’s name, groom’s name, bride and groom’s parents,
    date of marriage, place of marriage (city), wedding officiant, solemnizing minister,
    and the registration number of the wedding contract.

    */
    // continue here
  },

  postSearchDedication: function (req, res) {
    /*
    The advanced search for the child dedication record allows you to search based on the following:
    name of the child, name of the parents, date of dedication, place of dedication (string matching),
    minister, and witnesses.
    */
    // continue here
  },

  postSearchBaptismal: function (req, res) {
    /*
    The advanced search for the baptismal record allows you to search based on the following:
    name of the baptized person, date of baptism, place of baptism (string matching), and officiant.
    */
    // continue here
  }
}

module.exports = searchController
