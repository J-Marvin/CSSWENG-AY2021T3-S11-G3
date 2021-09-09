function validateMidInitial (mid) {
  const re = /[A-Z]/
  return re.test(mid)
}

$(document).ready(function () {

  initSelectize()

  function initSelectize() {
    const brideSelect = $('#input_bride_member').selectize()
    const groomSelect = $('#input_groom_member').selectize()
    console.log($('#input_bride_member').data('bride'))
    console.log($('#input_groom_member').data('groom'))
    if ($('#input_bride_member').data('bride') !== null) {
      $(brideSelect)[0].selectize.setValue($('#input_bride_member').data('bride'))
      // $(brideSelect)[0].selectize.refreshOptions()
    }

    if ($('#input_groom_member').data('groom') !== null) {
      $(groomSelect)[0].selectize.setValue($('#input_groom_member').data('groom'))
      // $(groomSelect)[0].selectize.refreshOptions()
    }

    $('.selectize-dropdown').hide();
    $('.selectize-input').removeClass('focus input-active dropdown-active');
    $('div.selectize-input > input').blur();
  }

  $('#edit_bride').click(function() {
    $('#brideModal').modal('show')
  })

  $('#edit_groom').click(function() {
    $('#groomModal').modal('show')
  })

  $('#bride_non_member').change(function() {
    $('#bride_member').prop('checked', false)
    $('#bride_member').prop('disabled', false)
    $('#bride_member_div').hide()
    $('#bride_non_member_div').show()

    selectizeEnable($('#input_bride_member').val())
    $(brideSelect)[0].selectize.setValue('0')
  })

  $('#bride_member').change(function () {
    $('#bride_non_member').prop('checked', false)
    $('#bride_non_member').prop('disabled', false)
    $('#bride_member_div').show()
    $('#bride_non_member_div').hide()
  })

  $('#groom_non_member').change(function() {
    $('#groom_member').prop('checked', false)
    $('#groom_member').prop('disabled', false)
    $('#groom_member_div').hide()
    $('#groom_non_member_div').show()

    selectizeEnable($('#input_groom_member').val())
    $(groomSelect)[0].selectize.setValue('0')
  })

  $('#groom_member').change(function () {
    $('#groom_non_member').prop('checked', false)
    $('#groom_non_member').prop('disabled', false)
    $('#groom_member_div').show()
    $('#groom_non_member_div').hide()
  })

  $('#save_bride_btn').click(function() {
      var firstName = validator.isEmpty($('#bride_first_name').val())
      var midName =  validator.isEmpty($('#bride_mid_name').val())
      var lastName = validator.isEmpty($('#bride_last_name').val())

      var inputBride = validator.isEmpty($('#input_bride_member').val())

      var isValid = true;

      if($('#bride_non_member').is(':checked')) {
        if(firstName || midName || lastName) {
          isValid = false
          $('#bride_info_error').text('Accomplish all fields')
        } else {
          $('#bride_info_error').text('')
        }
      }

      if($('#bride_member').is(':checked')) {
        if(inputBride) {
          isValid = false
          $('#bride_info_error').text('Accomplish all fields')
        } else {
          $('#bride_info_error').text('')
        }
      }

      if(isValid) {
        submitBride()
      }
  })

  $('#save_groom_btn').click(function() {
    var firstName = validator.isEmpty($('#groom_first_name').val())
    var midName =  validator.isEmpty($('#groom_mid_name').val())
    var lastName = validator.isEmpty($('#groom_last_name').val())

    var inputgroom = validator.isEmpty($('#input_groom_member').val())

    var isValid = true;

    if($('#groom_non_member').is(':checked')) {
      if(firstName || midName || lastName) {
        isValid = false
        $('#groom_info_error').text('Accomplish all fields')
      } else {
        $('#groom_info_error').text('')
      }
    }

    if($('#groom_member').is(':checked')) {
      if(inputgroom) {
        isValid = false
        $('#groom_info_error').text('Accomplish all fields')
      } else {
        $('#groom_info_error').text('')
      }
    }

    if(isValid) {
      submitGroom()
    }
  })

  function submitBride() {
    alert('submit bride function')
  }

  function submitGroom() {
    alert('submit groom function')
  }
})