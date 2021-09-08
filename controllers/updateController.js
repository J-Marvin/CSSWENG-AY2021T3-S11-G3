const personFields = require('../models/person')
const { Condition, queryTypes } = require('../models/condition')
const db = require('../models/db')
const { tables } = require('../models/db')
const memberFields = require('../models/members')

const updateController = {
/**
 * This function updates the information of a person
 * @param {Object} person - This object contains the the following: firstName, midName, lastName, personId
 * @param {Function} callback  - The callback function to be called after updating the person
 */
  updateNonMemberToNonMember: function (person, callback) {
    const data = {}
    data[personFields.FIRST_NAME] = person.firstName
    data[personFields.MID_NAME] = person.midName
    data[personFields.LAST_NAME] = person.lastName
    const condition = new Condition(queryTypes.where)
    condition.setKeyValue(personFields.ID, person.personId)

    db.update(tables.PERSON_TABLE, data, condition, callback)
  },

  /**
   * This function updates a record's related person from a member to a non member
   * @param {Object} person - This object contains the following: firstName, midName, lastName
   * @param {Object} ids - This object contains the following: recordId (the id of the record to be udpated), oldMemberId
   * @param {Object} fields - This object contains the following: recordId (the field to be updated), recordPersonField, memberRecordField
   * @param {String} recordTable - The table to update the record
   * @param {Function} callback - The callback function to be called after updating the required information
   */
  updateMemberToNonMember: function (person, ids, fields, recordTable, callback) {
    const personInfo = {}
    personInfo[personFields.FIRST_NAME] = person.firstName
    personInfo[personFields.MID_NAME] = person.midName
    personInfo[personFields.LAST_NAME] = person.lastName

    const memberCondition = new Condition(queryTypes.where)
    memberCondition.setKeyValue(memberFields.PERSON, ids.oldPersonId)

    const updateDataMember = {}
    if (fields.memberRecordField != null) {
      updateDataMember[fields.memberRecordField] = null
    }

    db.update(db.tables.MEMBER_TABLE, updateDataMember, memberCondition, function (result) {
      if (result === 0) {
        result = true
      }

      if (result) {
        db.insert(db.tables.PERSON_TABLE, personInfo, function (result) {
          if (result) {
            result = result[0]
            const recordCond = new Condition(queryTypes.where)
            recordCond.setKeyValue(fields.recordId, ids.recordId)
            const recordUpdateData = {}
            recordUpdateData[fields.recordPersonField] = result

            db.update(recordTable, recordUpdateData, recordCond, function (result) {
              if (result === 0) {
                result = true
              }

              if (result) {
                callback(recordUpdateData[fields.recordPersonField])
              } else {
                result = false
                callback(result)
              }
            })
          } else {
            result = false
            callback(result)
          }
        })
      } else {
        result = false
        callback(result)
      }
    })
  },

  /**
   * This function updates a record's related person from a non member to a member
   * @param {Object} ids - This object contains the following: oldPersonId, newPersonId, recordId
   * @param {Object} fields - This object contains the following: recordId, memberRecordField (field in member to be updated), recordPersonField (field in record to be updated)
   * @param {String} recordTable - The table to update the record
   * @param {Function} callback - The callback function to be called after updating the required information
   */
  updateNonMemberToMember: function (ids, fields, recordTable, callback) {
    const oldPersonId = ids.oldPersonId
    const newPersonId = ids.newPersonId
    const recordId = ids.recordId

    const delCondition = new Condition(queryTypes.where)
    delCondition.setKeyValue(personFields.ID, oldPersonId)

    const updateRecordData = {}
    updateRecordData[fields.recordPersonField] = newPersonId

    console.log(updateRecordData)

    const updateMemberData = {}
    if (fields.memberRecord !== null && fields.memberRecord !== undefined) {
      updateMemberData[fields.memberRecordField] = recordId
    }

    const updateRecordCondition = new Condition(queryTypes.where)
    updateRecordCondition.setKeyValue(fields.recordId, ids.recordId)

    const updateMemberCondition = new Condition(queryTypes.where)
    updateMemberCondition.setKeyValue(memberFields.PERSON, newPersonId)

    // update first the record table so no fk issues
    db.update(recordTable, updateRecordData, updateRecordCondition, function (result) {
      console.log("TEST")
      if (result) {
        // delete person
        db.delete(db.tables.PERSON_TABLE, delCondition, function (result) {
          if (result) {
            // Update new member
            console.log("TEST2")
            db.update(db.tables.MEMBER_TABLE, updateMemberData, updateMemberCondition, function (result) {
              if (result === 0) {
                result = true
              }
              if (result) {
                callback(result)
              } else {
                result = false
                callback(result)
              }
            })
          } else {
            result = false
            callback(result)
          }
        })
      } else {
        result = false
        callback(result)
      }
    })
  },

  /**
   * This function updates a record's related person from a non member to a member
   * @param {Object} ids - This object contains the following: oldPersonId, newPersonId, recordId
   * @param {Object} fields - This object contains the following: recordId, memberRecordField (field in member to be updated), recordPersonField (field in record to be updated)
   * @param {String} recordTable - The table to update the record
   * @param {Function} callback - The callback function to be called after updating the required information
   */
  updateMemberToMember: function (ids, fields, recordTable, callback) {
    const oldPersonId = ids.oldPersonId
    const newPersonId = ids.newPersonId
    const recordId = ids.recordId

    const updateRecordData = {}
    updateRecordData[fields.recordPersonField] = newPersonId

    const updateNewMemberData = {}
    const updateOldMemberData = {}

    if (fields.memberRecordField !== null) {
      updateNewMemberData[fields.memberRecordField] = recordId
      updateOldMemberData[fields.memberRecordField] = null
    }

    const updateRecordCondition = new Condition(queryTypes.where)
    updateRecordCondition.setKeyValue(fields.recordId, recordId)

    const updateNewMemberCondition = new Condition(queryTypes.where)
    updateNewMemberCondition.setKeyValue(memberFields.PERSON, newPersonId)

    const updateOldMemberCondition = new Condition(queryTypes.where)
    updateOldMemberCondition.setKeyValue(memberFields.PERSON, oldPersonId)

    // update first the record table
    db.update(recordTable, updateRecordData, updateRecordCondition, function (result) {
      if (result === 0) {
        result = true
      }
      if (result) {
        db.update(db.tables.MEMBER_TABLE, updateOldMemberData, updateOldMemberCondition, function (result) {
          if (result === 0) {
            result = true
          }

          if (result) {
            db.update(db.tables.MEMBER_TABLE, updateNewMemberData, updateNewMemberCondition, function (result) {
              if (result === 0) {
                result = true
              }

              callback(result)
            })
          } else {
            result = false
            callback(result)
          }
        })
      } else {
        result = false
        callback(result)
      }
    })
  }
}

module.exports = updateController