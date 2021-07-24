const sqlite3 = require('better-sqlite3')
const path = require('path')
// const tables

const database = {
  initDB: async function (file, folder) {
    // opens the file and verbose prints the statements executed
    const db = sqlite3(path.join(folder, file), { verbose: console.log })

    const createBapReg =
      'CREATE TABLE IF NOT EXISTS bap_reg (' +
        'reg_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'date DATE, ' +
        'location TEXT, ' +
        'officiant TEXT' +
        ')'

    const createInfDedication =
      'CREATE TABLE IF NOT EXISTS inf_dedication (' +
        'dedication_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'first_name TEXT,' +
        'middle_name TEXT,' +
        'last_name TEXT, ' +
        'date DATE, ' +
        'place TEXT, ' +
        'officiant TEXT' +
      ')'

    const createWitness =
      'CREATE TABLE IF NOT EXISTS witness (' +
        'witness_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'dedication_id INTEGER,' +
        'parent_1_id INTEGER,' +
        'parent_2_id INTEGER,' +
        'first_name TEXT,' +
        'middle_name TEXT,' +
        'last_name TEXT,' +
        'FOREIGN KEY(dedication_id) REFERENCES inf_dedication(dedication_id),' +
        'FOREIGN KEY(parent_1_id) REFERENCES members(member_id),' +
        'FOREIGN KEY(parent_2_id) REFERENCES members(member_id)' +
      ')'

    const createAccounts =
    'CREATE TABLE IF NOT EXISTS accounts (' +
      'level TEXT NOT NULL PRIMARY KEY,' +
      'hashed_password TEXT' +
      ')'

    const createPreNuptial =
      'CREATE TABLE IF NOT EXISTS pre_nuptial (' +
        'record_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'bride_first_name TEXT, ' +
        'bride_maiden_name TEXT,' +
        'bride_last_name TEXT,' +
        'groom_first_name TEXT, ' +
        'groom_maiden_name TEXT,' +
        'groom_last_name TEXT,' +
        'date DATE,' +
        'date_of_wedding DATE' +
      ')'

    const createWeddingReg =
      'CREATE TABLE IF NOT EXISTS wedding_reg (' +
        'reg_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'prenup_record_id INTEGER,' +
        'bride_first_name TEXT, ' +
        'bride_maiden_name TEXT,' +
        'bride_last_name TEXT,' +
        'groom_first_name TEXT, ' +
        'groom_maiden_name TEXT,' +
        'groom_last_name TEXT,' +
        'date DATE,' +
        'location TEXT, ' +
        'solemnizing_officer TEXT,' +
        'contract_no TEXT, ' +
        'contract_img BLOB,' +
        'FOREIGN KEY(prenup_record_id) REFERENCES pre_nuptial(record_id)' +
      ')'

    const createChurchIncome =
      'CREATE TABLE IF NOT EXISTS church_income (' +
        'income_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'member_id INTEGER NOT NULL,' +
        'type TEXT, ' +
        'amount REAL, ' +
        'date DATE,' +
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
        'member_status TEXT,' +
        'first_name TEXT,' +
        'middle_name TEXT,' +
        'last_name TEXT,' +
        'civil_status TEXT,' +
        'age INTEGER,' +
        'birthday DATE,' +
        'occupation TEXT,' +
        'workplace TEXT,' +
        'email TEXT,' +
        'mobile INTEGER,' +
        'educ_attainment TEXT,' +
        'alma_mater TEXT,' +
        'FOREIGN KEY(address_id) REFERENCES address(address_id),' +
        'FOREIGN KEY(bap_reg_id) REFERENCES bap_reg(reg_id), ' +
        'FOREIGN KEY(wedding_reg_id) REFERENCES wedding_reg(reg_id),' +
        'FOREIGN KEY(prenup_record_id) REFERENCES pre_nuptial(record_id)' +
      ')'

    db.prepare(createBapReg).run()
    db.prepare(createInfDedication).run()
    db.prepare(createWitness).run()
    db.prepare(createAccounts).run()
    db.prepare(createPreNuptial).run()
    db.prepare(createWeddingReg).run()
    db.prepare(createAddress).run()
    db.prepare(createMembers).run()
    db.prepare(createChurchIncome).run()

    db.close()
  },
  /*
    insertData: function (table) {
      if (table == CONST_MEMBER) {
        insertMember ();
      }
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
