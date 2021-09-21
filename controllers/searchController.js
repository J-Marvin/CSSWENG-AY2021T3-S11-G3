const db = require('../models/db')
const { Condition, queryTypes } = require('../models/condition')
const addressFields = require('../models/address')
const bapRegFields = require('../models/baptismalRegistry')
const coupleFields = require('../models/couple')
const infDedFields = require('../models/infantDedication')
const memberFields = require('../models/members')
const personFields = require('../models/person')
const prenupRecordFields = require('../models/prenupRecord')
const weddingRegFields = require('../models/weddingRegistry')
const { sendError } = require('../controllers/errorController')
const { tables } = require('../models/db')
const moment = require('moment')
const helper = require('../helpers/helper')

const searchController = {
  /**
   * This function renders the advanced search page
   * @param req - the incoming request containing the query
   * @param res - the result to be sent out after processing the request
  */
  getAdvancedSearch: function (req, res) {
    const data = {}
    if (parseInt(req.session.level) === 2 || parseInt(req.session.level) === 3) {
      if (parseInt(req.session.level) === 2) {
        data.canSee = false // cannot see the member option type in advanced search
      } else if (parseInt(req.session.level) === 3) {
        data.canSee = true // can see the member option type in advanced search
      }
      data.scripts = ['advancedSearch']
      data.styles = ['forms']
      data.backLink = '/main_page'
      res.render('search-page', data)
    } else {
      sendError(req, res, 401, '401 Unauthorized Access')
    }
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
    if (ageFrom !== '' && ageTo !== '') {
      ageChecked = true
    } else {
      data.member.birthdayFrom = req.query.birthdayFrom
      data.member.birthdayTo = req.query.birthdayTo
    }

    data.member[memberFields.CIVIL_STATUS] = req.query.civil_status
    data.member[memberFields.EDUCATIONAL_ATTAINMENT] = req.query.educational_attainment
    data.member[memberFields.OCCUPATION] = req.query.occupation
    data.member[memberFields.MEMBER_STATUS] = req.query.membership_status
    data.member[memberFields.MEMBER_TYPE] = req.query.membership_type

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
    if (data.member[memberFields.SEX] !== 'none') {
      cond = new Condition(queryTypes.where)
      cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.SEX, data.member[memberFields.SEX], '=')
      conditions.push(cond)
    }
    const ageColumn = ['cast(strftime(\'%Y-%m-%d\', \'now\') - strftime(\'%Y-%m-%d\', ' + tables.MEMBER_TABLE + '.' + memberFields.BIRTHDAY + ') as int) AS age']

    // age is only provided
    if (ageChecked) {
      // age
      cond = new Condition(queryTypes.whereBetween)
      cond.setRange('age', parseInt(ageFrom), parseInt(ageTo))
      // havingCond.push(cond)
      conditions.push(cond)
    } else if (data.member.birthdayFrom !== '' && data.member.birthdayTo !== '') {
      // if age is not provided
      // birthday YYYY-MM-DD
      cond = new Condition(queryTypes.whereBetween)
      cond.setRange(memberFields.BIRTHDAY, helper.formatDate(data.member.birthdayFrom), helper.formatDateTomorrow(data.member.birthdayTo))
      conditions.push(cond)
    }

    // civil status
    if (data.member[memberFields.CIVIL_STATUS] === 'Others') {
      // where not civil_status = 'Single'
      cond = new Condition(queryTypes.whereNot)
      cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.CIVIL_STATUS, 'Single', '=')
      conditions.push(cond)
      // where not civil_status = 'Married'
      cond = new Condition(queryTypes.whereNot)
      cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.CIVIL_STATUS, 'Married', '=')
      conditions.push(cond)
    } else if (data.member[memberFields.CIVIL_STATUS] !== 'none') {
      cond = new Condition(queryTypes.where)
      cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.CIVIL_STATUS, data.member[memberFields.CIVIL_STATUS], '=')
      conditions.push(cond)
    }

    // educational attainment
    cond = new Condition(queryTypes.where)
    cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.EDUCATIONAL_ATTAINMENT, '%' + data.member[memberFields.EDUCATIONAL_ATTAINMENT] + '%', 'LIKE')
    conditions.push(cond)

    // occupation
    cond = new Condition(queryTypes.where)
    cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.OCCUPATION, '%' + data.member[memberFields.OCCUPATION] + '%', 'LIKE')
    conditions.push(cond)

    // member status
    if (data.member[memberFields.MEMBER_STATUS] !== 'none') {
      cond = new Condition(queryTypes.where)
      cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.MEMBER_STATUS, data.member[memberFields.MEMBER_STATUS], '=')
      conditions.push(cond)
    }

    if (data.member[memberFields.MEMBER_STATUS] !== 'Deceased' && data.member[memberFields.MEMBER_TYPE] !== 'Any') {
      cond = new Condition(queryTypes.where)
      cond.setKeyValue(db.tables.MEMBER_TABLE + '.' + memberFields.MEMBER_TYPE, data.member[memberFields.MEMBER_TYPE])
      conditions.push(cond)
    }
    db.find(db.tables.MEMBER_TABLE, conditions, joinTables, '*', function (result) {
      if (result) {
        const data = {
          styles: ['lists'],
          scripts: ['convertDataTable'],
          canSee: parseInt(req.session.level) === 3,
          backLink: '/advanced_search',
          fromSearch: true
        }

        result.forEach(function (member) {
          member.address = member[addressFields.ADDRESS_LINE] + ', ' + member[addressFields.CITY] + ', ' + member[addressFields.COUNTRY]
          member.age = moment().diff(moment(member[memberFields.BIRTHDAY]), 'years')
        })

        data.members = result
        res.render('member-main-page', data)
      }
    }, ageColumn)
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
        sourceCol: tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.COUPLE,
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
      db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.DATE + ' as date',
      db.tables.PRENUPTIAL_TABLE + '.' + prenupRecordFields.DATE_OF_WEDDING + ' as date_of_wedding',
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
      condition.setKeyValue('groom.' + personFields.FIRST_NAME, '%' + people.groom.first_name + '%', 'LIKE')
      conditions.push(condition)
    }

    // Groom Middle Name Condition
    if (people.groom.mid_name !== null && people.groom.mid_name !== '') {
      const condition = new Condition(queryTypes.where)
      condition.setKeyValue('groom.' + personFields.MID_NAME, '%' + people.groom.mid_name + '%', 'LIKE')
      conditions.push(condition)
    }

    // Groom Last Name Condition
    if (people.groom.last_name !== null && people.groom.last_name !== '') {
      const condition = new Condition(queryTypes.where)
      condition.setKeyValue('groom.' + personFields.LAST_NAME, '%' + people.groom.last_name + '%', 'LIKE')
      conditions.push(condition)
    }

    // Date Created Condition
    if (req.query.prenup_date_created_from !== '' && req.query.prenup_date_created_to !== '') {
      const start = helper.formatDate(req.query.prenup_date_created_from)
      const end = helper.formatDateTomorrow(req.query.prenup_date_created_to)

      const condition = new Condition(queryTypes.whereBetween)
      condition.setRange(prenupRecordFields.DATE, start, end)
      conditions.push(condition)
    }

    // Wedding Date Condition
    if (req.query.prenup_date_wedding_from !== '' && req.query.prenup_date_wedding_to !== '') {
      const start = helper.formatDate(req.query.prenup_date_wedding_from)
      const end = helper.formatDateTomorrow(req.query.prenup_date_wedding_to)

      const condition = new Condition(queryTypes.whereBetween)
      condition.setRange(prenupRecordFields.DATE_OF_WEDDING, start, end)
      conditions.push(condition)
    }

    db.find(tables.PRENUPTIAL_TABLE, conditions, joinTables, columns, function (result) {
      if (result) {
        res.render('prenup-main-page', {
          styles: ['lists'],
          scripts: ['convertDataTable'],
          prenup: result,
          backLink: '/advanced_search',
          fromSearch: true
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
    const joinTables = [
      // joins wedding_reg.couple_id = couples.couple_id
      {
        tableName: db.tables.COUPLE_TABLE,
        sourceCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.COUPLE,
        destCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID
      },
      // joins bride's person record
      {
        tableName: { bride: db.tables.PERSON_TABLE },
        sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
        destCol: 'bride.' + personFields.ID
      },
      // joins groom's person record
      {
        tableName: { groom: db.tables.PERSON_TABLE },
        sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
        destCol: 'groom.' + personFields.ID
      },
      // join bride parents
      {
        type: 'leftJoin',
        tableName: { bride_parents: db.tables.COUPLE_TABLE },
        sourceCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.BRIDE_PARENTS,
        destCol: 'bride_parents.' + coupleFields.ID
      },
      // join groom parents
      {
        type: 'leftJoin',
        tableName: { groom_parents: db.tables.COUPLE_TABLE },
        sourceCol: db.tables.WEDDING_TABLE + '.' + weddingRegFields.GROOM_PARENTS,
        destCol: 'groom_parents.' + coupleFields.ID
      },
      // bride_parents (mother)
      {
        type: 'leftJoin',
        tableName: { bride_mother: db.tables.PERSON_TABLE },
        sourceCol: 'bride_parents.' + coupleFields.FEMALE,
        destCol: 'bride_mother.' + personFields.ID
      },
      // bride_parents (father)
      {
        type: 'leftJoin',
        tableName: { bride_father: db.tables.PERSON_TABLE },
        sourceCol: 'bride_parents.' + coupleFields.MALE,
        destCol: 'bride_father.' + personFields.ID
      },
      // groom_parents (mother)
      {
        type: 'leftJoin',
        tableName: { groom_mother: db.tables.PERSON_TABLE },
        sourceCol: 'groom_parents.' + coupleFields.FEMALE,
        destCol: 'groom_mother.' + personFields.ID
      },
      // groom_parents (father)
      {
        type: 'leftJoin',
        tableName: { groom_father: db.tables.PERSON_TABLE },
        sourceCol: 'groom_parents.' + coupleFields.MALE,
        destCol: 'groom_father.' + personFields.ID
      }
    ]
    // columns to be retrieved
    const columns = [
      db.tables.WEDDING_TABLE + '.' + weddingRegFields.ID + ' as wedding_id',
      db.tables.WEDDING_TABLE + '.' + weddingRegFields.DATE_OF_WEDDING + ' as date_of_wedding',
      db.tables.WEDDING_TABLE + '.' + weddingRegFields.DATE + ' as date',
      // bride's name
      'bride.' + personFields.FIRST_NAME + ' as bride_first_name',
      'bride.' + personFields.MID_NAME + ' as bride_mid_name',
      'bride.' + personFields.LAST_NAME + ' as bride_last_name',
      // groom's name
      'groom.' + personFields.FIRST_NAME + ' as groom_first_name',
      'groom.' + personFields.MID_NAME + ' as groom_mid_name',
      'groom.' + personFields.LAST_NAME + ' as groom_last_name',
      // name of the bride's mother
      'bride_mother.' + personFields.FIRST_NAME + ' as bride_mother_first_name',
      'bride_mother.' + personFields.MID_NAME + ' as bride_mother_mid_name',
      'bride_mother.' + personFields.LAST_NAME + ' as bride_mother_last_name',
      // name of the bride's father
      'bride_father.' + personFields.FIRST_NAME + ' as bride_father_first_name',
      'bride_father.' + personFields.MID_NAME + ' as bride_father_mid_name',
      'bride_father.' + personFields.LAST_NAME + ' as bride_father_last_name',
      // name of the groom's mother
      'groom_mother.' + personFields.FIRST_NAME + ' as groom_mother_first_name',
      'groom_mother.' + personFields.MID_NAME + ' as groom_mother_mid_name',
      'groom_mother.' + personFields.LAST_NAME + ' as groom_mother_last_name',
      // name of the groom's father
      'groom_father.' + personFields.FIRST_NAME + ' as groom_father_first_name',
      'groom_father.' + personFields.MID_NAME + ' as groom_father_mid_name',
      'groom_father.' + personFields.LAST_NAME + ' as groom_father_last_name'
    ]

    const people = {
      bride: {
        first_name: req.query.wedding_bride_first_name,
        mid_name: req.query.wedding_bride_middle_name,
        last_name: req.query.wedding_bride_last_name
      },
      groom: {
        first_name: req.query.wedding_groom_first_name,
        mid_name: req.query.wedding_groom_middle_name,
        last_name: req.query.wedding_groom_last_name
      },
      bride_mother: {
        first_name: req.query.wedding_bride_mother_first_name,
        mid_name: req.query.wedding_bride_mother_middle_name,
        last_name: req.query.wedding_bride_mother_last_name
      },
      bride_father: {
        first_name: req.query.wedding_bride_father_first_name,
        mid_name: req.query.wedding_bride_father_middle_name,
        last_name: req.query.wedding_bride_father_last_name
      },
      groom_mother: {
        first_name: req.query.wedding_groom_mother_first_name,
        mid_name: req.query.wedding_groom_mother_middle_name,
        last_name: req.query.wedding_groom_mother_last_name
      },
      groom_father: {
        first_name: req.query.wedding_groom_father_first_name,
        mid_name: req.query.wedding_groom_father_middle_name,
        last_name: req.query.wedding_groom_father_last_name
      }
    }
    const conditions = []
    let tempCondition = null

    // Bride First Name Condition
    if (people.bride.first_name !== '') {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('bride.' + personFields.FIRST_NAME, '%' + people.bride.first_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Bride Middle Name Condition
    if (people.bride.mid_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('bride.' + personFields.MID_NAME, '%' + people.bride.mid_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Bride Last Name Condition
    if (people.bride.last_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('bride.' + personFields.LAST_NAME, '%' + people.bride.last_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Groom First Name Condition
    if (people.groom.first_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('groom.' + personFields.FIRST_NAME, '%' + people.groom.first_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Groom Middle Name Condition
    if (people.groom.mid_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('groom.' + personFields.MID_NAME, '%' + people.groom.mid_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Groom Last Name Condition
    if (people.groom.last_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('groom.' + personFields.LAST_NAME, '%' + people.groom.last_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Bride Mother First Name Condition
    if (people.bride_mother.first_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('bride_mother.' + personFields.FIRST_NAME, '%' + people.bride_mother.first_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Bride Mother Middle Name Condition
    if (people.bride_mother.mid_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('bride_mother.' + personFields.MID_NAME, '%' + people.bride_mother.mid_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Bride Mother Last Name Condition
    if (people.bride_mother.last_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('bride_mother.' + personFields.LAST_NAME, '%' + people.bride_mother.last_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Bride Father First Name Condition
    if (people.bride_father.first_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('bride_father.' + personFields.FIRST_NAME, '%' + people.bride_father.first_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Bride Father Middle Name Condition
    if (people.bride_father.mid_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('bride_father.' + personFields.MID_NAME, '%' + people.bride_father.mid_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Bride Father Last Name Condition
    if (people.bride_father.last_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('bride_father.' + personFields.LAST_NAME, '%' + people.bride_father.last_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Groom Mother First Name Condition
    if (people.groom_mother.first_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('groom_mother.' + personFields.FIRST_NAME, '%' + people.groom_mother.first_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Groom Mother Middle Name Condition
    if (people.groom_mother.mid_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('groom_mother.' + personFields.MID_NAME, '%' + people.groom_mother.mid_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Groom Mother Last Name Condition
    if (people.groom_mother.last_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('groom_mother.' + personFields.LAST_NAME, '%' + people.groom_mother.last_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Groom First Father Name Condition
    if (people.groom_father.first_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('groom_father.' + personFields.FIRST_NAME, '%' + people.groom_father.first_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Groom Middle Father Name Condition
    if (people.groom_father.mid_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('groom_father.' + personFields.MID_NAME, '%' + people.groom_father.mid_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Groom Last Father Name Condition
    if (people.groom_father.last_name) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('groom_father.' + personFields.LAST_NAME, '%' + people.groom_father.last_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Wedding Date Condition
    if (req.query.wedding_date_from !== '' && req.query.wedding_date_to !== '') {
      const start = helper.formatDate(req.query.wedding_date_from)
      const end = helper.formatDateTomorrow(req.query.wedding_date_to)

      const condition = new Condition(queryTypes.whereBetween)
      condition.setRange(weddingRegFields.DATE_OF_WEDDING, start, end)
      conditions.push(condition)
    }

    // Location Condition
    if (req.query.wedding_location) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue(tables.WEDDING_TABLE + '.' + weddingRegFields.LOCATION, '%' + req.query.wedding_location + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Wedding Officiant Condition
    if (req.query.wedding_officiant) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue(tables.WEDDING_TABLE + '.' + weddingRegFields.WEDDING_OFFICIANT, '%' + req.query.wedding_officiant + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Solemnizing Officer Condition
    if (req.query.wedding_officer) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue(tables.WEDDING_TABLE + '.' + weddingRegFields.SOLEMNIZER, '%' + req.query.wedding_officer + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // Registration Number Condition
    if (req.query.reg_num) {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue(tables.WEDDING_TABLE + '.' + weddingRegFields.CONTRACT, '%' + req.query.reg_num + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    db.find(db.tables.WEDDING_TABLE, conditions, joinTables, columns, function (result) {
      if (result) {
        
        res.render('wedding-main-page', {
          styles: ['lists'],
          scripts: ['convertDataTable'],
          prenup: result,
          backLink: '/advanced_search',
          fromSearch: true
        })
      } else {
        sendError(req, res, 404)
      }
    })
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
    const data = {
      infant: {
        first_name: req.query.dedication_first_name,
        middle_name: req.query.dedication_middle_name,
        last_name: req.query.dedication_last_name
      },
      guardianOne: {
        first_name: req.query.dedication_mother_first_name,
        middle_name: req.query.dedication_mother_middle_name,
        last_name: req.query.dedication_mother_last_name
      },
      guardianTwo: {
        first_name: req.query.dedication_father_first_name,
        middle_name: req.query.dedication_father_middle_name,
        last_name: req.query.dedication_father_last_name
      },
      dateFrom: req.query.dedication_date_from,
      dateTo: req.query.dedication_date_to,
      location: req.query.dedication_location,
      officiant: req.query.dedication_officiant
    }
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
      'guardianOne.' + personFields.ID + ' as guardianOne_person_id',
      'guardianOne.' + personFields.FIRST_NAME + ' as guardianOne_first_name',
      'guardianOne.' + personFields.MID_NAME + ' as guardianOne_mid_name',
      'guardianOne.' + personFields.LAST_NAME + ' as guardianOne_last_name',
      'guardianTwo.' + personFields.ID + ' as guardianTwo_person_id',
      'guardianTwo.' + personFields.FIRST_NAME + ' as guardianTwo_first_name',
      'guardianTwo.' + personFields.MID_NAME + ' as guardianTwo_mid_name',
      'guardianTwo.' + personFields.LAST_NAME + ' as guardianTwo_last_name',
      db.tables.INFANT_TABLE + '.' + infDedFields.DATE + ' as date'
    ]

    const conditions = []
    let tempCondition = null

    // infant's first name
    if (data.infant.first_name !== '') {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('infant.' + personFields.FIRST_NAME, '%' + data.infant.first_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // infant's middle name
    if (data.infant.middle_name !== '') {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('infant.' + personFields.MID_NAME, '%' + data.infant.middle_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // infant's last name
    if (data.infant.last_name !== '') {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue('infant.' + personFields.LAST_NAME, '%' + data.infant.last_name + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    if (data.guardianOne.first_name !== '' || data.guardianOne.middle_name !== '' || data.guardianOne.last_name !== '') {
      const guardianQuery = []
      guardianQuery.push('((')
      guardianQuery.push('guardianOne.' + personFields.FIRST_NAME + ' LIKE ' + '\'%' + data.guardianOne.first_name + '%\' AND ')
      guardianQuery.push('guardianOne.' + personFields.MID_NAME + ' LIKE ' + '\'%' + data.guardianOne.middle_name + '%\' AND ')
      guardianQuery.push('guardianOne.' + personFields.LAST_NAME + ' LIKE ' + '\'%' + data.guardianOne.last_name + '%\'')
      guardianQuery.push(') OR (')
      guardianQuery.push('guardianTwo.' + personFields.FIRST_NAME + ' LIKE ' + '\'%' + data.guardianOne.first_name + '%\' AND ')
      guardianQuery.push('guardianTwo.' + personFields.MID_NAME + ' LIKE ' + '\'%' + data.guardianOne.middle_name + '%\' AND ')
      guardianQuery.push('guardianTwo.' + personFields.LAST_NAME + ' LIKE ' + '\'%' + data.guardianOne.last_name + '%\'')
      guardianQuery.push('))')

      tempCondition = new Condition(queryTypes.whereRaw)
      tempCondition.setQuery(guardianQuery.join(''), [])
      conditions.push(tempCondition)
    }

    if (data.guardianTwo.first_name !== '' || data.guardianTwo.middle_name !== '' || data.guardianTwo.last_name !== '') {
      const guardianQuery = []
      guardianQuery.push('((')
      guardianQuery.push('guardianOne.' + personFields.FIRST_NAME + ' LIKE ' + '\'%' + data.guardianTwo.first_name + '%\'AND ')
      guardianQuery.push('guardianOne.' + personFields.MID_NAME + ' LIKE ' + '\'%' + data.guardianTwo.middle_name + '%\' AND ')
      guardianQuery.push('guardianOne.' + personFields.LAST_NAME + ' LIKE ' + '\'%' + data.guardianTwo.last_name + '%\'')
      guardianQuery.push(') OR (')
      guardianQuery.push('guardianTwo.' + personFields.FIRST_NAME + ' LIKE ' + '\'%' + data.guardianTwo.first_name + '%\' AND ')
      guardianQuery.push('guardianTwo.' + personFields.MID_NAME + ' LIKE ' + '\'%' + data.guardianTwo.middle_name + '%\' AND ')
      guardianQuery.push('guardianTwo.' + personFields.LAST_NAME + ' LIKE ' + '\'%' + data.guardianTwo.last_name + '%\'')
      guardianQuery.push('))')
      tempCondition = new Condition(queryTypes.whereRaw)
      tempCondition.setQuery(guardianQuery.join(''), [])
      conditions.push(tempCondition)
    }

    // location
    if (data.location !== '') {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue(db.tables.INFANT_TABLE + '.' + infDedFields.PLACE, '%' + data.location + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // officiant
    if (data.officiant !== '') {
      tempCondition = new Condition(queryTypes.where)
      tempCondition.setKeyValue(db.tables.INFANT_TABLE + '.' + infDedFields.OFFICIANT, '%' + data.officiant + '%', 'LIKE')
      conditions.push(tempCondition)
    }

    // dedication date range
    if (data.dateFrom !== '' && data.dateTo !== '') {
      const start = helper.formatDate(data.dateFrom)
      const end = helper.formatDateTomorrow(data.dateTo)

      tempCondition = new Condition(queryTypes.whereBetween)
      tempCondition.setRange(infDedFields.DEDICATION_DATE, start, end)
      conditions.push(tempCondition)
    }

    db.find(db.tables.INFANT_TABLE, conditions, joinTables, columns, function (result) {
      
      res.render('dedication-main-page', {
        styles: ['lists'],
        scripts: ['convertDataTable'],
        dedication: result,
        backLink: '/advanced_search',
        fromSearch: true
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
    tempCondition.setKeyValue('member.' + personFields.FIRST_NAME, '%' + req.query.baptism_first_name + '%', 'LIKE')
    conditions.push(tempCondition)

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue('member.' + personFields.MID_NAME, '%' + req.query.baptism_middle_name + '%', 'LIKE')
    conditions.push(tempCondition)

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue('member.' + personFields.LAST_NAME, '%' + req.query.baptism_last_name + '%', 'LIKE')
    conditions.push(tempCondition)

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue(db.tables.BAPTISMAL_TABLE + '.' + bapRegFields.LOCATION, '%' + req.query.baptismal_location + '%', 'LIKE')
    conditions.push(tempCondition)

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue('officiant.' + personFields.FIRST_NAME, '%' + req.query.baptism_officiant_first_name + '%', 'LIKE')
    conditions.push(tempCondition)

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue('officiant.' + personFields.MID_NAME, '%' + req.query.baptism_officiant_middle_name + '%', 'LIKE')
    conditions.push(tempCondition)

    tempCondition = new Condition(queryTypes.where)
    tempCondition.setKeyValue('officiant.' + personFields.LAST_NAME, '%' + req.query.baptism_officiant_last_name + '%', 'LIKE')
    conditions.push(tempCondition)

    if (req.query.baptismal_date_from !== '' && req.query.baptismal_date_to !== '') {
      const start = helper.formatDate(req.query.baptismal_date_from)
      const end = helper.formatDateTomorrow(req.query.baptismal_date_to)

      const condition = new Condition(queryTypes.whereBetween)
      condition.setRange(bapRegFields.DATE, start, end)
      conditions.push(condition)
    }

    db.find(db.tables.BAPTISMAL_TABLE, conditions, joinTables, columns, function (result) {
      const data = {}
      data.records = result
      data.scripts = ['convertDataTable']
      data.styles = ['lists']
      data.backLink = '/advanced_search'
      data.fromSearch = true

      res.render('baptismal-main-page', data)
    })
  }
}

module.exports = searchController
