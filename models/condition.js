const queryTypes = {
  where: 'where',
  orWhere: 'orWhere',
  whereNot: 'whereNot',
  whereIn: 'whereIn',
  whereNotIn: 'whereNotIn',
  whereNull: 'whereNull',
  whereNotNull: 'whereNotNull',
  // whereExists: 'whereExists',
  // whereNotExists: 'whereNotExists',
  whereBetween: 'whereBetween',
  whereNotBetween: 'whereNotBetween',
  whereRaw: 'whereRaw',
  having: 'having',
  havingIn: 'havingIn',
  havingNotIn: 'havingNotIn',
  havingNull: 'havingNull',
  havingNotNull: 'havingNotNull',
  // havingExists: 'havingExists',
  // havingNotExists: 'havingNotExists',
  havingBetween: 'havingBetween',
  havingNotBetween: 'havingNotBetween',
  havingRaw: 'havingRaw'
}

const types = Object.keys(queryTypes)

/** This blueprint represents a WHERE or HAVING condition in sqlite
 *  @param {String} type of where statement based on Knex.js
*/
function Condition (type) {
  if (types.includes(type)) {
    this.type = type
  }
}

Condition.prototype = {
  /**
  * This function sets the condition for where, whereNot
  * @param {Object} condition - the object containing the fields and their corresponding values
  */
  setQueryObject: function (condition) {
    this.condition = condition
    this.conditionType = 'object'
  },

  /**
  * This function sets the condition for where, whereNot, orWhere, having
  * @param {String} key - the field/column name
  * @param {*} value - the corresponding value
  * @param {*} operator = the operator to be used. Default is '='
  */
  setKeyValue: function (key, value, operator = null) {
    this.condition = {
      key: key,
      value: value,
      operator: (operator === null || operator === undefined) ? '=' : operator
    }
    this.conditionType = 'keyValue'
  },

  /**
   * This function sets the condition for whereIn, whereNotIn, havingIn, havingNotIn
   * @param {String} field - the field/column name
   * @param {Array} data - the array of values
   */
  setArray: function (field, data) {
    this.conditionType = 'array'
    this.field = field
    this.data = data
  },

  /**
   * This function sets the condition for whereBetween, whereNotBetween, having, havingBetween
   * @param {String} field - the field/column name
   * @param {*} lowerBound - the lowerBound of the range
   * @param {*} upperBound - the upperBound of the range
   */
  setRange: function (field, lowerBound, upperBound) {
    this.conditionType = 'range'
    this.condition = {
      field: field,
      lowerBound: lowerBound,
      upperBound: upperBound
    }
  },

  /**
   * This function sets the condition for whereNull and whereNotNull, havingNull, havingNotNull
   * @param {String} field - the field/column name
   */
  setField: function (field) {
    this.conditionType = 'field'
    this.field = field
  },

  /**
   * This function sets the statement to be executed
   * @param {String} statement - the sql statement to be executed
   * @param {Array} bindings - the bindings to the placeholders
   */
  setQuery: function (query, bindings = []) {
    this.conditionType = 'query'
    this.query = query
    this.bindings = bindings
  }
}

module.exports = { Condition, queryTypes }
