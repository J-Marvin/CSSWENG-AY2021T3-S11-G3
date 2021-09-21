const path = require('path')

const createBapReg =
  'CREATE TABLE IF NOT EXISTS bap_reg (' +
  'reg_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
  'date TEXT, ' +
  'date_created TEXT,' +
  'location TEXT, ' +
  'officiant INT,' +
  'person INT,' +
  'FOREIGN KEY(officiant) REFERENCES people(person_id),' +
  'FOREIGN KEY(person) REFERENCES people(person_id)' +
  ')'

const createInfDedication =
  'CREATE TABLE IF NOT EXISTS inf_dedication (' +
  'dedication_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
  'person_id INTEGER NOT NULL, ' +
  'parents_id INTEGER, ' +
  'date TEXT, ' +
  'dedication_date TEXT, ' +
  'place TEXT, ' +
  'officiant TEXT,' +
  'FOREIGN KEY(person_id) REFERENCES people(person_id),' +
  'CONSTRAINT fk_parents FOREIGN KEY(parents_id) REFERENCES couples(couple_id) ON DELETE CASCADE' +
  ')'

const createWitness =
  'CREATE TABLE IF NOT EXISTS witness (' +
  'witness_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
  'dedication_id INTEGER,' +
  'wedding_id INTEGER,' +
  'type TEXT,' +
  'person_id INTEGER NOT NULL,' +
  'CONSTRAINT fk_inf_dedications FOREIGN KEY(dedication_id) REFERENCES inf_dedication(dedication_id) ON DELETE CASCADE,' +
  'CONSTRAINT fk_wedding FOREIGN KEY(wedding_id) REFERENCES wedding_reg(wedding_id) ON DELETE CASCADE,' +
  'CONSTRAINT fk_person FOREIGN KEY(person_id) REFERENCES people(person_id) ON DELETE CASCADE' +
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
  'CONSTRAINT fk_couple FOREIGN KEY(couple_id) REFERENCES couples(couple_id) ON DELETE CASCADE' +
  ')'

const createWeddingReg =
  'CREATE TABLE IF NOT EXISTS wedding_reg (' +
  'wedding_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
  'couple_id INTEGER NOT NULL,' +
  'date TEXT, ' +
  'date_of_wedding TEXT,' +
  'bride_parents_id INTEGER,' +
  'groom_parents_id INTEGER,' +
  'location TEXT, ' +
  'wedding_officiant TEXT,' +
  'solemnizing_officer TEXT,' +
  'contract_no TEXT, ' +
  'CONSTRAINT fk_couple FOREIGN KEY(couple_id) REFERENCES couples(couple_id) ON DELETE CASCADE,' +
  'CONSTRAINT fk_couple_bride FOREIGN KEY(bride_parents_id) REFERENCES couples(couple_id) ON DELETE SET NULL,' +
  'CONSTRAINT fk_couple_groom FOREIGN KEY(groom_parents_id) REFERENCES couples(couple_id) ON DELETE SET NULL' +
  ')'

const createDonationRecord =
  'CREATE TABLE IF NOT EXISTS donations (' +
  'donation_record_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
  'member_id INTEGER NOT NULL,' +
  'type TEXT, ' +
  'amount REAL, ' +
  'date TEXT,' +
  'CONSTRAINT fk_member FOREIGN KEY(member_id) REFERENCES members(member_id) ON DELETE SET NULL' +
  ')'

const createAddress =
  'CREATE TABLE IF NOT EXISTS address (' +
  'address_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
  'address_line TEXT, ' +
  'address_line2 TEXT,' +
  'city TEXT, ' +
  'province TEXT,' +
  'postal_code TEXT,' +
  'country TEXT' +
  ')'

const createMembers =
  'CREATE TABLE IF NOT EXISTS members (' +
  'member_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
  'address_id INTEGER,' +
  'bap_reg_id INTEGER,' +
  'wedding_reg_id INTEGER,' +
  'prenup_record_id INTEGER,' +
  'person_id INTEGER NOT NULL,' +
  'child_dedication_id INTEGER, ' +
  'member_status TEXT,' +
  'member_type TEXT,' +
  'civil_status TEXT,' +
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
  'family_members TEXT,' +
  'parents_id INTEGER,' +
  'CONSTRAINT fk_address FOREIGN KEY(address_id) REFERENCES address(address_id) ON DELETE SET NULL,' +
  'CONSTRAINT fk_bap_reg FOREIGN KEY(bap_reg_id) REFERENCES bap_reg(reg_id) ON DELETE SET NULL, ' +
  'CONSTRAINT fk_wedding_reg FOREIGN KEY(wedding_reg_id) REFERENCES wedding_reg(wedding_id) ON DELETE SET NULL,' +
  'CONSTRAINT fk_prenup FOREIGN KEY(prenup_record_id) REFERENCES pre_nuptial(record_id) ON DELETE SET NULL,' +
  'CONSTRAINT fk_parents FOREIGN KEY(parents_id) REFERENCES couples(couple_id) ON DELETE SET NULL,' +
  'CONSTRAINT fk_child_ded FOREIGN KEY(child_dedication_id) REFERENCES inf_dedication(dedication_id) ON DELETE SET NULL,' +
  'FOREIGN KEY(person_id) REFERENCES people(person_id)' +
  ')'

const createPerson =
  'CREATE TABLE IF NOT EXISTS people(' +
  'person_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
  'member_id INTEGER,' +
  'first_name TEXT,' +
  'middle_name TEXT,' +
  'last_name TEXT,' +
  'CONSTRAINT fk_member FOREIGN KEY(member_id) references members(member_id) ON DELETE SET NULL' +
  ')'

const createCouple =
  'CREATE TABLE IF NOT EXISTS couples(' +
  'couple_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
  'female_id INTEGER,' +
  'male_id INTEGER,' +
  'FOREIGN KEY(female_id) REFERENCES people(person_id),' +
  'FOREIGN KEY(male_id) REFERENCES people(person_id)' +
  ')'

const createObservations =
  'CREATE TABLE IF NOT EXISTS observations(' +
  'observation_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
  'comment TEXT NOT NULL,' +
  'observee_id INTEGER NOT NULL,' +
  'observer TEXT NOT NULL,' +
  'date TEXT NOT NULL,' +
  'CONSTRAINT fk_member FOREIGN KEY(observee_id) REFERENCES members(member_id) ON DELETE CASCADE' +
  ')'

const createChurches =
  'CREATE TABLE IF NOT EXISTS churches(' +
  'church_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
  'church_name TEXT NOT NULL, ' +
  'member_id INTEGER NOT NULL, ' +
  'address_id INTEGER NOT NULL,' +
  'CONSTRAINT fk_member FOREIGN KEY(member_id) REFERENCES members(member_id) ON DELETE CASCADE, ' +
  'FOREIGN KEY(address_id) REFERENCES address(address_id)' +
  ')'

const fse = require('fs-extra')

const db = {
  create: {
    baptismal: createBapReg,
    dedication: createInfDedication,
    account: createAccounts,
    prenup: createPreNuptial,
    weddings: createWeddingReg,
    donations: createDonationRecord,
    address: createAddress,
    members: createMembers,
    person: createPerson,
    couples: createCouple,
    observations: createObservations,
    churches: createChurches,
    witness: createWitness
  },
  tables: {
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
    OBSERVATION_TABLE: 'observations',
    CHURCH_TABLE: 'churches'
  },
  fields: {
    accounts: {
      ID: 'level',
      PASSWORD: 'hashed_password'
    },
    address: {
      ID: 'address_id',
      ADDRESS_LINE: 'address_line',
      ADDRESS_LINE2: 'address_line2',
      CITY: 'city',
      PROVINCE: 'province',
      POSTAL_CODE: 'postal_code',
      COUNTRY: 'country'
    },
    bap_reg: {
      ID: 'reg_id',
      DATE: 'date',
      DATE_CREATED: 'date_created',
      LOCATION: 'location',
      OFFICIANT: 'officiant',
      PERSON: 'person'
    },
    churches: {
      ID: 'church_id',
      NAME: 'church_name',
      MEMBER: 'member_id',
      ADDRESS: 'address_id'
    },
    couples: {
      ID: 'couple_id',
      FEMALE: 'female_id',
      MALE: 'male_id'
    },
    donations: {
      ID: 'income_id',
      PERSON: 'person_id',
      TYPE: 'type',
      AMT: 'amount',
      DATE: 'date'
    },
    inf_dedication: {
      ID: 'dedication_id',
      PERSON: 'person_id',
      DATE: 'date',
      DEDICATION_DATE: 'dedication_date',
      PLACE: 'place',
      OFFICIANT: 'officiant',
      PARENTS: 'parents_id'
    },
    members: {
      ID: 'member_id',
      ADDRESS: 'address_id',
      MEMBER_STATUS: 'member_status',
      MEMBER_TYPE: 'member_type',
      CIVIL_STATUS: 'civil_status',
      BIRTHDAY: 'birthday',
      OCCUPATION: 'occupation',
      WORKPLACE: 'workplace',
      EMAIL: 'email',
      TELEPHONE: 'telephone',
      MOBILE: 'mobile',
      EDUCATIONAL_ATTAINMENT: 'educ_attainment',
      ALMA_MATER: 'alma_mater',
      PERSON: 'person_id',
      BAPTISMAL_REG: 'bap_reg_id',
      WEDDING_REG: 'wedding_reg_id',
      PRENUP_RECORD: 'prenup_record_id',
      SKILLS: 'skills',
      DATE: 'date_created',
      SEX: 'sex',
      PARENTS: 'parents_id',
      FAMILY: 'family_members',
      CHILD_DEDICATION: 'child_dedication_id'
    },
    people: {
      ID: 'person_id',
      MEMBER: 'member_id',
      FIRST_NAME: 'first_name',
      MID_NAME: 'middle_name',
      LAST_NAME: 'last_name'
    },
    observations: {
      ID: 'observation_id',
      COMMENT: 'comment',
      OBSERVEE: 'observee_id',
      OBSERVER: 'observer',
      DATE: 'date'
    },
    pre_nuptial: {
      ID: 'record_id',
      COUPLE: 'couple_id',
      DATE: 'date',
      DATE_OF_WEDDING: 'date_of_wedding'
    },
    wedding_reg: {
      ID: 'wedding_id',
      DATE: 'date',
      COUPLE: 'couple_id',
      DATE_OF_WEDDING: 'date_of_wedding',
      BRIDE_PARENTS: 'bride_parents_id',
      GROOM_PARENTS: 'groom_parents_id',
      WEDDING_OFFICIANT: 'wedding_officiant',
      LOCATION: 'location',
      SOLEMNIZER: 'solemnizing_officer',
      CONTRACT: 'contract_no'
    },
    witness: {
      ID: 'witness_id',
      PERSON: 'person_id',
      TYPE: 'type',
      DEDICATION: 'dedication_id',
      WEDDING: 'wedding_id'
    }
  },
  startIds: [
    { table: 'people', start: 12000000 },
    { table: 'members', start: 1000000 },
    { table: 'address', start: 2000000 },
    { table: 'accounts', start: 0 },
    { table: 'bap_reg', start: 3000000 },
    { table: 'pre_nuptial', start: 4000000 },
    { table: 'wedding_reg', start: 5000000 },
    { table: 'witness', start: 6000000 },
    { table: 'inf_dedication', start: 7000000 },
    { table: 'donations', start: 8000000 },
    { table: 'observations', start: 9000000 },
    { table: 'couples', start: 10000000 },
    { table: 'churches', start: 11000000 }
  ]
}

module.exports = {
  dbInfo: db,
  exportToJSON: function () {
    fse.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 4), 'utf8')
  }
}
