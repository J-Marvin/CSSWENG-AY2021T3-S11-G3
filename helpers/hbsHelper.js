const hbHelpers = {
  date: function (date) {
    date = new Date(date)

    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0)
  },
  dateView: function (date) {
    date = new Date(date)

    return ((date.getMonth() + 1).toString().padStart(2, 0) + '/' + date.getDate().toString().padStart(2, 0) + '/' + date.getFullYear()).trim()
  },
  dateString: function (date) {
    date = new Date(date)
    const strDate = date.toDateString()

    return strDate.slice(4, strDate.length)
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

  memberTypeSelection: function (memberType) {
    const memberTypes = [
      'Regular Member (Resident)',
      'Regular Member (Non Resident)',
      'Associate Member',
      'Affiliate Member',
      'Preparatory Member',
      'Honorary Member'
    ]

    let options = ''

    for (const type of memberTypes) {
      if (type === memberType) {
        options += '<option selected>' + type + '</option>'
      } else {
        options += '<option>' + type + '</option>'
      }
    }

    return options
  },
  civilStatusSelection: function (civilStatus) {
    if (civilStatus.toLowerCase() === 'single') {
      return '<option selected>Single</option> <option>Married</option> <option>Others</option>'
    } else if (civilStatus.toLowerCase() === 'married') {
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
  otherColDisplay: function (civilStatus) {
    if (civilStatus.toLowerCase() !== 'single' && civilStatus.toLowerCase() !== 'married') {
      return 'block'
    } else {
      return 'none'
    }
  },
  memberStatusSelection: function (memberStatus) {
    if (memberStatus.toLowerCase() === 'active') {
      return '<option selected>Active</option> <option>Inactive</option> <option>Deceased</option>'
    } else if (memberStatus.toLowerCase() === 'inactive') {
      return '<option>Active</option> <option selected>Inactive</option> <option>Deceased</option>'
    } else {
      return '<option>Active</option> <option>Inactive</option> <option selected>Deceased</option>'
    }
  },
  isLevelNA: function (level) {
    if (level === 'N/A' || level === undefined || level === null) {
      return true
    }
  },
  isUndefined: function (value) {
    return value === undefined || value === null
  }

}

module.exports = hbHelpers
