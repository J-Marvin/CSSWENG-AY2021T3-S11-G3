const path = require('path')

const churchFields = require(path.join(__dirname, '../models/church'))
const db = require(path.join(__dirname, '../models/db'))
const addressFields = require(path.join(__dirname, '../models/address'))
const { Condition, queryTypes } = require(path.join(__dirname, '../models/Condition'))

const churchController = {
  getChurchInfo: function (req, res) {
    const condition = new Condition(queryTypes.where)
    condition.setKeyValue(churchFields.ID, req.query.church_id)

    const joinTables = [
      {
        tableName: db.tables.ADDRESS_TABLE,
        sourceCol: db.tables.CHURCH_TABLE + '.' + churchFields.ADDRESS,
        destCol: db.tables.ADDRESS_TABLE + '.' + addressFields.ID
      }
    ]

    db.find(db.tables.CHURCH_TABLE, condition, joinTables, '*', function (result) {
      res.send(JSON.stringify(result))
    })
  },

  postAddChurch: function (req, res) {
    const church = {}
    const address = {}

    address[addressFields.ADDRESS_LINE] = req.body.address_line
    address[addressFields.ADDRESS_LINE2] = req.body.address_line2
    address[addressFields.CITY] = req.body.city
    address[addressFields.PROVINCE] = req.body.province
    address[addressFields.POSTAL_CODE] = req.body.postal_code
    address[addressFields.COUNTRY] = req.body.country

    church[churchFields.NAME] = req.body.church_name
    church[churchFields.MEMBER] = req.body.member_id

    console.log(church)
    console.log(address)
    db.insert(db.tables.ADDRESS_TABLE, address, function (result) {
      if (result) {
        church[churchFields.ADDRESS] = result[0]

        db.insert(db.tables.CHURCH_TABLE, church, function (result) {
          if (result) {
            church[churchFields.ID] = result[0]
            church.layout = false
            church[addressFields.ADDRESS_LINE] = req.body.address_line
            church[addressFields.ADDRESS_LINE2] = req.body.address_line2
            church[addressFields.CITY] = req.body.city
            church[addressFields.PROVINCE] = req.body.province
            church[addressFields.POSTAL_CODE] = req.body.postal_code
            church[addressFields.COUNTRY] = req.body.country
            res.render('partials/church', church, (err, html) => {
              if (err) {
                res.send(false)
              } else {
                res.send(html)
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

module.exports = churchController
