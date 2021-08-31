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
const { tables } = require('../models/db')

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
    const people = {
      bride: {
        first_name: req.query.prenup_bride_first_name,
        mid_name: req.query.prenup_bride_mid_name,
        last_name: req.query.prenup_bride_last_name
      },
      groom: {
        first_name: req.query.prenup_groom_first_name,
        mid_name: req.query.prenup_groom_mid_name,
        last_name: req.query.prenup_groom_last_name
      }
    }

    const joinTables = [
      {
        tableName: tables.COUPLE_TABLE,
        sourceCol: tables.PRENUPTIAL_TABLE + '.' + tables.PRENUPTIAL_TABLE,
        destCol: tables.COUPLE_TABLE + '.' + coupleFields.ID
      },
      {
        tableName: { groom: tables.PERSON_TABLE },
        sourceCol: 'groom.' + personFields.ID,
        destCol: tables.COUPLE_TABLE + '.' + coupleFields.MALE
      },
      {
        tableName: { bride: tables.PERSON_TABLE },
        sourceCol: 'bride.' + personFields.ID,
        destCol: tables.COUPLE_TABLE + '.' + coupleFields.FEMALE
      }
    ]

    const columns = [
      db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.ID,
      db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.DATE_OF_WEDDING,
      'bride.' + personFields.FIRST_NAME + ' as bride_first_name',
      'bride.' + personFields.MID_NAME + ' as bride_mid_name',
      'bride.' + personFields.LAST_NAME + ' as bride_last_name',
      'groom.' + personFields.FIRST_NAME + ' as groom_first_name',
      'groom.' + personFields.MID_NAME + ' as groom_mid_name',
      'groom.' + personFields.LAST_NAME + ' as groom_last_name'
    ]
    const conditions = []

    // Bride First Name Condition
    if (people.bride.first_name !== null && people.bride.first_name !== '') {
      const condition = new Condition(queryTypes.where)
      condition.setKeyValue('bride.' + personFields.FIRST_NAME, '%' + people.bride.first_name + '%', 'LIKE')
      conditions.push(condition)
    }

    // Bride Middle Name Condition
    if (people.bride.mid_name !== null && people.bride.mid_name !== '') {
      const condition = new Condition(queryTypes.where)
      condition.setKeyValue('bride.' + personFields.MID_NAME, '%' + people.bride.mid_name + '%', 'LIKE')
      conditions.push(condition)
    }

    // Bride Last Name Condition
    if (people.bride.last_name !== null && people.bride.last_name !== '') {
      const condition = new Condition(queryTypes.where)
      condition.setKeyValue('bride.' + personFields.LAST_NAME, '%' + people.bride.last_name + '%', 'LIKE')
      conditions.push(condition)
    }

    // Groom First Name Condition
    if (people.groom.first_name !== null && people.groom.first_name !== '') {
      const condition = new Condition(queryTypes.where)
      condition.setKeyValue('bride.' + personFields.FIRST_NAME, '%' + people.bride.first_name + '%', 'LIKE')
      conditions.push(condition)
    }

    // Groom Middle Name Condition
    if (people.groom.mid_name !== null && people.groom.mid_name !== '') {
      const condition = new Condition(queryTypes.where)
      condition.setKeyValue('bride.' + personFields.MID_NAME, '%' + people.bride.mid_name + '%', 'LIKE')
      conditions.push(condition)
    }

    // Groom Last Name Condition
    if (people.groom.last_name !== null && people.groom.last_name !== '') {
      const condition = new Condition(queryTypes.where)
      condition.setKeyValue('bride.' + personFields.LAST_NAME, '%' + people.bride.last_name + '%', 'LIKE')
      conditions.push(condition)
    }
    // TODO: Insert Date Conditions

    db.find(tables.PRENUPTIAL_TABLE, conditions, joinTables, columns, function (result) {
      if (result) {
        res.render('prenup-main-page', {
          styles: ['lists'],
          scripts: ['convertDataTable'],
          prenup: result,
          backLink: '/advanced_search'
        })
      } else {
        sendError(req, res, 404)
      }
    })
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
    const joinTables = [
      {
        tableName: db.tables.COUPLE_TABLE,
        sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID,
        destCol: db.tables.INFANT_TABLE + '.' + infDedFields.PARENTS
      },
      {
        tableName: { infant: db.tables.PERSON_TABLE },
        sourceCol: db.tables.INFANT_TABLE + '.' + infDedFields.PERSON,
        destCol: 'infant.' + personFields.ID
      },
      {
        type: 'leftJoin',
        tableName: { guardianOne: db.tables.PERSON_TABLE },
        sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
        destCol: 'guardianOne.' + personFields.ID
      },
      {
        type: 'leftJoin',
        tableName: { guardianTwo: db.tables.PERSON_TABLE },
        sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
        destCol: 'guardianTwo.' + personFields.ID
      }
    ]

    const columns = [
      db.tables.INFANT_TABLE + '.' + infDedFields.ID,
      'infant.' + personFields.FIRST_NAME + ' as infant_first_name',
      'infant.' + personFields.MID_NAME + ' as infant_mid_name',
      'infant.' + personFields.LAST_NAME + ' as infant_last_name',
      'guardianOne.' + personFields.FIRST_NAME + ' as guardianOne_first_name',
      'guardianOne.' + personFields.MID_NAME + ' as guardianOne_mid_name',
      'guardianOne.' + personFields.LAST_NAME + ' as guardianOne_last_name',
      'guardianTwo.' + personFields.FIRST_NAME + ' as guardianTwo_first_name',
      'guardianTwo.' + personFields.MID_NAME + ' as guardianTwo_mid_name',
      'guardianTwo.' + personFields.LAST_NAME + ' as guardianTwo_last_name'
    ]

    const conditions = []
    let tempCondition = null

    tempCondition = new Condition()
    tempCondition.setKeyValue()
    db.find(db.tables.INFANT_TABLE, null, joinTables, columns, function (result) {
      // console.log(result)
      res.render('dedication-main-page', {
        styles: ['lists'],
        scripts: ['convertDataTable'],
        dedication: result
      })
    })
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

    const conditions = []
    let tempCondition = null

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue('member.' + personFields.FIRST_NAME, req.query.baptism_first_name, 'LIKE')
    conditions.push(tempCondition)

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue('member.' + personFields.MID_NAME, req.query.baptism_middle_name, 'LIKE')
    conditions.push(tempCondition)

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue('member.' + personFields.LAST_NAME, req.query.baptism_last_name, 'LIKE')
    conditions.push(tempCondition)

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue(db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.LOCATION, req.query.location, 'LIKE')
    conditions.push(tempCondition)
    // TODO: Add Officiant
    // TODO: Add Date Range

    db.find(db.tables.BAPTISMAL_TABLE, [], joinTables, columns, function (result) {
      const data = {}
      data.records = result
      data.scripts = ['convertDataTable']
      data.styles = ['lists']

      res.render('baptismal-main-page', data)
    })
  }
}

module.exports = searchController
