const db = require('../models/db.js')
const personFields = require('../models/person')

const controller = {
  getIndex: async function (req, res) {
    const data = {
    }
    data[personFields.FIRST_NAME] = 'Jan Marvin'
    data[personFields.LAST_NAME] = 'Lim'

    db.insertOne(db.tables.PERSON_TABLE, data, function (result) {
      console.log(result)
      res.render('index')
    })
  }
}

module.exports = controller
