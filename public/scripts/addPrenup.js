$(document).ready(function () {
  // $('.btn-primary').click(function () {
  //   // if disabled, it is checked
  //   if ($('.container').is(':disabled')) {
  //     $('#form_id').attr('action', '/create_prenup')
  //   } else { // else prenup will be made to a member
  //     $('.container').attr('action', '/create_prenup_member')
  //   }
  // })
  // function checkBoxes () {
  //   // if checkbox for bride member is clicked/checked, change the form action
  //   if ($('#bride_member').is(':disabled') && $('#groom_member').is(':disabled')) {
  //     $('#prenup_form').attr('action', '/create_prenup_member') // both partners are members
  //   } else {
  //     $('#prenup_form').attr('action', '/create_member') // both partners are non-members
  //   }
  // }
  // checkBoxes()

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

    if(isValid) {
      //alert('submit')
      $('#prenup_form').submit()
    }
  })
})
