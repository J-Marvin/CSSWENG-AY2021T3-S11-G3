const sqlite = require('better-sqlite3')
const knex = require('knex')
const fse = require('fs-extra')
const bcrypt = require('bcrypt')
const saltRounds = 10
const path = require('path')
const { Condition, queryTypes } = require('../models/condition')
const personFields = require('../models/Person')
let knexClient = null
const file = path.join(__dirname, 'church.db')

const startIds = [
  { table: 'people', start: 11000000 },
  { table: 'address', start: 2000000 },
  { table: 'members', start: 1000000 },
  { table: 'accounts', start: 0 },
  { table: 'donations', start: 8000000 },
  { table: 'bap_reg', start: 3000000 },
  { table: 'wedding_reg', start: 5000000 },
  { table: 'pre_nuptial', start: 4000000 },
  { table: 'witness', start: 6000000 },
  { table: 'inf_dedication', start: 7000000 },
  { table: 'couples', start: 10000000 },
  { table: 'observations', start: 9000000 }
]

const data = [
  {
    person: {
      first_name: 'Jonathan Jr',
      middle_name: 'J',
      last_name: 'Joestar'
    },
    address: {
      address_line: 'Apples',
      barangay: '130',
      city: 'London',
      province: null
    },
    member: {
      member_status: 'active',
      civil_status: 'single',
      age: 25,
      birthday: new Date(1996, 2, 3).toISOString(),
      occupation: 'IT',
      workplace: 'Quezon City',
      email: 'jonathan@gmail.com',
      telephone: null,
      mobile: '922',
      educ_attainment: 'College',
      alma_mater: 'DLSU-Manila',
      sex: 'Male'
    }
  },

  {
    person: {
      first_name: 'Joseph',
      middle_name: 'J',
      last_name: 'Joestar'
    },
    address: {
      address_line: 'Mangoes',
      barangay: '131',
      city: 'London',
      province: null
    },
    member: {
      member_status: 'active',
      civil_status: 'married',
      age: 54,
      birthday: new Date(1966, 9, 27).toISOString(),
      occupation: 'Engineer',
      workplace: 'Manila',
      email: 'joseph@gmail.com',
      telephone: null,
      mobile: '912',
      educ_attainment: 'High School',
      alma_mater: 'DLSZ',
      sex: 'Male'
    }
  },

  {
    person: {
      first_name: 'Isaac',
      middle_name: 'C',
      last_name: 'Clarke'
    },
    address: {
      address_line: 'Ishimura',
      barangay: '7',
      city: 'Aegis',
      province: null
    },
    member: {
      member_status: 'active',
      civil_status: 'single',
      age: '19',
      birthday: new Date(2001, 12, 5).toISOString(),
      occupation: 'Student',
      workplace: 'DLSU',
      email: 'isaac_clarke@gmail.com',
      telephone: null,
      mobile: '988',
      educ_attainment: 'High School',
      alma_mater: 'DLSZ',
      sex: 'Male'
    }
  },

  {
    person: {
      first_name: 'Liara',
      middle_name: 'B',
      last_name: 'Tsoni'
    },
    address: {
      address_line: 'Thessia',
      barangay: '2077',
      city: 'Serrice',
      province: null
    },
    member: {
      member_status: 'active',
      civil_status: 'single',
      age: 25,
      birthday: new Date(1996, 1, 7).toISOString(),
      occupation: 'Researcher',
      workplace: 'Therum',
      email: 'liara_broker@gmail.com',
      telephone: null,
      mobile: '988',
      educ_attainment: 'Doctorate',
      alma_mater: 'Grissom Academy',
      sex: 'Monogendered'
    }
  },

  {
    person: {
      first_name: 'Garrus',
      middle_name: 'A',
      last_name: 'Vakarian'
    },
    address: {
      address_line: 'Omega',
      barangay: 'Normandy',
      city: 'Palaven',
      province: null
    },
    member: {
      member_status: 'inactive',
      civil_status: 'single',
      age: 25,
      birthday: new Date(1996, 3, 6).toISOString(),
      occupation: 'Investigator',
      workplace: 'Citadel',
      email: 'garrus@csec.com',
      telephone: null,
      mobile: '945',
      educ_attainment: 'College',
      alma_mater: 'Palaven Academy',
      sex: 'Male'
    }
  }
]

function delDatabase () {
  if (fse.existsSync(file)) {
    fse.remove(file, (err) => {
      if (err) {
        console.log(err)
      } else {
        initDatabase()
        insertData()
      }
    })
  } else {
    initDatabase()
    insertData()
  }
}

function initDatabase (callback) {
  const db = sqlite(file)

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
    'observer TEXT NOT NULL,' +
    'FOREIGN KEY(observee_id) REFERENCES members(member_id)' +
    ')'

  startIds.forEach((record) => {
    knexClient('sqlite_sequence').insert({
      name: record.table,
      seq: record.start
    }).catch((err) => { console.log(err) })
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

  // close the connection to the db
  db.close()
}

function insertData () {
  // insert accounts
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
                    console.log('Inserted ' + result)
                    console.log(record.member)
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

// delete tables and insert
delDatabase()
