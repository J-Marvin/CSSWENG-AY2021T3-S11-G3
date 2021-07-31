$(document).ready(function() {

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase());
    }

    function validateMobile(number) {
        const re = /^\d{4}\s?-?\d{3}\s?-?\d{4}$/
        return re.test(number);
    }

    $(".validate-member").click(function() {
        var isValid = true
        var errors = ''
        
        if(validator.isEmpty($('#first_name').val())) {
            $('#first_name_error').text('Required')
            isValid = false
        } else {
            $('#first_name_error').text('')
        }

        if(validator.isEmpty($('#mid_name').val())) {
            $('#mid_name_error').text('Required')
            isValid = false
        } else {
            $('#mid_name_error').text('')
        }

        if(validator.isEmpty($('#last_name').val())) {
            $('#last_name_error').text('Required')
            isValid = false
        } else {
            $('#last_name_error').text('')
        }

        if(validator.isEmpty($('#age').val())) {
            $('#age_error').text('Required')
            isValid = false
        } else if ($('#age').val() < 0) {
            $('#age_error').text('Enter valid age')
            isValid = false
        } else {
            $('#age_error').text('')
        }

        if(validator.isEmpty($('#birthday').val())) {
            $('#birthday_error').text('Required')
            isValid = false
        } else {
            $('#birthday_error').text('')
        }

        if(validator.isEmpty($('#occupation').val())) {
            $('#occupation_error').text('Required')
            isValid = false
        } else {
            $('#occupation_error').text('')
        }

        if(validator.isEmpty($('#membership_status').val())) {
            $('#membership_status_error').text('Required')
            isValid = false
        } else {
            $('#membership_status_error').text('')
        }

        if(validator.isEmpty($('#civil_status').val())) {
            $('#civil_status_error').text('Required')
            isValid = false
        } else {
            $('#civil_status_error').text('')
        }

        if(validator.isEmpty($('#sex').val())) {
            $('#sex_error').text('Required')
            isValid = false
        } else {
            $('#sex_error').text('')
        }

        if(validator.isEmpty($('#address_line').val())) {
            $('#address_line_error').text('Required')
            isValid = false
        } else {
            $('#address_line_error').text('')
        }

        if(validator.isEmpty($('#city').val())) {
            $('#city_error').text('Required')
            isValid = false
        } else {
            $('#city_error').text('')
        }

        if(validator.isEmpty($('#country').val())) {
            $('#country_error').text('Required')
            isValid = false
        } else {
            $('#country_error').text('')
        }

        if (!validateEmail($('#email').val()) && !validator.isEmpty($('#email').val())) {
            $('#email_error').text('Enter valid email')
            isValid = false
        } else {
            $('#email_error').text('')
        }

        if(validator.isEmpty($('#mobile').val())) {
            $('#mobile_error').text('Required')
            isValid = false
        } else if(!validateMobile($('#mobile').val())) {
            $('#mobile_error').text('Enter valid mobile number')
            isValid = false
        } else {
            $('#mobile_error').text('')
        }

        if(isValid) {
            $('#create-member-form').submit()
        }
    })
})