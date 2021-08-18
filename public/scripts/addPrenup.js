function display_div_bride (status) {
    
  if(status === "bride_non_member") {
    document.getElementById("bride_member_div").style.display = "none"
    document.getElementById("bride_member").checked = false
    document.getElementById("bride_member").removeAttribute("disabled")
    document.getElementById("bride_non_member").setAttribute("disabled", "disabled")
    $("#prenup_form").attr('action', '/create_prenup')
    
  }
  else {
    document.getElementById("bride_non_member_div").style.display = "none"
    document.getElementById("bride_non_member").checked = false
    document.getElementById("bride_non_member").removeAttribute("disabled")
    document.getElementById("bride_member").setAttribute("disabled", "disabled")
    $("#prenup_form").attr('action', '/create_prenup_member')
  }
  document.getElementById(status + "_div").style.display = "block"
}
function display_div_groom (status) {
  if(status === "groom_non_member") {
    document.getElementById("groom_member_div").style.display = "none"
    document.getElementById("groom_member").checked = false
    document.getElementById("groom_member").removeAttribute("disabled")
    document.getElementById("groom_non_member").setAttribute("disabled", "disabled")
    $("#prenup_form").attr('action', '/create_prenup')
  }
  else {
    document.getElementById("groom_non_member_div").style.display = "none"
    document.getElementById("groom_non_member").checked = false
    document.getElementById("groom_non_member").removeAttribute("disabled")
    document.getElementById("groom_member").setAttribute("disabled", "disabled")
    $("#prenup_form").attr('action', '/create_prenup_member')
  }
  document.getElementById(status + "_div").style.display = "block"
}
function checkMemberBoxesAndDate () {
  /*
    Checks if checkbox bride_non_member is checked by user AND 
    checkbox groom_non_member is NOT checked, then change the 
    'action' of the form to '/addPrenupBrideNonMember'
    ELSE: change the change the 
    'action' of the form to '/addPrenupGroomNonMember'
  */
  if ($('#bride_non_member').is(':checked') && $('#groom_non_member').is(':checked') !== true) {
    $('#prenup_form').attr('action', '/addPrenupBrideNonMember')
  
  } else if ($('#bride_non_member').is(':checked') !== true && $('#groom_non_member').is(':checked')) {
    $('#prenup_form').attr('action', '/addPrenupGroomNonMember')
  }

  // check if current date is empty
  if (!$('#current_date').val()) {
    $('#current_date').val(new Date().toISOString().slice(0,10))
  }
}

function validateMidInitial (mid) {
  const re = /[A-Z]/
  return re.test(mid)
}

$(document).ready(function () {

  $('select').selectize()

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
      $('#bride_middle_error').text('')
      $('#bride_middle_len_error').text('')
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
      $('#groom_middle_error').text('')
      $('#groom_middle_len_error').text('')
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

  $('#create-prenup').click(function() {
    $('#create-prenup').prop('disabled', true)
    var isValid = true

    var brideNonMember = validator.isEmpty($('#bride_first_name').val()) || validator.isEmpty($('#bride_mid_name').val()) || validator.isEmpty($('#bride_last_name').val())
    var brideMember = $('#input_bride_member').val() === '0' || $('#input_bride_member').val() === ''
    var brideMidLenOne = $('#bride_mid_name').val().length === 1

    var groomNonMember = validator.isEmpty($('#groom_first_name').val()) || validator.isEmpty($('#groom_mid_name').val()) || validator.isEmpty($('#groom_last_name').val())
    var groomMember = $('#input_groom_member').val() === '0' || $('#input_groom_member').val() === ''
    var groomMidLenOne = $('#groom_mid_name').val().length === 1

    var checkBrideNonMember = $('#bride_non_member').is(':checked')
    var checkBrideMember = $('#bride_member').is(':checked')

    var checkGroomNonMember = $('#groom_non_member').is(':checked')
    var checkGroomMember = $('#groom_member').is(':checked')

    /* 
      if checkbox for bride non-member is checked, then bride non-member fields should NOT be empty
      and brideMember selected dropdown is blank
    */
    if ((checkBrideNonMember) && (brideNonMember) && (brideMember === false)) {
      isValid = false
      $('#bride_info_error').text('The bride member selected in the dropdown should be empty')
      console.log('invalid1')
    } else {
      console.log('valid1')
    }

    /* 
      if checkbox for bride member is checked, then bride member selected dropdown is NOT blank
      and brideMember fields should NOT be empty
    */
    if ((checkBrideMember) && (brideNonMember === false) && (brideMember)) {
      isValid = false
      $('#bride_info_error').text('The bride non-member text fields should be empty')
      console.log('invalid2')
    } else {
      console.log('valid2')
    }

    /* 
      if checkbox for groom non-member is checked, then groom non-member fields should NOT be empty
      and groom member selected dropdown is blank
    */
    if ((checkGroomNonMember) && (groomNonMember) && (groomMember === false)) {
      isValid = false
      $('#groom_info_error').text('The groom member selected in the dropdown should be empty')
      console.log('invalid3')
    } else {
      console.log('valid3')
    }

    /* 
      if checkbox for groom member is checked, then groom member selected dropdown is NOT blank
      and groom member fields should NOT be empty
    */
    if ((checkGroomMember) && (groomNonMember === false) && (groomMember)) {
      isValid = false
      $('#groom_info_error').text('The groom non-member text fields should be empty')
      console.log('invalid4')
    } else {
      console.log('valid4')
    }

    // if bride fields are empty
    if((brideNonMember) && (brideMember)) {
      isValid = false
      $('#bride_info_error').text('Accomplish all fields')
    }

    // if bride non member fields are not empty and
    // middle initial text field is len > 1 and is not A-Z
    if (!brideNonMember && !brideMidLenOne) {
      isValid = false
      $('#bride_middle_len_error').text('Middle Initial should only contain 1 letter')
    }

    if (brideNonMember === false && validateMidInitial($('#bride_mid_name').val()) === false) {
      isValid = false
      $('#bride_middle_error').text('Middle Initial should only range from letters A-Z')
    }

    // if groom fields are empty
    if((groomNonMember) && (groomMember)) {
      isValid = false
      $('#groom_info_error').text('Accomplish all fields')
    }

    // if groom non member fields are not empty and
    // middle initial text field is len > 1 and is not A-Z
    if (!groomNonMember && !groomMidLenOne) {
      isValid = false
      $('#groom_middle_len_error').text('Middle Initial should only contain 1 letter')
    }

    if (groomNonMember === false && validateMidInitial($('#groom_mid_name').val()) === false) {
      isValid = false
      $('#groom_middle_error').text('Middle Initial should only range from letters A-Z')
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
    } else {
      $('#create-prenup').prop('disabled', false)
    }
  })

  function initDate() {
    let date = new Date().toISOString()
    document.getElementById('current_date').defaultValue = date.slice(0,10)
  }
  initDate()
})
