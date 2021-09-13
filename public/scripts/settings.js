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

        if ($('#password-low').val().length < 8) {
            isValid = false
            $('#level-one-enter-pass').text('Password length should be at least 8 characters')
            $('#level-one-enter-pass').show()
            $('#level-one-conf-pass').hide()
            $('#level-two-enter-pass').hide()
            $('#level-three-enter-pass').hide()
            $('#level-two-conf-pass').hide()
            $('#level-three-conf-pass').hide()
        } else {
            $('#level-one-enter-pass').hide()
            $('#level-one-enter-pass').text('Please accomplish')
            $('#level-one-conf-pass').hide()
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

        if ($('#password-med').val().length < 8) {
            isValid = false
            $('#level-two-enter-pass').text('Password length should be at least 8 characters')
            $('#level-two-enter-pass').show()
            $('#level-two-conf-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-one-conf-pass').hide()
            $('#level-three-one-pass').hide()
            $('#level-three-conf-pass').hide()
        } else {
            $('#level-two-enter-pass').hide()
            $('#level-two-enter-pass').text('')
            $('#level-two-conf-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-one-conf-pass').hide()
            $('#level-three-one-pass').hide()
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

        if ($('#password-high').val().length < 8) {
            isValid = false
            $('#level-three-enter-pass').text('Password length should be at least 8 characters')
            $('#level-three-enter-pass').show()
            $('#level-three-conf-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-one-conf-pass').hide()
            $('#level-two-one-pass').hide()
            $('#level-two-conf-pass').hide()
        } else {
            $('#level-three-enter-pass').hide()
            $('#level-three-enter-pass').text('')
            $('#level-three-conf-pass').hide()
            $('#level-one-enter-pass').hide()
            $('#level-one-conf-pass').hide()
            $('#level-two-one-pass').hide()
            $('#level-two-conf-pass').hide()
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
            $('#edit-password-submit').text("Edit level 3 password")
            $('#password-confirmation-modal').modal('toggle')
        }
    })

    $('#edit-password-submit').click(function () {
        // level 1
        if ($('#edit-password-submit').text() === "Edit level 1 password") {
            const password = $('#password-low-conf').val()
            const currPass = $('#current_passwords').data('low')
            const confirmPass = $('#confirm-pass').val()
            const data = {
                level: '1',
                password: password
            }
            if (confirmPass !== '') {
                $.ajax({
                    type: 'POST',
                    url: '/postComparePasswords',
                    data: {
                        confirmPass: confirmPass,
                        currPass: currPass
                    },
                    success: function (result) {
                        if (result) {
                          sendAjax(data, '1')
                        } else {
                            $('#confirm-pass-error').text('Current password does not match!')
                        }
                    }
                })
            } else {
                $('#confirm-pass-error').text('Current password should not be empty!')
            }
        // level 2
        } else if ($('#edit-password-submit').text() === "Edit level 2 password") {
            const password = $('#password-med-conf').val()
            const currPass = $('#current_passwords').data('med')
            const confirmPass = $('#confirm-pass').val()
            const data = {
                level: '2',
                password: password
            }
            if (confirmPass !== '') {
                $.ajax({
                    type: 'POST',
                    url: '/postComparePasswords',
                    data: {
                        confirmPass: confirmPass,
                        currPass: currPass
                    },
                    success: function (result) {
                        if (result) {
                          sendAjax(data, '2')
                        } else {
                            $('#confirm-pass-error').text('Current password does not match!')
                        }
                    }
                })
            } else {
                $('#confirm-pass-error').text('Current password should not be empty!')
            }
        // level 3
        } else if ($('#edit-password-submit').text() === "Edit level 3 password") {
            const password = $('#password-high-conf').val()
            const currPass = $('#current_passwords').data('high')
            const confirmPass = $('#confirm-pass').val()
            const data = {
                level: '3',
                password: password
            }
            if (confirmPass !== '') {
                $.ajax({
                    type: 'POST',
                    url: '/postComparePasswords',
                    data: {
                        confirmPass: confirmPass,
                        currPass: currPass
                    },
                    success: function (result) {
                        if (result) {
                          sendAjax(data, '3')
                        } else {
                            $('#confirm-pass-error').text('Current password does not match!')
                        }
                    }
                })
            } else {
                $('#confirm-pass-error').text('Current password should not be empty!')
            }
        }
    })

    $('#delete-db').click(function () {
        $.ajax({
            type: 'POST',
            url: '/deleteAndReset',
            success: function (result) {
                if (result) {
                    $('#delete-db-message').text('Database has been deleted successfully!')
                    $('#delete-db-modal').modal('show')
                } else {
                    $('#delete-db-message').text('Error: Database is not deleted')
                    $('#delete-db-modal').modal('show')
                }
            }
        })
    })

    /*
      This function sends the post request to indexController for changing the password
    */
    function sendAjax (data, level) {
      $.ajax({
        type: 'POST',
        url: '/postChangePassword',
        data: data,
        success: function (result) {
            if (result) {
                $('#confirm-pass').val('')
                $('#confirm-pass-error').val('')
                $('#password-confirmation-modal').modal('hide')
                // success text: <insert level> Password has been changed successfully!
                if (level === '1') {
                    $('#success-password').text('Low Level Password has been changed successfully!')
                    $('#password-low').val('')
                    $('#password-low-conf').val('')
                } else if (level === '2') {
                    $('#success-password').text('Medium Level Password has been changed successfully!')
                    $('#password-med').val('')
                    $('#password-med-conf').val('')
                } else if (level === '3') {
                    $('#success-password').text('High Level Password has been changed successfully!')
                    $('#password-high').val('')
                    $('#password-high-conf').val('')
                }
                
                $('#password-success-modal').modal('show')
            } else {
                $('#confirm-pass-error').text('')
            }
          }
        })
    }
})