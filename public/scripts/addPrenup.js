$(document).ready(function () {
  $('#bride_first_name').blur(function () {
    // if error message is empty
    if (validator.isEmpty($('#bride_info_error').val())) {
      $('#bride_info_error').text('')
    }
  })
  
  $('#bride_mid_name').blur(function () {
    // if error message is empty
    if (validator.isEmpty($('#bride_info_error').val())) {
      $('#bride_info_error').text('')
    }
  })

  $('#bride_last_name').blur(function () {
    // if error message is empty
    if (validator.isEmpty($('#bride_info_error').val())) {
      $('#bride_info_error').text('')
    }
  })

  $('#groom_first_name').blur(function () {
    // if error message is empty
    if (validator.isEmpty($('#groom_info_error').val())) {
      $('#groom_info_error').text('')
    }
  })
  
  $('#groom_mid_name').blur(function () {
    // if error message is empty
    if (validator.isEmpty($('#groom_info_error').val())) {
      $('#groom_info_error').text('')
    }
  })

  $('#groom_last_name').blur(function () {
    // if error message is empty
    if (validator.isEmpty($('#groom_info_error').val())) {
      $('#groom_info_error').text('')
    }
  })

  $('#current_date').blur(function () {
    if (validator.isEmpty($('#current_date_error').val())) {
      $('#current_date_error').text('')
    }
  })

  $('#wedding_date').blur(function () {
    if (validator.isEmpty($('#wedding_date_error').val())) {
      $('#wedding_date_error').text('')
    }
  })

  $('#input_bride_member').blur(function () {
    if (!$('#input_bride_member').val()) {
      $('#bride_info_error').text('')
    }
  })

  $('#input_groom_member').blur(function () {
    if (!$('#input_groom_member').val()) {
      $('#groom_info_error').text('')
    }
  })

  $('.confirmationModalBtn').click(function () {
    $('#confirmationModal').modal('hide');
  })

  $('#create-prenup').click(function() {
    var isValid = true

    var brideNonMember = validator.isEmpty($('#bride_first_name').val()) || validator.isEmpty($('#bride_mid_name').val()) || validator.isEmpty($('#bride_last_name').val())
    var brideMember = $('#input_bride_member').val() === '' || $('#input_bride_member').val() === null

    var groomNonMember = validator.isEmpty($('#groom_first_name').val()) || validator.isEmpty($('#groom_mid_name').val()) || validator.isEmpty($('#groom_last_name').val())
    var groomMember = $('#input_groom_member').val() === '' || $('#input_groom_member').val() === null

    if((brideNonMember) && (brideMember)) {
      isValid = false
      $('#bride_info_error').text('Accomplish all fields')
    } else {
      $('#bride_info_error').text('')
    }

    if((groomNonMember) && (groomMember)) {
      isValid = false
      $('#groom_info_error').text('Accomplish all fields')
    } else {
      $('#groom_info_error').text('')
    }

    if(validator.isEmpty($('#current_date').val())) {
      isValid = false
      $('#current_date_error').text('Select a date')
    } else {
      $('#current_date_error').text('')
    }

    if(validator.isEmpty($('#wedding_date').val())) {
      isValid = false
      $('#wedding_date_error').text('Select a date')
    } else {
      $('#wedding_date_error').text('')
    }

    if ($('#wedding_date').val() < $('#current_date').val()) {
      isValid = false
      $('#wedding_date_error').text('Wedding date should not be earlier than current date')
    } else {
      $('#wedding_date_error').text('')
    }

    if(isValid) {
      //alert('submit')
      $('#prenup_form').submit()
    }
  })

  $('#edit-prenup').click(function () {
    if (validateFields()) {
      const data = {
        member_id: $('#member_info').attr('data-member'),
        address_id: $('#member_info').attr('data-address'),
        person_id: $('#member_info').attr('data-person')
      }
      
      console.log("data")
      $.ajax({
        type: "POST",
        data: data,
        url: "/",
        success: function (result) {
          if (result === true)
            //location.href('/member/' + data.member_id)
            window.location = '/view_prenup/' + data.prenup_record_id
          else alert("Changes not saved")
        }
      })
    }
  })

  function initDate() {
    let date = new Date().toISOString()
    document.getElementById('current_date').defaultValue = date.slice(0,10)
  }
  initDate()
})
