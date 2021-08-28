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

const searchController = {
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
        tableName: db.tables.PERSON_TABLE,
        sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.PERSON,
        destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
      },
      {
        tableName: db.tables.ADDRESS_TABLE,
        sourceCol: db.tables.MEMBER_TABLE + '.' + memberFields.ADDRESS,
        destCol: db.tables.ADDRESS_TABLE + '.' + addressFields.ID
      }
    ]
    const cond = new Condition(queryTypes.where)
    cond.setKeyValue()
    db.find(db.tables.MEMBER_TABLE, [], joinTables, '*', function (result) {
      // continue here
    })
    res.render('')
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
