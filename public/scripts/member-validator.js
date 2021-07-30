$(document).ready(function() {

    $("#create-member").click(function() {
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
        }

        if(validator.isEmpty($('#mobile').val())) {
            errors = errors + 'pls fill out first mobile\n'
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