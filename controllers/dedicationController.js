const db = require('../models/db')
const coupleFields = require('../models/couple')
const infDedFields = require('../models/infantDedication')
const personFields = require('../models/person')
const { Condition, queryTypes } = require('../models/condition')

const dedicationController = {
  /**
   * This function gets the dedication page
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getDedicationPage: function (req, res) {
    res.send('Temp')
  },
  /**
   * This function renders the view of a specific child dedication record
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  getViewDedication: function (req, res) {
    const dedicationId = req.params.dedication_id;
    if ((parseInt(req.session.level) >= 2) || (parseInt(req.session.dedicationId)) === dedicationId) {
      let data = {}
      /*
        infant_dedication tables needed: inf_dedication, couple, people
        SQL:
        SELECT *
        FROM inf_dedication
        JOIN couples ON couples.couple_id = inf_dedication.parents_id
        JOIN people ON people.person_id = inf_dedication.person_id
        WHERE inf_dedication.dedication_id = <dedication_id>;
      */
      const joinTables = [
        {
          tableName: db.tables.INFANT_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.ID,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      const cond1 = new Condition(queryTypes.where)
      cond1.setKeyValue(db.tables.INFANT_TABLE + '.' + infDedFields.ID, dedicationId)
      // father
      const joinTables2 = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.MALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      // mother
      const joinTables3 = [
        {
          tableName: db.tables.PERSON_TABLE,
          sourceCol: db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE,
          destCol: db.tables.PERSON_TABLE + '.' + personFields.ID
        }
      ]
      // All the fields needed here
      const columns = [
        // infant dedication table
        [
          db.tables.INFANT_TABLE + '.' + infDedFields.ID + ' as dedicationId',
          db.tables.INFANT_TABLE + '.' + infDedFields.PERSON + ' as personId',
          db.tables.INFANT_TABLE + '.' + infDedFields.PARENTS + ' as parentsId',
          db.tables.INFANT_TABLE + '.' + infDedFields.DATE + ' as date',
          db.tables.INFANT_TABLE + '.' + infDedFields.OFFICIANT + ' as officiant',
          db.tables.INFANT_TABLE + '.' + infDedFields.PLACE + ' as location',
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as firstName',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as middleName',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as lastName',
          db.tables.COUPLE_TABLE + '.' + coupleFields.MALE + ' as dadId',
          db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE + ' as momId'
        ],
        // getting the father's name
        [
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as dadFirst',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as dadMid',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as dadLast'
        ],
        // getting the mother's name
        [
          db.tables.PERSON_TABLE + '.' + personFields.FIRST_NAME + ' as momFirst',
          db.tables.PERSON_TABLE + '.' + personFields.MID_NAME + ' as momMid',
          db.tables.PERSON_TABLE + '.' + personFields.LAST_NAME + ' as momLast'
        ]
      ]
      db.find(db.tables.INFANT_TABLE, cond1, joinTables, columns[0], function (result) {
        if (result.length > 0) {
          data = {
            // spread syntax
            ...result[0]
          }
          // get father and mother's name
          const dadId = data.dadId
          const momId = data.momId
          const condFather = new Condition(queryTypes.where)
          condFather.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.MALE, dadId)
          const condMother = new Condition(queryTypes.where)
          condMother.setKeyValue(db.tables.COUPLE_TABLE + '.' + coupleFields.FEMALE, momId)
          // get dad
          db.find(db.tables.PERSON_TABLE, condFather, joinTables2, columns[1], function (result) {
            if (result.length > 0) {
              data.dadFather = result[0].dadFather
              data.dadMid = result[0].dadMid
              data.dadLast = result[0].dadLast
              // get mom
              db.find(db.tables.PERSON_TABLE, condFather, joinTables3, columns[2], function (result) {
                if (result.length > 0) {
                  data.momFather = result[0].momFather
                  data.momMid = result[0].momMid
                  data.momLast = result[0].momLast
                  // canSee is set to the edit button
                  data.canSee = (parseInt(req.session.dedicationId) === parseInt(dedicationId)) || (parseInt(req.session.level) >= 2)
                  if ((parseInt(req.session.level) <= 2)) {
                    data.canSee = false
                  }
                  data.styles = ['view']
                  data.backLink = parseInt(req.session.level) >= 2 ? '/forms_main_page' : '/main_page'
                  // res.render('view-dedication', data)
                  res.send(true)
                }
              })
            }
          })
        } else {
          res.status(401)
          res.render('error', {
            title: '404 Record Not Found',
            css: ['global', 'error'],
            status: {
              code: '401',
              message: 'Record Not Found'
            }
          })
        }
      })
    } else {
      res.status(401)
      res.render('error', {
        title: '401 Unauthorized Access',
        css: ['global', 'error'],
        status: {
          code: '401',
          message: 'Unauthorized access'
        }
      })
    }
  },
  /**
   * This function adds a child dedication record to the database
   * @param req - the incoming request containing either the query or body
   * @param res - the result to be sent out after processing the request
   */
  postAddDedication: function (req, res) {
    data = {}
    
  }
}

module.exports = dedicationController
