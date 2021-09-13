const churchFields = require('../models/church')
const db = require('../models/db')
const addressFields = require('../models/address')
const { Condition, queryTypes } = require('../models/condition')

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
  },

  delChurch: function (req, res) {
    const condition = new Condition(queryTypes.where)
    condition.setKeyValue(churchFields.ID, req.body.church_id)
    const addressCond = new Condition(queryTypes.where)
    addressCond.setKeyValue(addressFields.ID, req.body.address_id)

    db.delete(db.tables.CHURCH_TABLE, condition, function (result) {
      if (result) {
        db.delete(db.tables.ADDRESS_TABLE, addressCond, function (result) {
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
  },

  putUpdateChurch: function (req, res) {
    const church = {}
    const address = {}

    const churchCond = new Condition(queryTypes.where)
    const addressCond = new Condition(queryTypes.where)

    churchCond.setKeyValue(churchFields.ID, req.body.church_id)
    addressCond.setKeyValue(addressFields.ID, req.body.address_id)

    address[addressFields.ADDRESS_LINE] = req.body.address_line
    address[addressFields.ADDRESS_LINE2] = req.body.address_line2
    address[addressFields.CITY] = req.body.city
    address[addressFields.PROVINCE] = req.body.province
    address[addressFields.POSTAL_CODE] = req.body.postal_code
    address[addressFields.COUNTRY] = req.body.country

    church[churchFields.NAME] = req.body.church_name

    db.update(db.tables.CHURCH_TABLE, church, churchCond, function (result) {
      if (result) {
        db.update(db.tables.ADDRESS_TABLE, address, addressCond, function (result) {
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
  }
}

module.exports = churchController
