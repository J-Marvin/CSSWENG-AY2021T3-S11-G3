const knex = require('knex')
const async = require('async')
const fse = require('fs-extra')
const sqlite3 = require('better-sqlite3')
const { dbInfo } = require('./dbInfo')
const startIds = dbInfo.startIds
const bcrypt = require('bcrypt')
const saltRounds = 10
const data = require('./dummyData')
let currFile = null

let knexClient = null

const tables = dbInfo.tables
const tableNames = Object.values(tables)

const fields = {}
for (const table of tableNames) {
  const field = dbInfo.fields[table]
  fields[table] = Object.values(field)
}

function reset (file) {
  if (fse.existsSync(file)) {
    fse.remove(file, (err) => {
      if (err) {
        console.log(err)
      } else {
        initDatabase(file)
        insertData()
        insertAccounts()
      }
    })
  } else {
    initDatabase(file)
    insertData()
    insertAccounts()
  }
}

function initialize (file) {
  if (fse.existsSync(file)) {
    fse.remove(file, (err) => {
      if (err) {
        console.log(err)
      } else {
        initDatabase(file)
        insertAccounts()
      }
    })
  } else {
    initDatabase(file)
    insertAccounts()
  }
}

const database = {
  /**
   * This function initializes the database given the path of the file.
   * @param {string} file the path of the file to be opened
   */
  initDB: async function (file) {
    currFile = file
    if (!fse.existsSync(file)) {
      // reset(file)
      initialize(file)
    } else {
      knexClient = knex({
        client: 'sqlite3',
        connection: {
          filename: file
        },
        useNullAsDefault: true
      })

      knexClient.raw('PRAGMA foreign_keys = ON')
    }
  },

  /**
   * This function inserts the data into a specified table in the database and passes the result to the
   * callback function
   * @param {string} table - the table where the data will be added
   * @param {object} data  - the object containing the values paired to their respective column name / can also be an array of objects
   * @param {function} callback - the function to be executed after inserting the data
   */
  insert: function (table, data, callback = null) {
    // if table is not in database
    if (data === null || (Array.isArray(data) && data.length === 0)) {
      const result = []
      callback(result)
    } else {
      if (!(tableNames.includes(table))) {
        const success = false
        callback(success)
      } else {
        if (Array.isArray(data)) {
          data.forEach((record) => {
            for (const key in record) {
              if (fields[table].includes(key) && // if the key is a valid field
                (data[key] === null || data[key] === undefined)) {
                // if the value is valid
                delete data[key]
              }
            }
          })
        } else {
          for (const key in data) {
            if (fields[table].includes(key) && // if the key is a valid field
               (data[key] === null || data[key] === undefined)) {
              // if the value is valid
              delete data[key]
            }
          }
        }

        knexClient(table)
          .insert(data) // insert data
          .then(function (result) {
            if (callback !== null) {
              callback(result) // if there is a callback function return id of inserted row
            }
          }).catch(function (err) {
            console.log(err)
            if (callback !== null) {
              const flag = false
              callback(flag) // pass false to the callback function where an error occurred
            }
          })
      }
    }
  },

  /**
   * This method finds all the records in a table given some conditions
   * @param {String} table - the name of the table
   * @param {Array<Condition>} conditions - an array of objects containing the WHERE conditions paired to their respective column name
   * @param {Array<Object>} join - an array of objects containing the join conditions
   * @param {String} projection - the columns to be retrieved
   * @param {function} callback - the callback function
   * @param {Array<String>} - an array of raw select statements
   */
  find: function (table, conditions = null, join = null, projection = '*', callback, rawSelect = []) {
    const tableClient = knexClient(table)
    if (join !== null) {
      if (!Array.isArray(join)) {
        join = [join]
      }

      for (const joinTable of join) {
        switch (joinTable.type) {
          case 'innerJoin':
            tableClient.innerJoin(joinTable.tableName, joinTable.sourceCol, joinTable.destCol)
            break
          case 'leftJoin':
            tableClient.leftJoin(joinTable.tableName, joinTable.sourceCol, joinTable.destCol)
            break
          case 'leftOuterJoin':
            tableClient.leftOuterJoin(joinTable.tableName, joinTable.sourceCol, joinTable.destCol)
            break
          case 'rightJoin':
            tableClient.rightJoin(joinTable.tableName, joinTable.sourceCol, joinTable.destCol)
            break
          case 'rightOuterJoin':
            tableClient.rightOuterJoin(joinTable.tableName, joinTable.sourceCol, joinTable.destCol)
            break
          case 'fullOuterJoin':
            tableClient.fullOuterJoin(joinTable.tableName, joinTable.sourceCol, joinTable.destCol)
            break
          case 'crossJoin':
            tableClient.crossJoin(joinTable.tableName, joinTable.sourceCol, joinTable.destCol)
            break
          case 'join':
          default:
            tableClient.join(joinTable.tableName, joinTable.sourceCol, joinTable.destCol)
        }
      }
    }

    tableClient
      .select(projection)

    for (const select of rawSelect) {
      tableClient.select(knexClient.raw(select))
    }

    tableClient.where(function (builder) {
      if (conditions !== null && conditions !== undefined) {
        if (!Array.isArray(conditions)) {
          conditions = [conditions]
        }
        async.each(conditions, function (condition, callback) {
          switch (condition.type) {
            case 'where':
              if (condition.conditionType === 'object') {
                builder.where(condition.condition)
              } else if (condition.conditionType === 'keyValue') {
                builder.where(condition.condition.key, condition.condition.operator, condition.condition.value)
              }
              break
            case 'orWhere':
              if (condition.conditionType === 'object') {
                builder.orWhere(condition.condition)
              } else if (condition.conditionType === 'keyValue') {
                builder.orWhere(condition.condition.key, condition.condition.operator, condition.condition.value)
              }
              break
            case 'whereNot':
              if (condition.conditionType === 'object') {
                builder.whereNot(condition.condition)
              } else if (condition.conditionType === 'keyValue') {
                builder.whereNot(condition.condition.key, condition.condition.operator, condition.condition.value)
              }
              break
            case 'whereIn':
              if (condition.conditionType === 'array') {
                builder.whereIn(condition.field, condition.data)
              }
              break
            case 'whereNotIn':
              if (condition.conditionType === 'array') {
                builder.whereNotIn(condition.field, condition.data)
              }
              break
            case 'whereNull':
              if (condition.conditionType === 'field') {
                builder.whereNull(condition.field)
              }
              break
            case 'whereNotNull':
              if (condition.conditionType === 'field') {
                builder.whereNotNull(condition.field)
              }
              break
            case 'whereBetween':
              if (condition.conditionType === 'range') {
                builder.whereBetween(condition.condition.field, [condition.condition.lowerBound, condition.condition.upperBound])
              }
              break
            case 'whereNotBetween':
              if (condition.conditionType === 'range') {
                builder.whereNotBetween(condition.condition.field, [condition.condition.lowerBound, condition.condition.upperBound])
              }
              break
            case 'whereRaw':
              if (condition.conditionType === 'query') {
                builder.whereRaw(condition.query, condition.bindings)
              }
              break
            default:
              throw console.error('Unknown query')
          }
        })
      }
    }).then(function (result) {
      callback(result)
    }).catch((err) => {
      console.log(err)
      const flag = false
      callback(flag)
    })
  },

  /**
   * This method gets all the records of a table
   * @param {String} table this is the name of the table
   * @param {String} projection the columns/fields to be retrieved
   * @param {function} callback this is the callback funciton to be called after getting the result
   */
  findAll: function (table, projection, callback) {
    knexClient(table).select(projection).then(function (result) {
      callback(result)
    }).catch((err) => {
      console.log(err)
      const flag = false
      callback(flag)
    })
  },

  /*
    This table is a constant object containing the constant strings
    of the tables
  */
  tables: tables,

  /**
   * This function creates a new table specified by the param object newTable and
   * passes a callback function after execution
   * @param {string} newTable - the table name to be created
   * @param {array} columns - the array of strings containing column names
   *                      e.g. columns = ['name', 'age', 'city']
   * @param {object} types - the object containing the data types paired to the columns array
   *                      e.g. types = {name: 'string', age: 'integer', city: 'string'}
   */
  createTable: function (newTable, columns, types, callback = null) {
    knexClient.schema.createTable(newTable, function (table) {
      table.increments()
      // traverses to columns array
      for (let i = 0; i < columns.length; i++) {
        // determines the data type using a switch
        switch (types[columns[i]]) {
          // each case corresponds to what data type function to use
          case 'string':
            table.string(columns[i])
            break
          case 'integer':
            table.integer(columns[i])
            break
          case 'date':
            table.date(columns[i])
            break
          case 'boolean':
            table.boolean(columns[i])
            break
          case 'float':
          case 'decimal':
            table.decimal(columns[i])
            break
        }
      }
      table.timestamps()
    })
      .then(function (result) {
        tableNames.push(newTable)
        fields[tableNames] = []

        for (const col in columns) {
          fields[tableNames].push(col)
        }

        if (callback !== null) { // if there is a callback function return id of inserted row
          callback(result)
        }
      }).catch(function (err) {
        console.log(err)
        if (callback !== null) {
          const flag = false
          callback(flag) // pass false to the callback function where an error occurred
        }
      })
  },

  /**
   * This function updates a data into a specified table based on the object data and
   * condition, afterwards it passes the callback function
   * @param {string} table - refers to the table name where the data will be updated onto a row
   * @param {object} data - the object containing the values paired to their respective column name
   * @param {Array<Conditions>} condition - an array of objects containing the WHERE conditions paired to their respective column name
   */
  update: function (table, data, conditions, callback = null) {
    if (data && Object.keys(data).length === 0) {
      if (callback) {
        const result = 0
        callback(result)
      }
    } else {
      knexClient(table)
        .where(function (builder) {
          if (conditions !== null && conditions !== undefined) {
            if (!Array.isArray(conditions)) {
              conditions = [conditions]
            }
            async.each(conditions, function (condition, callback) {
              switch (condition.type) {
                case 'where':
                  if (condition.conditionType === 'object') {
                    builder.where(condition.condition)
                  } else if (condition.conditionType === 'keyValue') {
                    builder.where(condition.condition.key, condition.condition.operator, condition.condition.value)
                  }
                  break
                case 'orWhere':
                  if (condition.conditionType === 'object') {
                    builder.orWhere(condition.condition)
                  } else if (condition.conditionType === 'keyValue') {
                    builder.orWhere(condition.condition.key, condition.condition.operator, condition.condition.value)
                  }
                  break
                case 'whereNot':
                  if (condition.conditionType === 'object') {
                    builder.whereNot(condition.condition)
                  } else if (condition.conditionType === 'keyValue') {
                    builder.whereNot(condition.condition.key, condition.condition.operator, condition.condition.value)
                  }
                  break
                case 'whereIn':
                  if (condition.conditionType === 'array') {
                    builder.whereIn(condition.field, condition.data)
                  }
                  break
                case 'whereNotIn':
                  if (condition.conditionType === 'array') {
                    builder.whereNotIn(condition.field, condition.data)
                  }
                  break
                case 'whereNull':
                  if (condition.conditionType === 'field') {
                    builder.whereNull(condition.field)
                  }
                  break
                case 'whereNotNull':
                  if (condition.conditionType === 'field') {
                    builder.whereNotNull(condition.field)
                  }
                  break
                case 'whereBetween':
                  if (condition.conditionType === 'range') {
                    builder.whereBetween(condition.condition.field, [condition.condition.lowerBound, condition.condition.upperBound])
                  }
                  break
                case 'whereNotBetween':
                  if (condition.conditionType === 'range') {
                    builder.whereNotBetween(condition.condition.field, [condition.condition.lowerBound, condition.condition.upperBound])
                  }
                  break
                case 'whereRaw':
                  if (condition.conditionType === 'query') {
                    builder.whereRaw(condition.query, condition.bindings)
                  }
                  break
                default:
                  throw console.error('Unknown query')
              }
            })
          }
        })
        .update(data)
        .then(function (result) {
          if (callback !== null) { // if there is a callback function return id of inserted row
            callback(result)
          }
        }).catch(function (err) {
          console.log(err)
          if (callback !== null) {
            const flag = false
            callback(flag) // pass false to the callback function where an error occurred
          }
        })
    }
  },

  /**
   * This function deletes a row in a table specified by the provided conditions and passes
   * a callback function
   * @param {string} table - refers to the table name where the row will be deleted
   * @param {Array<Condition>} conditions - an array of objects containing the WHERE conditions paired to their respective column name
   */
  delete: function (table, conditions, callback = null) {
    knexClient(table)
      .where(function (builder) {
        if (conditions !== null && conditions !== undefined) {
          if (!Array.isArray(conditions)) {
            conditions = [conditions]
          }
          async.each(conditions, function (condition, callback) {
            switch (condition.type) {
              case 'where':
                if (condition.conditionType === 'object') {
                  builder.where(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.where(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'orWhere':
                if (condition.conditionType === 'object') {
                  builder.orWhere(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.orWhere(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNot':
                if (condition.conditionType === 'object') {
                  builder.whereNot(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNot(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereIn':
                if (condition.conditionType === 'array') {
                  builder.whereIn(condition.field, condition.data)
                }
                break
              case 'whereNotIn':
                if (condition.conditionType === 'array') {
                  builder.whereNotIn(condition.field, condition.data)
                }
                break
              case 'whereNull':
                if (condition.conditionType === 'field') {
                  builder.whereNull(condition.field)
                }
                break
              case 'whereNotNull':
                if (condition.conditionType === 'field') {
                  builder.whereNotNull(condition.field)
                }
                break
              case 'whereBetween':
                if (condition.conditionType === 'range') {
                  builder.whereBetween(condition.condition.field, [condition.condition.lowerBound, condition.condition.upperBound])
                }
                break
              case 'whereNotBetween':
                if (condition.conditionType === 'range') {
                  builder.whereNotBetween(condition.condition.field, [condition.condition.lowerBound, condition.condition.upperBound])
                }
                break
              case 'whereRaw':
                if (condition.conditionType === 'query') {
                  builder.whereRaw(condition.query, condition.bindings)
                }
                break
              default:
                throw console.error('Unknown query')
            }
          })
        }
      })
      .del()
      .then(function (result) {
        if (callback !== null) { // if there is a callback function return id of inserted row
          callback(result)
        }
      }).catch(function (err) {
        console.log(err)
        if (callback !== null) {
          const flag = false
          callback(flag) // pass false to the callback function where an error occurred
        }
      })
  },
  /**
   * This function turns off foreign key constraints
   */
  pragmaFK: function (flag) {
    const path = require('path')
    const file = path.join('database', 'church.db')
    const db = sqlite3(file)
    if (!flag) {
      db.pragma('foreign_keys = OFF')
    } else {
      db.pragma('foreign_keys = ON')
    }
    db.close()
  },
  /**
   * This method executes a single sqlite statement
   * @param {String} stmt the sqlite statement to be executed
   * @param {Object} params the object containing the parameters of the statement
   * @param {Function} callback the function to be called after executing the statement
   */
  executeRaw: function (stmt, params = null, callback = null) {
    const client = sqlite3(currFile)

    try {
      const prepdStmt = client.prepare(stmt)

      if (params === null) {
        const result = prepdStmt.run()
        client.close()
        if (callback) {
          callback(result)
        }
      } else {
        const result = prepdStmt.run(params)
        client.close()
        if (callback) {
          callback(result)
        }
      }
    } catch (err) {
      if (err) {
        const flag = false
        if (callback) {
          callback(flag)
        }
      }
    }
  },

  pragmaFKKnex: function (flag, callback) {
    if (flag) {
      knexClient.raw('PRAGMA foreign_keys = ON').then(() => {
        if (callback) {
          callback()
        }
      })
    } else {
      knexClient.raw('PRAGMA foreign_keys = OFF').then(() => {
        if (callback) {
          callback()
        }
      })
    }
  },

  /**
   *  This method backups the current database
   * @param {String} backupFile the path for the backup file
   * @param {Function} callback the function to be called after executing the statement
   */
  backup: function (backupFile, callback = null) {
    const db = sqlite3(currFile)
    db.backup(backupFile)
      .then(function () {
        const isSuccess = true
        if (callback !== null) {
          callback(isSuccess)
        }
      })
      .catch((err) => {
        if (err) {
          const isSuccess = false
          if (callback !== null) {
            callback(isSuccess)
          }
        }
      })
  },

  /**
   * This function deletes all records except the accounts in the database
   */
  deleteAndReset: function () {
    const path = require('path')
    const file = path.join('database', 'church.db')
    const db = sqlite3(file)

    db.pragma('foreign_keys = OFF')
    let stmt = db.prepare('DELETE FROM bap_reg')
    stmt.run()

    stmt = db.prepare('DELETE FROM inf_dedication')
    stmt.run()

    stmt = db.prepare('DELETE FROM witness')
    stmt.run()

    stmt = db.prepare('DELETE FROM pre_nuptial')
    stmt.run()

    stmt = db.prepare('DELETE FROM wedding_reg')
    stmt.run()

    stmt = db.prepare('DELETE FROM donations')
    stmt.run()

    stmt = db.prepare('DELETE FROM address')
    stmt.run()

    stmt = db.prepare('DELETE FROM members')
    stmt.run()

    stmt = db.prepare('DELETE FROM people')
    stmt.run()

    stmt = db.prepare('DELETE FROM couples')
    stmt.run()

    stmt = db.prepare('DELETE FROM observations')
    stmt.run()

    stmt = db.prepare('DELETE FROM churches')
    stmt.run()

    db.pragma('foreign_keys = ON')
    db.close()
  }
}

function initDatabase (file) {
  const db = sqlite3(file)

  // Initialize Knex connection
  knexClient = knex({
    client: 'sqlite3',
    connection: {
      filename: file
    },
    useNullAsDefault: true
  })

  startIds.forEach((record) => {
    knexClient('sqlite_sequence').insert({
      name: record.table,
      seq: record.start
    }).catch((err) => { console.log(err) })
  })

  // execute all statements
  for (const stmt of Object.values(dbInfo.create)) {
    db.prepare(stmt).run()
  }
  // close the connection to the db
  db.close()
}

function insertAccounts (level1 = 'NormandyN7', level2 = 'HelloSweng', level3 = 'Coffee118') {
  knexClient('accounts').select().then(function (res) {
    if (res.length === 0) {
      bcrypt.hash(level1, saltRounds, (err, hash) => {
        if (err) {
          console.log(err)
        }
        knexClient('accounts').insert({
          level: 1,
          hashed_password: hash
        }).catch(function (err) {
          console.log(err)
        })
      })
      bcrypt.hash(level2, saltRounds, (err, hash) => {
        if (err) {
          console.log(err)
        }

        knexClient('accounts').insert({
          level: 2,
          hashed_password: hash
        }).catch(function (err) {
          console.log(err)
        })
      })
      bcrypt.hash(level3, saltRounds, (err, hash) => {
        if (err) {
          console.log(err)
        }
        knexClient('accounts').insert({
          level: 3,
          hashed_password: hash
        }).catch(function (err) {
          console.log(err)
        })
      })
    }
  })
}

function insertData () {
  // insert accounts
  data.forEach((record) => {
    knexClient('people').insert(record.person).then((person) => {
      if (person) {
        record.member.person_id = person[0]

        knexClient('address').insert(record.address).then((address) => {
          if (address) {
            record.member.address_id = address[0]
            knexClient('members').insert(record.member).then((result) => {
              if (result) {
                knexClient('people').where('person_id', '=', record.member.person_id).update({
                  member_id: result[0]
                }).then((result) => {
                  if (result) {
                    console.log('Filled up database with dummy data')
                  }
                })
              } else {
                console.log(result)
              }
            })
          } else {
            console.log(address)
          }
        })
      } else {
        console.log(person)
      }
    })
  })
}

module.exports = database
