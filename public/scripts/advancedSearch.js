$(document).ready(function () {
    $('#record-type').change(function() {
        var selectedValue = $(this).val()
        if(selectedValue === 'member-option') {
            $('#member-record').show()
            $('#prenup-record').hide()
            $('#wedding-record').hide()
            $('#baptismal-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'prenup-option') {
            $('#prenup-record').show()
            $('#member-record').hide()
            $('#wedding-record').hide()
            $('#baptismal-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'wedding-option') {
            $('#wedding-record').show()
            $('#prenup-record').hide()
            $('#member-record').hide()
            $('#baptismal-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'baptismal-option') {
            $('#baptismal-record').show()
            $('#prenup-record').hide()
            $('#wedding-record').hide()
            $('#member-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'dedication-option') {
            $('#dedication-record').show()
            $('#prenup-record').hide()
            $('#wedding-record').hide()
            $('#baptismal-record').hide()
            $('#member-record').hide()
        }
    })

    $('#birthday-checkbox').change(function() {
        $(this).attr('disabled', true)
        $('#age-checkbox').removeAttr('disabled')
        $('#age-checkbox').prop('checked', false)
        $('.age-div').hide()
        $('.birthday-range').show()
    })

    $('#age-checkbox').change(function() {
        $(this).attr('disabled', true)
        $('#birthday-checkbox').removeAttr('disabled')
        $('#birthday-checkbox').prop('checked', false)
        $('.birthday-range').hide()
        $('.age-div').show()
    })

    $('#membership_status').on('change', function() {
      const status = $('#membership_status').val()
      if (status === 'Active' || status === 'Inactive') {
        $('#membership_type').closest('div').show()
      }  else {
        $('#membership_type').closest('div').hide()
      }
    })
    
    $('#member-search-submit').click(function () {
        var isValid = true
        const ageChecked = $('#age-checkbox').is(':checked')
        const birthdayChecked = $('#birthday-checkbox').is(':checked')

        if(ageChecked && $('#ageFrom').val() > $('#ageTo').val()) {
            isValid = false
            $('#age_error').text('Age range start should not be greater than age range end')
        } else {
            $('#age_error').text('')
        }

        if(birthdayChecked && $('#birthdayFrom').val() > $('#birthdayTo').val()) {
            isValid = false
            $('#birthday_error').text('Birthday range start should not be later than Birthday range end')
        } else {
            $('#birthday_error').text('')
        }

        if($('#member_middle_name').val().length > 1) {
            isValid = false
            $('#member_middle_name_error').text('Middle initial should only contain 1 letter')
        } else {
            $('#member_middle_name_error').text('')
        }

        if(isValid === false) {
            $('#member-search-submit').prop('disabled', true)
        } else {
            $('#member-search-submit').prop('disabled', false)
        }
    })
    
    /* inside member form */
    $('#member_middle_name').blur(function () {
        if (validator.isEmpty($('#member_middle_name_error').val())) {
            $('#member_middle_name_error').text('')
            $('#member-search-submit').prop('disabled', false)
        }
    })

    $('#ageFrom').blur(function () {
        if (validator.isEmpty($('#age_error').val())) {
            $('#age_error').text('')
            $('#member-search-submit').prop('disabled', false)
        }
    })

    $('#ageTo').blur(function () {
        if (validator.isEmpty($('#age_error').val())) {
            $('#age_error').text('')
            $('#member-search-submit').prop('disabled', false)
        }
    })

    $('#birthdayFrom').blur(function () {
        if (validator.isEmpty($('#birthday_error').val())) {
            $('#birthday_error').text('')
            $('#member-search-submit').prop('disabled', false)
        }
    })

    $('#birthdayTo').blur(function () {
        if (validator.isEmpty($('#birthday_error').val())) {
            $('#birthday_error').text('')
            $('#member-search-submit').prop('disabled', false)
        }
    })

    $('#prenup-search-submit').click(function () {
        var isValid = true
        // date created
        if($('#prenup_date_created_from').val() > $('#prenup_date_created_to').val()) {
            isValid = false
            $('#prenup_date_created_error').text('Date Created range start should not be later than Date Created range end')
        } else {
            $('#prenup_date_created_error').text('')
        }

        // planned wedding
        if($('#prenup_date_wedding_from').val() > $('#prenup_date_wedding_to').val()) {
            isValid = false
            $('#prenup_date_wedding_error').text('Planned Wedding Date range start should not be later than Planned Wedding Date range end')
        } else {
            $('#prenup_date_wedding_error').text('')
        }

        // groom
        if($('#prenup_groom_mid_name').val().length > 1) {
            isValid = false
            $('#prenup_groom_middle_error').text("Groom's middle initial should only contain 1 letter")
        } else {
            $('#prenup_groom_middle_error').text('')
        }

        // bride
        if($('#prenup_bride_mid_name').val().length > 1) {
            isValid = false
            $('#prenup_bride_middle_error').text("Bride's middle initial should only contain 1 letter")
        } else {
            $('#prenup_bride_middle_error').text('')
        }

        if(isValid === false) {
            $('#prenup-search-submit').prop('disabled', true)
        } else {
            $('#prenup-search-submit').prop('disabled', false)
        }
    })

    /* inside prenup form */
    $('#prenup_date_created_from').blur(function () {
        if (validator.isEmpty($('#prenup_date_created_error').val())) {
            $('#prenup_date_created_error').text('')
            $('#prenup-search-submit').prop('disabled', false)
        }
    })

    $('#prenup_date_created_to').blur(function () {
        if (validator.isEmpty($('#prenup_date_created_error').val())) {
            $('#prenup_date_created_error').text('')
            $('#prenup-search-submit').prop('disabled', false)
        }
    })

    $('#prenup_date_wedding_from').blur(function () {
        if (validator.isEmpty($('#prenup_date_wedding_error').val())) {
            $('#prenup_date_wedding_error').text('')
            $('#prenup-search-submit').prop('disabled', false)
        }
    })

    $('#prenup_date_wedding_to').blur(function () {
        if (validator.isEmpty($('#prenup_date_wedding_error').val())) {
            $('#prenup_date_wedding_error').text('')
            $('#prenup-search-submit').prop('disabled', false)
        }
    })

    $('#prenup_groom_mid_name').blur(function () {
        if (validator.isEmpty($('#prenup_groom_middle_error').val())) {
            $('#prenup_groom_middle_error').text('')
            $('#prenup-search-submit').prop('disabled', false)
        }
    })

    $('#prenup_bride_mid_name').blur(function () {
        if (validator.isEmpty($('#prenup_bride_middle_error').val())) {
            $('#prenup_bride_middle_error').text('')
            $('#prenup-search-submit').prop('disabled', false)
        }
    })

    $('#wedding-search-submit').click(function () {
        var isValid = true
        // date created
        if($('#wedding_date_from').val() > $('#wedding_date_to').val()) {
            isValid = false
            $('#wedding_date_error').text('Wedding Date range start should not be later than Wedding Date range end')
        } else {
            $('#wedding_date_error').text('')
        }

        // groom
        if($('#wedding_groom_middle_name').val().length > 1) {
            isValid = false
            $('#wedding_groom_middle_error').text("Groom's middle initial should only contain 1 letter")
        } else {
            $('#wedding_groom_middle_error').text('')
        }

        // bride
        if($('#wedding_bride_middle_name').val().length > 1) {
            isValid = false
            $('#wedding_bride_middle_error').text("Bride's middle initial should only contain 1 letter")
        } else {
            $('#wedding_bride_middle_error').text('')
        }

        // bride's mother
        if($('#wedding_bride_mother_middle_name').val().length > 1) {
            isValid = false
            $('#wedding_bride_mother_middle_error').text("The Bride's Mother's middle initial should only contain 1 letter")
        } else {
            $('#wedding_bride_mother_middle_error').text('')
        }

        // bride's father
        if($('#wedding_bride_father_middle_name').val().length > 1) {
            isValid = false
            $('#wedding_bride_father_middle_error').text("The Bride's Father's middle initial should only contain 1 letter")
        } else {
            $('#wedding_bride_father_middle_error').text('')
        }

        // groom's mother
        if($('#wedding_groom_mother_middle_name').val().length > 1) {
            isValid = false
            $('#wedding_groom_mother_middle_error').text("The Groom's Mother's middle initial should only contain 1 letter")
        } else {
            $('#wedding_groom_mother_middle_error').text('')
        }

        // groom's father
        if($('#wedding_groom_father_middle_name').val().length > 1) {
            isValid = false
            $('#wedding_groom_father_middle_error').text("The Groom's Father's middle initial should only contain 1 letter")
        } else {
            $('#wedding_groom_father_middle_error').text('')
        }

        if(isValid === false) {
            $('#wedding-search-submit').prop('disabled', true)
        } else {
            $('#wedding-search-submit').prop('disabled', false)
        }
    })

    /* inside wedding form */
    $('#wedding_date_from').blur(function () {
        if (validator.isEmpty($('#wedding_date_error').val())) {
            $('#wedding_date_error').text('')
            $('#wedding-search-submit').prop('disabled', false)
        }
    })

    $('#wedding_date_to').blur(function () {
        if (validator.isEmpty($('#wedding_date_error').val())) {
            $('#wedding_date_error').text('')
            $('#wedding-search-submit').prop('disabled', false)
        }
    })

    $('#wedding_groom_middle_name').blur(function () {
        if (validator.isEmpty($('#wedding_groom_middle_error').val())) {
            $('#wedding_groom_middle_error').text('')
            $('#wedding-search-submit').prop('disabled', false)
        }
    })

    $('#wedding_bride_middle_name').blur(function () {
        if (validator.isEmpty($('#wedding_bride_middle_error').val())) {
            $('#wedding_bride_middle_error').text('')
            $('#wedding-search-submit').prop('disabled', false)
        }
    })

    $('#wedding_bride_mother_middle_name').blur(function () {
        if (validator.isEmpty($('#wedding_bride_mother_middle_error').val())) {
            $('#wedding_bride_mother_middle_error').text('')
            $('#wedding-search-submit').prop('disabled', false)
        }
    })

    $('#wedding_bride_father_middle_name').blur(function () {
        if (validator.isEmpty($('#wedding_bride_father_middle_error').val())) {
            $('#wedding_bride_father_middle_error').text('')
            $('#wedding-search-submit').prop('disabled', false)
        }
    })

    $('#wedding_groom_mother_middle_name').blur(function () {
        if (validator.isEmpty($('#wedding_groom_mother_middle_error').val())) {
            $('#wedding_groom_mother_middle_error').text('')
            $('#wedding-search-submit').prop('disabled', false)
        }
    })

    $('#wedding_groom_father_middle_name').blur(function () {
        if (validator.isEmpty($('#wedding_groom_father_middle_error').val())) {
            $('#wedding_groom_father_middle_error').text('')
            $('#wedding-search-submit').prop('disabled', false)
        }
    })

    $('#baptismal-search-submit').click(function () {
        var isValid = true
        // baptismal date
        if($('#baptismal_date_from').val() > $('#baptismal_date_to').val()) {
            isValid = false
            $('#baptismal_date_error').text('Baptismal Date range start should not be later than Baptismal Date range end')
        } else {
            $('#baptismal_date_error').text('')
        }

        // baptism
        if($('#baptism_middle_name').val().length > 1) {
            isValid = false
            $('#baptism_middle_error').text('Middle initial should only contain 1 letter')
        } else {
            $('#baptism_middle_error').text('')
        }

        // officant
        if($('#baptism_officiant_middle_name').val().length > 1) {
            isValid = false
            $('#baptism_officiant_middle_error').text("Officiant's middle initial should only contain 1 letter")
        } else {
            $('#baptism_officiant_middle_error').text('')
        }

        if(isValid === false) {
            $('#baptismal-search-submit').prop('disabled', true)
        } else {
            $('#baptismal-search-submit').prop('disabled', false)
        }
    })

    /* inside baptismal form */
    $('#baptismal_date_from').blur(function () {
        if (validator.isEmpty($('#baptismal_date_error').val())) {
            $('#baptismal_date_error').text('')
            $('#baptismal-search-submit').prop('disabled', false)
        }
    })

    $('#baptismal_date_to').blur(function () {
        if (validator.isEmpty($('#baptismal_date_error').val())) {
            $('#baptismal_date_error').text('')
            $('#baptismal-search-submit').prop('disabled', false)
        }
    })

    $('#baptism_middle_name').blur(function () {
        if (validator.isEmpty($('#baptism_middle_error').val())) {
            $('#baptism_middle_error').text('')
            $('#baptismal-search-submit').prop('disabled', false)
        }
    })

    $('#baptism_officiant_middle_name').blur(function () {
        if (validator.isEmpty($('#baptism_officiant_middle_error').val())) {
            $('#baptism_officiant_middle_error').text('')
            $('#baptismal-search-submit').prop('disabled', false)
        }
    })

    $('#dedication-search-submit').click(function () {
        var isValid = true
        // date created
        if($('#dedication_date_from').val() > $('#dedication_date_to').val()) {
            isValid = false
            $('#dedication_date_error').text('Dedication Date range start should not be later than Dedication Date range end')
        } else {
            $('#dedication_date_error').text('')
        }

        // child
        if($('#dedication_middle_name').val().length > 1) {
            isValid = false
            $('#dedication_middle_name').text("Child's middle initial should only contain 1 letter")
        } else {
            $('#dedication_middle_name').text('')
        }

        // mother
        if($('#dedication_mother_middle_name').val().length > 1) {
            isValid = false
            $('#dedication_mother_middle_error').text("The Mother's middle initial should only contain 1 letter")
        } else {
            $('#dedication_mother_middle_error').text('')
        }

        // father
        if($('#dedication_father_middle_name').val().length > 1) {
            isValid = false
            $('#dedication_father_middle_error').text("The Father's middle initial should only contain 1 letter")
        } else {
            $('#dedication_father_middle_error').text('')
        }

        if(isValid === false) {
            $('#dedication-search-submit').prop('disabled', true)
        } else {
            $('#dedication-search-submit').prop('disabled', false)
        }
    })
    /* inside dedication form */
    $('#dedication_date_from').blur(function () {
        if (validator.isEmpty($('#dedication_date_error').val())) {
            $('#dedication_date_error').text('')
            $('#dedication-search-submit').prop('disabled', false)
        }
    })

    $('#dedication_date_to').blur(function () {
        if (validator.isEmpty($('#dedication_date_error').val())) {
            $('#dedication_date_error').text('')
            $('#dedication-search-submit').prop('disabled', false)
        }
    })

    $('#dedication_middle_name').blur(function () {
        if (validator.isEmpty($('#dedication_middle_error').val())) {
            $('#dedication_middle_error').text('')
            $('#dedication-search-submit').prop('disabled', false)
        }
    })

    $('#dedication_mother_middle_name').blur(function () {
        if (validator.isEmpty($('#dedication_mother_middle_error').val())) {
            $('#dedication_mother_middle_error').text('')
            $('#dedication-search-submit').prop('disabled', false)
        }
    })

    $('#dedication_father_middle_name').blur(function () {
        if (validator.isEmpty($('#dedication_father_middle_error').val())) {
            $('#dedication_father_middle_error').text('')
            $('#dedication-search-submit').prop('disabled', false)
        }
    })
})