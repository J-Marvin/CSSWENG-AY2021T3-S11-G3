const sqlite3 = require('better-sqlite3')
const knex = require('knex')
const async = require('async')
const path = require('path')

// gettings fields of all tables
const memberFields = require(path.join(__dirname, './members.js'))
const addressFields = require(path.join(__dirname, './address.js'))
const accountFields = require(path.join(__dirname, './accounts.js'))
const personFields = require(path.join(__dirname, './Person.js'))
const donationFields = require(path.join(__dirname, './donation.js'))
const bapRegFields = require(path.join(__dirname, './baptismalRegistry.js'))
const weddingRegFields = require(path.join(__dirname, './weddingRegistry.js'))
const prenupRecordFields = require(path.join(__dirname, './prenupRecord.js'))
const witnessFields = require(path.join(__dirname, './witness.js'))
const infDedFields = require(path.join(__dirname, './infantDedication.js'))
const coupleFields = require(path.join(__dirname, './Couple.js'))
const observationFields = require(path.join(__dirname, './observation.js'))

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
  COUPLE_TABLE: 'couples',
  OBSERVATION_TABLE: 'observations'
}
const tableNames = Object.values(tables)

const startIds = [
  { table: 'members', start: 1000000 },
  { table: 'address', start: 2000000 },
  { table: 'accounts', start: 0 },
  { table: 'people', start: 11000000 },
  { table: 'donations', start: 8000000 },
  { table: 'bap_reg', start: 3000000 },
  { table: 'wedding_reg', start: 5000000 },
  { table: 'pre_nuptial', start: 4000000 },
  { table: 'witness', start: 6000000 },
  { table: 'inf_dedication', start: 7000000 },
  { table: 'couples', start: 10000000 },
  { table: 'observations', start: 9000000 }
]

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
  couples: Object.values(coupleFields),
  observations: Object.values(observationFields)
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

    /* This statement creates the Witness table
       Fields:
       witness_id - primary id
       dedication_id - the dedication id of the dedication the witness attended
       wedding_id - the wedding id of the wedding the witness attended
       person_id - the id of the witness' personal information
    */
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

    /* This statement creates the Accounts table
        Fields:
        level - the level of access (1 - highest, 3 - lowest)
        hashed_password - the hashed password
      */
    const createAccounts =
    'CREATE TABLE IF NOT EXISTS accounts (' +
      'level TEXT NOT NULL PRIMARY KEY,' +
      'hashed_password TEXT' +
      ')'

    /* This statement creates the Prenuptial Registry table
       Fields:
       record_id - primary id
       couple_id - the id of the couple being married
       date - the date of the record
       date_of_wedding - the actual date of the wedding
     */
    const createPreNuptial =
      'CREATE TABLE IF NOT EXISTS pre_nuptial (' +
        'record_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'couple_id INTEGER NOT NULL,' +
        'date TEXT,' +
        'date_of_wedding TEXT,' +
        'FOREIGN KEY(couple_id) REFERENCES couples(couple_id)' +
      ')'

    /* This statement creates the Wedding Registry table
       Fields:
       reg_id - primary id
       prenup_record_id - the id of the prenuptial record of the wedding
       bride_parents_id - the id of the parents of the bride
       groom_parents_id - the id of the parents of the groom
       date - the date of the wedding
       location - the location of the wedding
       solemnizing_officer - the solemnizer of the wedding
       contract_no - the contract no of the marriage contract
       contract_img - the image of the wedding certificate
     */
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

    /* This statement creates the Donation Record table
       Fields:
       donation_record_id - primary id
       member_id - the id of the member who gave the donation
       type - the type of donation
       amount - the amount of the donation
       date - the date the donation was given
     */
    const createDonationRecord =
      'CREATE TABLE IF NOT EXISTS donations (' +
        'donation_record_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'member_id INTEGER NOT NULL,' +
        'type TEXT, ' +
        'amount REAL, ' +
        'date TEXT,' +
        'FOREIGN KEY(member_id) REFERENCES members(member_id) ' +
      ')'

    /* This statement creates the Address table
       Fields:
       address_id - primary id
       address_line - the address line
       barangay - the barangay
       city - the city
       province - the province
    */
    const createAddress =
      'CREATE TABLE IF NOT EXISTS address (' +
        'address_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'address_line TEXT, ' +
        'barangay TEXT, ' +
        'city TEXT, ' +
        'province TEXT' +
      ')'

    /* This statement creates the Members table
       Fields:
       member_id - primary id
       address_id - the id of the address
       bap_reg_id - the id of the baptismal registry
       wedding_reg_id - the id of the wedding registry
       prenup_record_id - the id of the prenuptial record
       person_id - the id of the person
       member_status - the status of the member
       civil_status - the civil status of the member
       age - the age of the member
       birthday - the birthday of the member
       occupation - the occupation of the member
       workplace - the workplace of the member
       email - the email of the member
       telephone - the telephone number of the member
       mobile - the mobile of the member
       educ_attainment - the highest educational attainment of the member
       alma_mater - the alma mater of the member
       skills - the list of skills this member has
       date_created - the date when the profile was created
       sex - the sex of the member
       churches - the previous churches the member has attended
       parents_id - the id of the parents of the member
    */
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
        'telephone TEXT,' +
        'mobile TEXT,' +
        'educ_attainment TEXT,' +
        'alma_mater TEXT,' +
        'skills TEXT,' +
        'date_created TEXT,' +
        'sex TEXT,' +
        'churches TEXT,' +
        'parents_id INTEGER,' +
        'FOREIGN KEY(address_id) REFERENCES address(address_id),' +
        'FOREIGN KEY(bap_reg_id) REFERENCES bap_reg(reg_id), ' +
        'FOREIGN KEY(wedding_reg_id) REFERENCES wedding_reg(reg_id),' +
        'FOREIGN KEY(prenup_record_id) REFERENCES pre_nuptial(record_id),' +
        'FOREIGN KEY(parents_id) REFERENCES couple(couple_id),' +
        'FOREIGN KEY(person_id) REFERENCES people(person_id)' +
      ')'

    /* This statement creates the Person table
       Fields:
        person_id - the primary id
        member_id - the id of the member associated with the record
        first_name - the first name of the person
        middle_name - the middle name of the person
        last_name - the last name of the person
     */
    const createPerson =
      'CREATE TABLE IF NOT EXISTS people(' +
        'person_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'member_id INTEGER,' +
        'first_name TEXT,' +
        'middle_name TEXT,' +
        'last_name TEXT,' +
        'FOREIGN KEY(member_id) references members(member_id)' +
      ')'

    /* This statement creates the couple table
       Fields:
       couple_id - the primary id
       female_id - the id of the female in the couple
       male_id - the id of the male in the couple
     */
    const createCouple =
      'CREATE TABLE IF NOT EXISTS couples(' +
      'couple_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
      'female_id INTEGER,' +
      'male_id INTEGER,' +
      'FOREIGN KEY(female_id) REFERENCES people(person_id),' +
      'FOREIGN KEY(male_id) REFERENCES people(person_id)' +
      ')'

    /* This statement creates the Observations table
       Fields:
       observation_id - the primary id
       comment - the comment on the member
       observee_id - the id of the member being observed
       observer_id - the person of the person observing
     */
    const createObservations =
      'CREATE TABLE IF NOT EXISTS observations(' +
      'observation_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
      'comment TEXT NOT NULL,' +
      'observee_id INTEGER NOT NULL,' +
      'observer TEXT,' +
      'FOREIGN KEY(observee_id) REFERENCES members(member_id)' +
      ')'

    knexClient('sqlite_sequence').select().then((result) => {
      startIds.forEach((record) => {
        if (!result.includes(record.table)) {
          knexClient('sqlite_sequence').insert({
            name: record.table,
            seq: record.start
          }).catch((err) => { console.log(err) })
        }
      })
    })

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
    db.prepare(createObservations).run()

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
   * @param {object} data  - the object containing the values paired to their respective column name / can also be an array of objects
   * @param {function} callback - the function to be executed after inserting the data
   */
  insert: function (table, data, callback = null) {
    // if table is not in database
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
  },

  /**
   * This method finds all the records in a table given some conditions
   * @param {String} table - the name of the table
   * @param {Array<Condition>} conditions - an array of objects containing the WHERE conditions paired to their respective column name
   * @param {Array<Object>} join - an array of objects containing the join conditions
   * @param {String} projection - the columns to be retrieved
   * @param {function} callback - the callback function
   */
  find: function (table, conditions = null, join = null, projection = '*', callback) {
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
                if (condition.conditionType === 'object') {
                  builder.whereIn(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereIn(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNotNull':
                if (condition.conditionType === 'object') {
                  builder.whereNotNull(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNotNull(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereExists':
                if (condition.conditionType === 'object') {
                  builder.whereExists(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereExists(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNotExists':
                if (condition.conditionType === 'object') {
                  builder.whereNotExists(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNotExists(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereBetween':
                if (condition.conditionType === 'object') {
                  builder.whereBetween(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereBetween(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNotBetween':
                if (condition.conditionType === 'object') {
                  builder.whereNotBetween(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNotBetween(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereRaw':
                if (condition.conditionType === 'object') {
                  builder.whereRaw(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereRaw(condition.condition.key, condition.condition.operator, condition.condition.value)
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
   * @param {Array<Conditions>} condition - an array of objects containing the WHERE conditions paired to their respective column name
   */
  update: function (table, data, conditions, callback = null) {
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
                if (condition.conditionType === 'object') {
                  builder.whereIn(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereIn(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNotNull':
                if (condition.conditionType === 'object') {
                  builder.whereNotNull(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNotNull(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereExists':
                if (condition.conditionType === 'object') {
                  builder.whereExists(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereExists(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNotExists':
                if (condition.conditionType === 'object') {
                  builder.whereNotExists(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNotExists(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereBetween':
                if (condition.conditionType === 'object') {
                  builder.whereBetween(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereBetween(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNotBetween':
                if (condition.conditionType === 'object') {
                  builder.whereNotBetween(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNotBetween(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereRaw':
                if (condition.conditionType === 'object') {
                  builder.whereRaw(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereRaw(condition.condition.key, condition.condition.operator, condition.condition.value)
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
                if (condition.conditionType === 'object') {
                  builder.whereIn(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereIn(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNotNull':
                if (condition.conditionType === 'object') {
                  builder.whereNotNull(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNotNull(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereExists':
                if (condition.conditionType === 'object') {
                  builder.whereExists(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereExists(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNotExists':
                if (condition.conditionType === 'object') {
                  builder.whereNotExists(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNotExists(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereBetween':
                if (condition.conditionType === 'object') {
                  builder.whereBetween(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereBetween(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereNotBetween':
                if (condition.conditionType === 'object') {
                  builder.whereNotBetween(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereNotBetween(condition.condition.key, condition.condition.operator, condition.condition.value)
                }
                break
              case 'whereRaw':
                if (condition.conditionType === 'object') {
                  builder.whereRaw(condition.condition)
                } else if (condition.conditionType === 'keyValue') {
                  builder.whereRaw(condition.condition.key, condition.condition.operator, condition.condition.value)
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
  }
}

module.exports = database
