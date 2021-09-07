$(document).ready(function () {

    $('#btn-passwords').click(function() {
        $('#btn-database').css('border-bottom' , '2px solid white')
        $('#btn-passwords').css('border-bottom' , '2px solid black')
        $('#database-div').hide()
        $('#passwords-div').show()
    })

    $('#btn-database').click(function() {
        $('#btn-passwords').css('border-bottom' , '2px solid white')
        $('#btn-database').css('border-bottom' , '2px solid black')
        $('#passwords-div').hide()
        $('#database-div').show()

        $('#level-one-enter-pass').hide()
        $('#level-two-enter-pass').hide()
        $('#level-three-enter-pass').hide()
        
        $('#level-one-conf-pass').hide()
        $('#level-two-conf-pass').hide()
        $('#level-three-conf-pass').hide()
    })

    $('#edit-low').click(function() {
        var isValid = true

        if(validator.isEmpty($('#password-low').val())) {
            isValid = false
            $('#level-one-enter-pass').show()
            $('#level-two-enter-pass').hide()
            $('#level-three-enter-pass').hide()
            $('#level-two-conf-pass').hide()
            $('#level-three-conf-pass').hide()
        } else {
            $('#level-one-enter-pass').hide()
            $('#level-two-enter-pass').hide()
            $('#level-three-enter-pass').hide()
            $('#level-two-conf-pass').hide()
            $('#level-three-conf-pass').hide()
        }

        if($('#password-low').val() !== $('#password-low-conf').val()) {
            isValid = false
            $('#level-one-conf-pass').text('Does not match password entered')
            $('#level-one-conf-pass').show()
            $('#level-two-enter-pass').hide()
            $('#level-three-enter-pass').hide()
            $('#level-two-conf-pass').hide()
            $('#level-three-conf-pass').hide()
        } else {
            $('#level-one-conf-pass').hide()
            $('#level-two-enter-pass').hide()
            $('#level-three-enter-pass').hide()
            $('#level-two-conf-pass').hide()
            $('#level-three-conf-pass').hide()
        }
        
        if(isValid) {
            $('#edit-password-submit').text("Edit level 1 password");
            $('#password-confirmation-modal').modal('toggle')
        }
    })

    $('#edit-med').click(function() {
        var isValid = true

        if(validator.isEmpty($('#password-med').val())) {
            isValid = false
            $('#level-two-enter-pass').show()
            $('#level-one-enter-pass').hide()
            $('#level-three-enter-pass').hide()
            $('#level-one-conf-pass').hide()
            $('#level-three-conf-pass').hide()
        } else {
            $('#level-two-enter-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-three-enter-pass').hide()
            $('#level-one-conf-pass').hide()
            $('#level-three-conf-pass').hide()
        }

        if($('#password-med').val() !== $('#password-med-conf').val()) {
            isValid = false
            $('#level-two-conf-pass').text('Does not match password entered')
            $('#level-two-conf-pass').show()
            $('#level-one-enter-pass').hide()
            $('#level-three-enter-pass').hide()
            $('#level-one-conf-pass').hide()
            $('#level-three-conf-pass').hide()
        } else {
            $('#level-two-conf-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-three-enter-pass').hide()
            $('#level-one-conf-pass').hide()
            $('#level-three-conf-pass').hide()
        }

        if(isValid) {
            $('#edit-password-submit').text("Edit level 2 password");
            $('#password-confirmation-modal').modal('toggle')
        }
        
    })

    $('#edit-high').click(function() {
        var isValid = true
        
        if(validator.isEmpty($('#password-high').val())) {
            isValid = false
            $('#level-three-enter-pass').show()
            $('#level-two-enter-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-two-conf-pass').hide()
            $('#level-one-conf-pass').hide()
        } else {
            $('#level-three-enter-pass').hide()
            $('#level-two-enter-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-two-conf-pass').hide()
            $('#level-one-conf-pass').hide()
        }

        if($('#password-high').val() !== $('#password-high-conf').val()) {
            isValid = false
            $('#level-three-conf-pass').text('Does not match password entered')
            $('#level-three-conf-pass').show()
            $('#level-two-enter-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-two-conf-pass').hide()
            $('#level-one-conf-pass').hide()     
        } else {
            $('#level-three-conf-pass').hide()
            $('#level-two-enter-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-two-conf-pass').hide()
            $('#level-one-conf-pass').hide()
        }

        if(isValid) {
            $('#edit-password-submit').text("Edit level 3 password");
            $('#password-confirmation-modal').modal('toggle')
        }
    })
})