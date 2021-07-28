const queryTypes = {
  where: 'where',
  orWhere: 'orWhere',
  whereNot: 'whereNot',
  whereIn: 'whereIn',
  whereNotNull: 'whereNotNull',
  whereExists: 'whereExists',
  whereNotExists: 'whereNotExists',
  whereBetween: 'whereBetween',
  whereNotBetween: 'whereNotBetween',
  whereRaw: 'whereRaw'
}

const types = Object.keys(queryTypes)

/** This blueprint represents a WHERE condition in sqlite
 *  @param {String} type of where statement based on Knex.js
*/
function Condition (type) {
  if (types.includes(type)) {
    this.type = type
  }
}

Condition.prototype = {
  /** */
  setQueryObject: function (condition) {
    this.condition = condition
    this.conditionType = 'object'
  },

  setKeyValue: function (key, value, operator = null) {
    this.condition = {
      key: key,
      value: value,
      operator: (operator === null || operator === undefined) ? '=' : operator
    }
    this.conditionType = 'keyValue'
  }
}

module.exports = { Condition, queryTypes }
