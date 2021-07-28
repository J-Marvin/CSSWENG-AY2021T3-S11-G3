const { check } = require('express-validator')
const { default: validator } = require('validator')

const validation = {
  addMemberValidation: function () {
    const validation = [
      check('first_name', 'First name is required').notEmpty(),
      check('middle_name', 'Middle name is required').notEmpty(),
      check('last_name', 'Last name is required').notEmpty(),
      check('membership_status', 'Membership status is required').notEmpty(),
      check('birthday', 'Birthday is required').notEmpty().isDate(),
      check('occupation', 'Occupation is required').notEmpty(),
      check('sex', 'Sex is required').notEmpty(),
      check('email').custom((value, req) => {
        if (!validator.isEmpty(value) && !validator.isEmail(value)) {
          throw new Error('Invalid email')
        }

        return true
      }),
      check('mobile', 'Invalid mobile number').isNumeric()
    ]
    return validation
  }
}

module.exports = validation
