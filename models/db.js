const sqlite3 = require('better-sqlite3')
const knex = require('knex')

// gettings fields of all tables
const memberFields = require('./members.js')
const addressFields = require('./address.js')
const accountFields = require('./accounts.js')
const personFields = require('./Person.js')
const donationFields = require('./donation.js')
const bapRegFields = require('./baptismalRegistry.js')
const weddingRegFields = require('./weddingRegistry.js')
const prenupRecordFields = require('./prenupRecord.js')
const witnessFields = require('./witness.js')
const infDedFields = require('./infantDedication.js')
const coupleFields = require('./Couple.js')

let knexClient = null

const tables = {
  MEMBER_TABLE: 'members',
  ADDRESS_TABLE: 'address',
  ACCOUNT_TABLE: 'accounts',
  PERSON_TABLE: 'people',
  DONATION_TABLE: 'donations',
  BAPTISMAL_TABLE: 'bap_reg',
  WEDDING_TABLE: 'wedding_reg',
  PRENUPTIAL_TABLE: 'pre_nuptial',
  WITNESS_TABLE: 'witness',
  INFANT_TABLE: 'inf_dedication',
  COUPLE_TABLE: 'couples'
}
const tableNames = Object.values(tables)

const fields = {
  members: Object.values(memberFields),
  address: Object.values(addressFields),
  accounts: Object.values(accountFields),
  people: Object.values(personFields),
  donations: Object.values(donationFields),
  bap_reg: Object.values(bapRegFields),
  wedding_reg: Object.values(weddingRegFields),
  pre_nuptial: Object.values(prenupRecordFields),
  witness: Object.values(witnessFields),
  inf_dedication: Object.values(infDedFields),
  couples: Object.values(coupleFields)
}

const database = {
  /**
   * This function initializes the database given the path of the file.
   * @param {string} file the path of the file to be opened
   */
  initDB: async function (file) {
    // opens the file and verbose prints the statements executed
    const db = sqlite3(file)
    const bcrypt = require('bcrypt')
    const saltRounds = 10

    // Initialize Knex connection
    knexClient = knex({
      client: 'sqlite3',
      connection: {
        filename: file
      },
      useNullAsDefault: true
    })

    /* This statement creates the Baptismal Registry table
       Fields:
       reg_id - primary id
       date - date of the baptism
       location - location of the baptism
       officiant - the officiant of the baptism
    */
    const createBapReg =
      'CREATE TABLE IF NOT EXISTS bap_reg (' +
        'reg_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'date TEXT, ' +
        'location TEXT, ' +
        'officiant TEXT' +
        ')'

    /* This statement creates the Infant Dedication table
       Fields:
       dedication_id - primary id
       person_id - an id referencing the person(infant)
       date - the date of the event
       place - the place of the event
       officiant - the officiant
       parents_id - an id referencing the parents(couple_id)
    */
    const createInfDedication =
      'CREATE TABLE IF NOT EXISTS inf_dedication (' +
        'dedication_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'person_id INTEGER NOT NULL, ' +
        'parents_id INTEGER, ' +
        'date TEXT, ' +
        'place TEXT, ' +
        'officiant TEXT,' +
        'FOREIGN KEY(person_id) REFERENCES people(person_id),' +
        'FOREIGN KEY(parents_id) REFERENCES couples(couple_id)' +
      ')'

    const createWitness =
      'CREATE TABLE IF NOT EXISTS witness (' +
        'witness_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'dedication_id INTEGER,' +
        'wedding_id INTEGER,' +
        'person_id INTEGER NOT NULL,' +
        'FOREIGN KEY(dedication_id) REFERENCES inf_dedication(dedication_id),' +
        'FOREIGN KEY(wedding_id) REFERENCES wedding_red(reg_id),' +
        'FOREIGN KEY(person_id) REFERENCES people(person_id)' +
      ')'

    const createAccounts =
    'CREATE TABLE IF NOT EXISTS accounts (' +
      'level TEXT NOT NULL PRIMARY KEY,' +
      'hashed_password TEXT' +
      ')'

    const createPreNuptial =
      'CREATE TABLE IF NOT EXISTS pre_nuptial (' +
        'record_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'couple_id INTEGER NOT NULL,' +
        'date TEXT,' +
        'date_of_wedding TEXT,' +
        'FOREIGN KEY(couple_id) REFERENCES couples(couple_id)' +
      ')'

    const createWeddingReg =
      'CREATE TABLE IF NOT EXISTS wedding_reg (' +
        'reg_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'prenup_record_id INTEGER NOT NULL,' +
        'bride_parents_id INTEGER,' +
        'groom_parents_id INTEGER,' +
        'date TEXT,' +
        'location TEXT, ' +
        'solemnizing_officer TEXT,' +
        'contract_no TEXT, ' +
        'contract_img BLOB,' +
        'FOREIGN KEY(prenup_record_id) REFERENCES pre_nuptial(record_id)' +
      ')'

    const createDonationRecord =
      'CREATE TABLE IF NOT EXISTS donatations (' +
        'donation_record_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'member_id INTEGER NOT NULL,' +
        'type TEXT, ' +
        'amount REAL, ' +
        'date TEXT,' +
        'FOREIGN KEY(member_id) REFERENCES members(member_id) ' +
      ')'

    const createAddress =
      'CREATE TABLE IF NOT EXISTS address (' +
        'address_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'street TEXT, ' +
        'barangay TEXT, ' +
        'city TEXT, ' +
        'province TEXT' +
      ')'

    const createMembers =
      'CREATE TABLE IF NOT EXISTS members (' +
        'member_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'address_id INTEGER,' +
        'bap_reg_id INTEGER,' +
        'wedding_reg_id INTEGER,' +
        'prenup_record_id INTEGER,' +
        'person_id INTEGER NOT NULL,' +
        'member_status TEXT,' +
        'civil_status TEXT,' +
        'age INTEGER,' +
        'birthday TEXT,' +
        'occupation TEXT,' +
        'workplace TEXT,' +
        'email TEXT,' +
        'mobile TEXT,' +
        'educ_attainment TEXT,' +
        'alma_mater TEXT,' +
        'FOREIGN KEY(address_id) REFERENCES address(address_id),' +
        'FOREIGN KEY(bap_reg_id) REFERENCES bap_reg(reg_id), ' +
        'FOREIGN KEY(wedding_reg_id) REFERENCES wedding_reg(reg_id),' +
        'FOREIGN KEY(prenup_record_id) REFERENCES pre_nuptial(record_id),' +
        'FOREIGN KEY(person_id) REFERENCES people(person_id)' +
      ')'

    const createPerson =
      'CREATE TABLE IF NOT EXISTS people(' +
        'person_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'member_id INTEGER,' +
        'first_name TEXT,' +
        'middle_name TEXT,' +
        'last_name TEXT,' +
        'FOREIGN KEY(member_id) references members(member_id)' +
      ')'

    const createCouple =
      'CREATE TABLE IF NOT EXISTS couples(' +
      'couple_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
      'FOREIGN KEY(female_id) REFERENCES people(person_id),' +
      'FOREIGN KEY(male_id) REFERENCES people(person_id)' +
      ')'

    // execute all statements
    db.prepare(createBapReg).run()
    db.prepare(createInfDedication).run()
    db.prepare(createWitness).run()
    db.prepare(createAccounts).run()
    db.prepare(createPreNuptial).run()
    db.prepare(createWeddingReg).run()
    db.prepare(createAddress).run()
    db.prepare(createMembers).run()
    db.prepare(createDonationRecord).run()
    db.prepare(createCouple).run()
    db.prepare(createPerson).run()

    // if the accounts table is empty then insert passwords
    knexClient('accounts').select().then(function (res) {
      if (res.length === 0) {
        bcrypt.hash('NormandyN7', saltRounds, (err, hash) => {
          if (err) {
            console.log(err)
          }
          knexClient('accounts').insert({
            level: 1,
            hashed_password: hash
          }).then(function (result) {
            console.log(result)
          }).catch(function (err) {
            console.log(err)
          })
        })
        bcrypt.hash('HelloSweng', saltRounds, (err, hash) => {
          if (err) {
            console.log(err)
          }

          knexClient('accounts').insert({
            level: 2,
            hashed_password: hash
          }).then(function (result) {
            console.log(result)
          }).catch(function (err) {
            console.log(err)
          })
        })
        bcrypt.hash('Coffee118', saltRounds, (err, hash) => {
          if (err) {
            console.log(err)
          }
          knexClient('accounts').insert({
            level: 3,
            hashed_password: hash
          }).then(function (result) {
            console.log(result)
          }).catch(function (err) {
            console.log(err)
          })
        })
      }
    })
    // close the connection to the db
    db.close()
  },

  /**
   * This function inserts the data into a specified table in the database and passes the result to the
   * callback function
   * @param {string} table - the table where the data will be added
   * @param {object} data  - the object containing the values paired to their respective column name
   * @param {function} callback - the function to be executed after inserting the data
   */
  insertOne: function (table, data, callback = null) {
    // if table is not in database
    if (!(tableNames.includes(table))) {
      const success = false
      callback(success)
    } else {
      for (const key in data) {
        if (fields[table].includes(key) && // if the key is a valid field
           (data[key] === null || data[key] === undefined)) {
          // if the value is valid
          delete data[key]
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

  /* TODO: FIX METHOD 
     what if query is an arry of objects where each object is 
     {
       query: "where, wherein ..."
       operator: "=", "<" ...
       field: "col"
       value: value 
     }
  */
  // find: function (table, query, projection, callback) {
  //   knexClient(table).select(projection). .then(function (result) {
  //     callback(result)
  //   }).catch((err) => {
  //     console.log(err)
  //     const flag = false
  //     callback(flag)
  //   })
  // },

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

  // make insert table to make code more reusable
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
   * @param {object} condition - the object containing the WHERE conditions paired to their respective column name
   */
  updateOne: function (table, data, condition, callback = null) {
    knexClient(table)
      .where(condition)
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
  },

  /**
   * This function deletes a row in a table specified by the provided condition and passes
   * a callback function
   * @param {string} table - refers to the table name where the row will be deleted
   * @param {object} condition - the object containing the WHERE conditions paired to their respective column name
   */
  deleteOne: function (table, condition, callback = null) {
    knexClient(table)
      .del(condition)
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
}

module.exports = database
