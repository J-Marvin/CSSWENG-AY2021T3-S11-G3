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
        $('#age-div').hide()
        $('.birthday-range').show()
    })

    $('#age-checkbox').change(function() {
        $(this).attr('disabled', true)
        $('#birthday-checkbox').removeAttr('disabled')
        $('#birthday-checkbox').prop('checked', false)
        $('.birthday-range').hide()
        $('#age-div').show()
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
        // place validation on dates and middle initials
    })

    $('#wedding-search-submit').click(function () {
        // place validation on dates and middle initials
    })

    $('#baptismal-search-submit').click(function () {
       // place validation on dates and middle initials
    })

    $('#dedication-search-submit').click(function () {
        // place validation on dates and middle initials
    })
})