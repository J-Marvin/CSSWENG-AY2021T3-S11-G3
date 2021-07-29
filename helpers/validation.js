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
      check('middle_name', 'Middle name is required').notEmpty(),
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
      check('mobile', 'Invalid mobile number').isNumeric()
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
  }
}

module.exports = validation
