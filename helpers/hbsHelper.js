const hbHelpers = {
  date: function (date) {
    date = new Date(date)

    return date.getFullYear() + '-' + (date.getMonth()).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0)
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
  },
  civilStatusSelection: function (civilStatus) {
    if (civilStatus === 'Single') {
      return '<option selected>Single</option> <option>Married</option>'
    } else {
      return '<option>Single</option> <option selected>Married</option>'
    }
  },
  memberStatusSelection: function(memberStatus) {
    if (memberStatus === 'Active') {
      return '<option selected>Active</option> <option>Inactive</option>'
    } else {
      return '<option>Active</option> <option selected>Inactive</option>'
    }
  }

}

module.exports = hbHelpers
