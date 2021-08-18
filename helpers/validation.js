const { check } = require('express-validator')
const { default: validator } = require('validator')

const validation = {
  /**
   * This function This function validates the add members form if there are no empty fields.
   * @returns the validation array containing each boolean result
   */
  addMemberValidation: function () {
    const validation = [
      check('first_name', 'First name is required').notEmpty(),
      check('middle_name', 'Middle name is invalid').notEmpty().isLength({ min: 1, max: 1 }),
      check('last_name', 'Last name is required').notEmpty(),
      check('membership_status', 'Membership status is required').notEmpty(),
      check('birthday', 'Birthday is required').notEmpty().isDate(),
      check('occupation', 'Occupation is required').notEmpty(),
      check('sex').custom((value, req) => {
        if (validator.isEmpty(value)) {
          throw new Error('Sex is required')
        } else {
          switch (value) {
            case 'Male':
            case 'Female':
              return true
            default: throw Error('Invalid sex')
          }
        }
      }),
      check('email').custom((value, req) => {
        if (!validator.isEmpty(value) && !validator.isEmail(value)) {
          throw new Error('Invalid email')
        }
        return true
      }),
      check('mobile').custom((value, req) => {
        const regex = /^([+]\d{2,3})?\d{10}$/

        if (validator.isEmpty(value) ||
            validator.isNumeric(value) ||
            regex.test(value)) {
          return true
        } else {
          throw new Error('Invalid mobile number')
        }
      }),
      check('telephone').custom((value, req) => {
        const regex = /^([+][0-9]*)?/
        const localRegex = /^([(]\d{2,3}[)]){0,1}(\d{3}[-]\d{4}|\d{7})$/
        if (validator.isEmpty(value) ||
           validator.isNumeric(value) ||
           regex.test(value) ||
           localRegex.test(value)) {
          return true
        } else {
          throw new Error('Invalid telephone number')
        }
      }),
      check('address_line', 'Address is required').notEmpty(),
      check('city', 'City is required').notEmpty(),
      check('country', 'Country is required').notEmpty()
    ]
    return validation
  },

  addDedicationValidation: function () {
    const validation = [
      check('child').custom(function (value, req) {
        if (value.isMember === null || value.isMember === undefined) {
          if (value.first_name === null || value.first_name === undefined) {
            throw new Error('First name is required')
          } else if (value.mid_name === null || value.mid_name === undefined) {
            throw new Error('Middle Initial is required')
          } else if (value.last_name === null || value.last_name === undefined) {
            throw new Error('Last name is required')
          } else {
            return true
          }
        } else {
          if (value.person_id !== null && value.person_id !== undefined) {
            return true
          } else {
            throw new Error('Invalid Person ID')
          }
        }
      })
    ]

    return validation
  },

  /**
   * This function validates the church form if there are no empty required fields.
   * @returns the validation array containing each boolean result
   */
  churchValidation: function () {
    const validation = [
      check('church_name', 'Church name is required').notEmpty(),
      check('church_address_line', 'Address is required').notEmpty(),
      check('church_city', 'City is required').notEmpty(),
      check('church_province', 'State/Province/Region is required').notEmpty(),
      check('church_country', 'Country is required').notEmpty()
    ]

    return validation
  },

  /**
   * This function validates the observation form if there are no empty fields.
   * @returns the validation array containing each boolean result
   */
  observationValidation: function () {
    const validation = [
      check('observer', 'Observer is required').notEmpty(),
      check('comment', 'Comment is required').notEmpty(),
      check('observee', 'Observee is required').notEmpty(),
      check('observee', 'Invalid member id').isNumeric()
    ]

    return validation
  },

  /**
   * This function validates the add pre-nuptial form if there are no empty fields.
   * @returns the validation array containing each boolean result
   */
  addPrenupValidation: function () {
    const validation = [
      check('bride_first_name', "Bride's first name is required").notEmpty(),
      check('bride_mid_name', "Bride's middle name is required").notEmpty(),
      check('bride_last_name', "Bride's last name is required").notEmpty(),
      check('groom_first_name', "Groom's first name is required").notEmpty(),
      check('groom_mid_name', "Groom's middle name is required").notEmpty(),
      check('groom_last_name', "Groom's last name is required").notEmpty(),
      check('current_date', 'Current date is required').notEmpty().isDate(),
      check('wedding_date', 'Wedding date is required').notEmpty().isDate()
    ]
    return validation
  },
  addMemberPrenupValid: function () {
    const validation = [
      check('input_bride_member', "Bride's member and name is required").notEmpty(),
      check('input_groom_member', "Groom's member and name is required"),
      check('current_date', 'Current date is required').notEmpty().isDate(),
      check('wedding_date', 'Wedding date is required').notEmpty().isDate()
    ]
    return validation
  },
  /*
  app.post('/addPrenupBrideNonMember', validation.addPrenupBrideNonMember(), prenupController.createPrenupBrideNonMember)
  app.post('/addPrenupGroomNonMember', validation.addPrenupGroomNonMember(), prenupController.createPrenupGroomNonMember)
  */
  addPrenupBrideNonMember: function () {
    const validation = [
      check('bride_first_name', "Bride's member and name is required").notEmpty(),
      check('bride_mid_name', "Bride's middle name is required").notEmpty(),
      check('bride_last_name', "Bride's last name is required").notEmpty(),
      check('input_groom_member', "Groom's member and name is required"),
      check('current_date', 'Current date is required').notEmpty().isDate(),
      check('wedding_date', 'Wedding date is required').notEmpty().isDate()
    ]
    return validation
  },
  addPrenupGroomNonMember: function () {
    const validation = [
      check('groom_first_name', "Groom's member and name is required").notEmpty(),
      check('groom_mid_name', "Groom's middle name is required").notEmpty(),
      check('groom_last_name', "Groom's last name is required").notEmpty(),
      check('input_bride_member', "Bride's member and name is required"),
      check('current_date', 'Current date is required').notEmpty().isDate(),
      check('wedding_date', 'Wedding date is required').notEmpty().isDate()
    ]
    return validation
  }
}

module.exports = validation
