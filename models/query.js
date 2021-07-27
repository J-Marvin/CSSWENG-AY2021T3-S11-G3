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

function Query (type) {
  if (types.includes(type)) {
    this.type = type
  }
}

Query.prototype = {
  setQueryObject: function (query) {
    this.query = query
    this.queryType = 'object'
  },

  setKeyValue: function (key, value, operator = null) {
    this.query = {
      key: key,
      value: value,
      operator: (operator === null || operator === undefined) ? '=' : operator
    }
    this.queryType = 'keyValue'
  }
}

module.exports = { Query, queryTypes }
