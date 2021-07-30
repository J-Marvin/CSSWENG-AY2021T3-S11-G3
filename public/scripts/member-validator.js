$(document).ready(function() {

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase());
    }

    function validateMobile(number) {
        const re = /\d{4}\s?-?\d{3}\s?-?\d{4}/
        return re.test(number);
    }

    $(".validate-member").click(function() {
        var isValid = true
        var errors = ''
        
        if(validator.isEmpty($('#first_name').val())) {
            errors = errors + 'pls fill out first name\n'
            isValid = false
        }

        if(validator.isEmpty($('#mid_name').val())) {
            errors = errors + 'pls fill out middle name\n'
            isValid = false
        }

        if(validator.isEmpty($('#last_name').val())) {
            errors = errors + 'pls fill out last name\n'
            isValid = false
        }

        if(validator.isEmpty($('#age').val())) {
            errors = errors + 'pls fill out age\n'
            isValid = false
        } else if (validator.isNumeric($('#age').val())) {
            errors = errors + 'age must only consist of numbers\n'
            isValid = false
        }

        if(validator.isEmpty($('#birthday').val())) {
            errors = errors + 'pls fill out birthday\n'
            isValid = false
        }

        if(validator.isEmpty($('#occupation').val())) {
            errors = errors + 'pls fill out occupation\n'
            isValid = false
        }

        if(validator.isEmpty($('#membership_status').val())) {
            errors = errors + 'pls fill out first mem status\n'
            isValid = false
        }

        if(validator.isEmpty($('#civil_status').val())) {
            errors = errors + 'pls fill out civil status\n'
            isValid = false
        }

        if(validator.isEmpty($('#sex').val())) {
            errors = errors + 'pls fill out sex\n'
            isValid = false
        }

        if(validator.isEmpty($('#address_line').val())) {
            errors = errors + 'pls fill out address line\n'
            isValid = false
        }

        if(validator.isEmpty($('#city').val())) {
            errors = errors + 'pls fill out city\n'
            isValid = false
        }

        if(validator.isEmpty($('#workplace').val())) {
            errors = errors + 'pls fill out workplace\n'
            isValid = false
        }

        if(validator.isEmpty($('#email').val())) {
            errors = errors + 'pls fill out email\n'
            isValid = false
        } else if (!validateEmail($('#email').val())) {
            errors = errors + 'pls provide valid email\n'
            isValid = false
        }

        if(validator.isEmpty($('#mobile').val())) {
            errors = errors + 'pls fill out mobile\n'
            isValid = false
        } else if(!validateMobile($('#mobile').val())) {
            errors = errors + 'pls provide valid mobile number\n'
            isValid = false
        }

        if(!isValid) {
            alert(errors)
        } else {
            alert('Success')
            $('#create-member-form').submit()
        }
    })
})