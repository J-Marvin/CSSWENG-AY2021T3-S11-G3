const hbHelpers = {
  date: function (date) {
    date = new Date(date)

    return date.getFullYear() + '-' + (date.getMonth()).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0)
  },
  isLengthOne: function (namesLen) {
    return namesLen === 1
  }

}

module.exports = hbHelpers
