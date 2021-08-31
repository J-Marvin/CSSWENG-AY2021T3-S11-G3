const db = require('../models/db')
const { Condition, queryTypes } = require('../models/condition')
const { validationResult, query } = require('express-validator')
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
  /**
   * This function renders the advanced search page
   * @param req - the incoming request containing the query
   * @param res - the result to be sent out after processing the request
  */
  getAdvancedSearch: function (req, res) {
    const data = {}
    if (parseInt(req.session.level) === 2) {
      data.canSee = false // cannot see the member option type in advanced search
    } else if (parseInt(req.session.level) === 3) {
      data.canSee = true // can see the member option type in advanced search
    }
    data.scripts = ['advancedSearch']
    data.styles = ['forms']
    res.render('search-page', data)
  },
  /**
   * This function processes the search text fields and returns a number of
   * search results on members
   * @param req - the incoming request containing the search queries
   * @param res - the result to be sent out after processing the request
   */
  getSearchMember: function (req, res) {
    /*
    The advanced search for member profiles allows you to search based
    on the following: name, sex, age, birthday, address (by city),
    civil status, highest educational attainment,
    current occupation, membership status.
    */
    const data = {
      person: {},
      member: {},
      address: {}
    }
    data.person[personFields.FIRST_NAME] = req.query.member_first_name
    data.person[personFields.MID_NAME] = req.query.member_middle_name
    data.person[personFields.LAST_NAME] = req.query.member_last_name

    data.member[memberFields.SEX] = req.query.sex

    const ageFrom = req.query.ageFrom
    const ageTo = req.query.ageTo
    let ageChecked = false
    if (ageFrom !== null && ageTo !== undefined) {
      ageChecked = true
    } else {
      data.member.birthdayFrom = req.query.birthdayFrom
      data.member.birthdayTo = req.query.birthdayTo
    }

    data.member[memberFields.CIVIL_STATUS] = req.query.civil_status
    data.member[memberFields.EDUCATIONAL_ATTAINMENT] = req.query.educational_attainment
    data.member[memberFields.OCCUPATION] = req.query.occupation
    data.member[memberFields.MEMBER_STATUS] = req.query.membership_status

    data.address[addressFields.CITY] = req.query.city

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
    conditions.push(cond)

    // middle name
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('person.' + personFields.MID_NAME, '%' + data.person[personFields.MID_NAME] + '%', 'LIKE')
    conditions.push(cond)

    // last name
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('person.' + personFields.LAST_NAME, '%' + data.person[personFields.LAST_NAME] + '%', 'LIKE')
    conditions.push(cond)

    // address
    cond = new Condition(queryTypes.where)
    cond.setKeyValue('address.' + addressFields.CITY, '%' + data.address[addressFields.CITY] + '%', 'LIKE')
    conditions.push(cond)

    // sex
    cond = new Condition(queryTypes.where)
    cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.SEX, data.member[memberFields.SEX], '=')
    conditions.push(cond)

    const ageColumn = ['cast(strftime(\' % Y.% m % d\', \'now\') - strftime(\' % Y.% m % d\', person.' + memberFields.BIRTHDAY + ') as int) AS age']
    const havingCond = []
    // age is only provided do the date maths
    if (ageChecked) {
      // age
      const havingCond1 = new Condition(queryTypes.havingBetween)
      havingCond1.setRange('age', 0, 100) // change to range
      havingCond.push(havingCond1)
    } else {
      // if age is not provided
      // birthday YYYY-MM-DD
      cond = new Condition(queryTypes.whereBetween)
      cond.setRange(memberFields.BIRTHDAY, data.member.birthdayFrom, data.member.birthdayTo)
      conditions.push(cond)
    }

    // civil status
    cond = new Condition(queryTypes.where)
    cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.CIVIL_STATUS, data.member[memberFields.CIVIL_STATUS], '=')
    conditions.push(cond)

    // educational attainment
    cond = new Condition(queryTypes.where)
    cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.EDUCATIONAL_ATTAINMENT, '%' + data.member[memberFields.EDUCATIONAL_ATTAINMENT] + '%', 'LIKE')
    conditions.push(cond)

    // occupation
    cond = new Condition(queryTypes.where)
    cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.OCCUPATION, '%' + data.member[memberFields.OCCUPATION] + '%', 'LIKE')
    conditions.push(cond)

    // member status
    cond = new Condition(queryTypes.where)
    cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.MEMBER_STATUS, data.member[memberFields.MEMBER_STATUS], '=')
    conditions.push(cond)

    console.log(data)
    db.find(db.tables.MEMBER_TABLE, conditions, joinTables, '*', function (result) {
      console.log(result)
      if (result !== null && result.length > 0) {
        res.send(result)
      }
    }, ageColumn, havingCond)
  },
  /**
   * This function processes the search text fields and returns a number of
   * search results on prenuptial records
   * @param req - the incoming request containing the search queries
   * @param res - the result to be sent out after processing the request
   */
  getSearchPrenup: function (req, res) {
    /*
    The advanced search for the prenuptial record allows you to search based
    on the following: bride’s name, groom’s name, date created, and
    proposed date of the wedding.

    */
    // continue here
  },
  /**
   * This function processes the search text fields and returns a number of
   * search results on wedding records
   * @param req - the incoming request containing the search queries
   * @param res - the result to be sent out after processing the request
   */
  getSearchWedding: function (req, res) {
    /*
    The advanced search for the wedding record allows you to search based
    on the following: bride’s name, groom’s name, bride and groom’s parents,
    date of marriage, place of marriage (city), wedding officiant, solemnizing minister,
    and the registration number of the wedding contract.

    */
    // continue here
  },
  /**
   * This function processes the search text fields and returns a number of
   * search results on child dedication records
   * @param req - the incoming request containing the search queries
   * @param res - the result to be sent out after processing the request
   */
  getSearchDedication: function (req, res) {
    /*
    The advanced search for the child dedication record allows you to search based on the following:
    name of the child, name of the parents, date of dedication, place of dedication (string matching),
    minister, and witnesses.
    */
    // continue here
  },
  /**
   * This function processes the search text fields and returns a number of
   * search results on baptismal records
   * @param req - the incoming request containing the search queries
   * @param res - the result to be sent out after processing the request
   */
  getSearchBaptismal: function (req, res) {
    /*
    The advanced search for the baptismal record allows you to search based on the following:
    name of the baptized person, date of baptism, place of baptism (string matching), and officiant.
    */
    // continue here
  }
}

module.exports = searchController
