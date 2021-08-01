const hbHelpers = {
  date: function (date) {
    date = new Date(date)

    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0)
  },
  dateView: function (date) {
    date = new Date(date)

    return (date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + '/' + date.getFullYear()
  },
  isLengthOne: function (namesLen) {
    return namesLen === 1
  },
  sexSelection: function (gender) {
    if (gender === 'Male') {
      return '<option selected>Male</option> <option>Female</option>'
    } else {
      return '<option>Male</option> <option selected>Female</option>'
    }
  }

}

module.exports = hbHelpers
