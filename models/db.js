const sqlite3 = require('better-sqlite3')
const path = require('path')
const knex = require('knex')

// gettings fields of all tables
const member_fields = require('./members.js')
const address_fields = require('./address.js')
const account_fields = require('./accounts.js')
const person_fields = require('./Person.js')
const donation_fields = require('./donation.js')
const bap_reg_fields = require('./baptismalRegistry.js')
const wedding_reg_fields = require('./weddingRegistry.js')
const prenup_record_fields = require('./prenupRecord.js')
const witness_fields = require('./witness.js')
const inf_ded_fields = require('./infantDedication.js')
const couple_fields = require('./Couple.js')

let knexClient = null

let tables = {
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
let tableNames = Object.values(tables)

let fields = {
  members : Object.values(member_fields),
  address : Object.values(address_fields),
  accounts : Object.values(account_fields),
  people : Object.values(person_fields),
  donations : Object.values(donation_fields),
  bap_reg : Object.values(bap_reg_fields),
  wedding_reg : Object.values(wedding_reg_fields),
  pre_nuptial : Object.values(prenup_record_fields),
  witness : Object.values(witness_fields),
  inf_dedication : Object.values(inf_ded_fields),
  couples : Object.values(couple_fields),
}

const database = {
  /**
   * This function initializes the database given the path of the file.
   * @param {string} file the path of the file to be opened 
   */
  initDB: async function (file) {
    // opens the file and verbose prints the statements executed
    const db = sqlite3(file , { verbose: console.log })

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

    const createAttendance = 
      'CREATE TABLE IF NOT EXISTS attendance(' +
        'attendance_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'person_id INTEGER NOT NULL,' +
        'date TEXT,' +
        'FOREIGN KEY(person_id) REFERENCES people(person_id)' +
      ')'

    const createCouple =
      'CREATE TABLE IF NOT EXISTS couples(' + 
      'couple_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
      'female_id INTEGER NOT NULL,' +
      'male_id INTEGER NOT NULL' +
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
    db.prepare(createAttendance).run()

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
    if(!(tableNames.includes(table))) {
      console.log(table )
      console.log(tableNames)
      callback(false)
    } else {
      for (let key in data)
        if (fields[table].includes(key) && // if the key is a valid field
           (data[key] === null || data[key] === undefined)) // if the value is valid
          delete data[key]

      knexClient(table)
      .insert(data) // insert data
      .then(function (result) {
        if(callback !== null) // if there is a callback function return id of inserted row
          callback(result)
      }).catch(function(err) {
        console.log(err) 
        if(callback !== null)
          callback(false) // pass false to the callback function where an error occurred 
      })
    }
  },
  /*
    This table is a constant object containing the constant strings
    of the tables
  */
  tables: tables

  // make insert table to make code more reusable
}

module.exports = database
