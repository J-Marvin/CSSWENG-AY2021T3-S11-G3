const data = [
  {
    person: {
      first_name: 'Jonathan Jr',
      middle_name: 'J',
      last_name: 'Joestar'
    },
    address: {
      address_line: 'Apples',
      city: 'London',
      province: null,
      country: 'United Kingdom'
    },
    member: {
      member_status: 'Active',
      civil_status: 'Single',
      birthday: new Date(1996, 1, 3).toISOString(),
      occupation: 'IT',
      workplace: 'Quezon City',
      email: 'jonathan@gmail.com',
      telephone: null,
      mobile: '09221112222',
      educ_attainment: 'College',
      alma_mater: 'DLSU-Manila',
      sex: 'Male'
    }
  },

  {
    person: {
      first_name: 'Joseph',
      middle_name: 'J',
      last_name: 'Joestar'
    },
    address: {
      address_line: 'Mangoes',
      city: 'Ottawa',
      province: null,
      country: 'Canada'
    },
    member: {
      member_status: 'Active',
      civil_status: 'Married',
      birthday: new Date(1966, 8, 27).toISOString(),
      occupation: 'Engineer',
      workplace: 'Manila',
      email: 'joseph@gmail.com',
      telephone: null,
      mobile: '09124444555',
      educ_attainment: 'High School',
      alma_mater: 'DLSZ',
      sex: 'Male'
    }
  },

  {
    person: {
      first_name: 'Isaac',
      middle_name: 'C',
      last_name: 'Clarke'
    },
    address: {
      address_line: 'Ishimura',
      city: 'Aegis',
      province: null,
      country: 'USA'
    },
    member: {
      member_status: 'Active',
      civil_status: 'Single',
      birthday: new Date(2001, 11, 5).toISOString(),
      occupation: 'Student',
      workplace: 'DLSU',
      email: 'isaac_clarke@gmail.com',
      telephone: null,
      mobile: '09887561234',
      educ_attainment: 'High School',
      alma_mater: 'DLSZ',
      sex: 'Male'
    }
  },

  {
    person: {
      first_name: 'Liara',
      middle_name: 'B',
      last_name: 'Tsoni'
    },
    address: {
      address_line: 'Thessia',
      city: 'Serrice',
      province: null,
      country: 'Protean'
    },
    member: {
      member_status: 'Active',
      civil_status: 'Single',
      birthday: new Date(1996, 0, 7).toISOString(),
      occupation: 'Researcher',
      workplace: 'Therum',
      email: 'liara_broker@gmail.com',
      telephone: null,
      mobile: '09880123456',
      educ_attainment: 'Doctorate',
      alma_mater: 'Grissom Academy',
      sex: 'Female'
    }
  },

  {
    person: {
      first_name: 'Garrus',
      middle_name: 'A',
      last_name: 'Vakarian'
    },
    address: {
      address_line: 'Omega',
      city: 'Palaven',
      province: null,
      country: 'Turian'
    },
    member: {
      member_status: 'inActive',
      civil_status: 'Single',
      birthday: new Date(1996, 2, 6).toISOString(),
      occupation: 'Investigator',
      workplace: 'Citadel',
      email: 'garrus@csec.com',
      telephone: null,
      mobile: '09451010202',
      educ_attainment: 'College',
      alma_mater: 'Palaven Academy',
      sex: 'Male'
    }
  },
  {
    person: {
      first_name: 'Josuke',
      middle_name: 'J',
      last_name: 'Higashikata'
    },
    address: {
      address_line: 'Higashikata Estate',
      city: 'Morioh',
      province: null,
      country: 'Japan'
    },
    member: {
      member_status: 'Active',
      civil_status: 'Single',
      birthday: new Date(1980, 5, 6).toISOString(),
      occupation: 'Seaman',
      workplace: 'Japan',
      email: 'crazydiamond@gmail.com',
      telephone: null,
      mobile: '09123456789',
      educ_attainment: 'College',
      alma_mater: 'DLSJ',
      sex: 'Male'
    }
  },
  {
    person: {
      first_name: 'Nino',
      middle_name: 'N',
      last_name: 'Nakano'
    },
    address: {
      address_line: 'Nakano Estate',
      city: 'Tokyo',
      province: null,
      country: 'Japan'
    },
    member: {
      member_status: 'Active',
      civil_status: 'Single',
      birthday: new Date(2000, 5, 5).toISOString(),
      occupation: 'Cook',
      workplace: 'Japan',
      email: 'nino_nakano@gmail.com',
      telephone: null,
      mobile: '09987654321',
      educ_attainment: 'College',
      alma_mater: 'DLSJ',
      sex: 'Female'
    }
  },
  {
    person: {
      first_name: 'Miku',
      middle_name: 'N',
      last_name: 'Nakano'
    },
    address: {
      address_line: 'Nakano Estate',
      city: 'Tokyo',
      province: null,
      country: 'Japan'
    },
    member: {
      member_status: 'Active',
      civil_status: 'Single',
      birthday: new Date(2000, 5, 5).toISOString(),
      occupation: 'Cook',
      workplace: 'Japan',
      email: 'miku_nakano@gmail.com',
      telephone: null,
      mobile: '09987654321',
      educ_attainment: 'College',
      alma_mater: 'DLSJ',
      sex: 'Female'
    }
  },
  {
    person: {
      first_name: 'Yotsuba',
      middle_name: 'N',
      last_name: 'Nakano'
    },
    address: {
      address_line: 'Nakano Estate',
      city: 'Tokyo',
      province: null,
      country: 'Japan'
    },
    member: {
      member_status: 'Active',
      civil_status: 'Single',
      birthday: new Date(2000, 5, 5).toISOString(),
      occupation: 'Athlete',
      workplace: 'Japan',
      email: 'yotsuba_nakano@gmail.com',
      telephone: null,
      mobile: '09987654321',
      educ_attainment: 'College',
      alma_mater: 'DLSJ',
      sex: 'Female'
    }
  }
]

module.exports = data
