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
  },
  civilStatusSelection: function (civilStatus) {
    if (civilStatus.toLowerCase() === 'single') {
      return '<option selected>Single</option> <option>Married</option> <option>Others</option>'
    } else if (civilStatus.toLowerCase() === 'Married') {
      return '<option>Single</option> <option selected>Married</option> <option>Others</option>'
    } else {
      return '<option>Single</option> <option>Married</option> <option Selected>Others</option>'
    }
  },
  otherCivilStatus: function (civilStatus) {
    if (civilStatus.toLowerCase() !== 'single' && civilStatus.toLowerCase() !== 'married') {
      return civilStatus
    } else {
      return ''
    }
  },
  memberStatusSelection: function (memberStatus) {
    if (memberStatus === 'active') {
      return '<option selected>Active</option> <option>Inactive</option>'
    } else {
      return '<option>Active</option> <option selected>Inactive</option>'
    }
  },
  isLevelNA: function (level) {
    if (level === 'N/A' || level === undefined || level === null) {
      return true
    }
  }

}

module.exports = hbHelpers
