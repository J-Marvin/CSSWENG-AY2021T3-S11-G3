const helper = {
  formatDate: function (date) {
    date = new Date(date)

    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0)
  },

  formatDateTomorrow: function (date) {
    date = new Date(date)
    date.setDate(date.getDate() + 1)
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0)
  },

  formatDateStartOfDay: function (date) {
    date = new Date(date)
    date.setHours(0, 0, 0, 0)
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0) +
    ' ' + date.getHours().toString().padStart(2, 0) + ':' + date.getMinutes().toString().padStart(2, 0) + ':' + date.getSeconds().toString().padStart(2, 0)
  },

  formatDateEndOfDay: function (date) {
    date = new Date(date)
    date.setHours(23, 59, 59, 999)
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0) +
      ' ' + date.getHours().toString().padStart(2, 0) + ':' + date.getMinutes().toString().padStart(2, 0) + ':' + date.getSeconds().toString().padStart(2, 0)
  }
}

module.exports = helper
