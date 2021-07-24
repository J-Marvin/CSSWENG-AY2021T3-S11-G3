const sqlite3 = require('better-sqlite3')
const path = require('path')

// this will stay
const Constants = {
  member: 'MEMBER',
  address: 'ADDRESS',
  accounts: 'ACCOUNT',
  person: 'PERSON',
  donation: 'DONATION',
  baptismal: 'BAPTISMAL',
  wedding: 'WEDDING',
  prenuptial: 'PRE-NUPTIAL',
  witness: 'WITNESS',
  infant: 'INFANT'
}

// helper functions
function insertMember (data, callback) {
}

// const object to export
const database = {
  initDB: async function (file, folder) {
    // opens the file and verbose prints the statements executed
    const db = sqlite3(path.join(folder, file), { verbose: console.log })

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

    /* This statement create the Infant Dedication table 
       Fields:
       dedication_id - primary id
       person_id - an id referencing the person(infant)
       date - the date of the event
       place - the place of the event
       officiant - the officiant 
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
        'mobile INTEGER,' +
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

    db.close()
  },
  /*
    insertOne: function(table, data, callback) {
    if(table === Constants.member)
      insertMember(data, callback)
    else if(cond2)
    ...
    }
  */
  insertMember: function (req, res) {
    // to edit later
    const firstName = req.body.firstName
    const midName = req.body.midName
    const lastName = req.body.lastName
    const civilStatus = req.body.civilStatus
    const age = req.body.age
    const birthday = req.body.age
    const occupation = req.body.occupation
    const workplace = req.body.workplace
    const email = req.body.email
    const mobile = req.body.mobile
    const educ = req.body.educ
    const almaMater = req.body.almaMater

    const query = 'INSERT INTO members (' +
    'member_status,' +
    'first_name' +
    'middle_name' +
    'last_name' +
    'civil_status' +
    'age' +
    'birthday' +
    'occupation' +
    'workplace' +
    'email' +
    'mobile' +
    'educ_attainment' +
    'alma_mater' +
    ')' +
    'VALUES' +
    firstName +
    midName +
    lastName +
    civilStatus +
    age +
    birthday +
    occupation +
    workplace +
    email +
    mobile +
    educ +
    almaMater

    // db.prepare(query).run()
  }
}

module.exports = database
