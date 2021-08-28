$(document).ready(function() {
  const member = $('#input_member').selectize()
  initSelectize()
  $('#input_member').change(function () {

    const prev = $(this).data('prev')

    if (prev !== null && prev !== undefined) {
      selectizeEnable(prev)
    }
    
    selectizeDisable($('#input_member').val())
    $(this).data('prev', $('#input_member').val())
  })

  $('#create-baptismal').click( function () {
    
    $('#create-baptismal').prop('disabled', true)
    if (validateFields()) {
      const data = {}
      const member = $('#input_member').val().split(', ')
      data.memberId = member[0]
      data.date = new Date($('#date').val()).toISOString()
      data.currentDate = new Date().toISOString()
      data.officiant = $('#officiant').val()
      data.location = $('#location').val()

      $.ajax({
        type: 'POST',
        url: '/add_baptismal',
        data: data,
        success: function (result) {
          if (result) {
            // alert(result)
            location.href = '/view_baptismal/' + result
          } else {
            $('#create-baptismal').prop('disabled', false)
            $('#create_error').text('Error Adding Baptismal Record')
          }
        }
      })
    } else {
      $('#create-baptismal').prop('disabled', false)
    }
  } )

  function selectizeEnable(data) {
    $('#input_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
  }

  function selectizeDisable(data) {
    $('#input_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
  }

  function initSelectize() {
    $(member)[0].selectize.refreshOptions()

    $('.selectize-dropdown').hide();
    $('.selectize-input').removeClass('focus input-active dropdown-active');
    $('div.selectize-input > input').blur();
  }

  function validateFields() {
    var isValid = true
    var hasMember = $('#input_member').val() !== '' && $('#input_member').val() !== '0'
    var hasLocation = !validator.isEmpty($('#location').val())
    var hasDate = !validator.isEmpty($('#date').val())
    var hasOfficiant = !validator.isEmpty($('#officiant').val())

    if (!hasMember) {
      isValid = false
      $('#member_error').text('Please select member')
    } else {
      $('member_error').text('')
    }

    if (!hasDate) {
      isValid = false
      $('#date_error').text('Please add date')
    } else {
      $('#date_error').text('')
    }

    if (!hasLocation) {
      isValid = false
      $('#location_error').text('Please add location')
    } else {
      $('#location_error').text('')
    }

    if (!hasOfficiant) {
      isValid = false
      $('#officiant_error').text('Please add officiant')
    } else {
      $('#officiant_error').text('')
    }

    return isValid
  }

  $('#input_member').blur(function() {
    if (validator.isEmpty($('#member_error').val())) {
      $('#member_error').text('')
    }
  })

  $('#location').blur(function() {
    if (validator.isEmpty($('#location_error').val())) {
      $('#location_error').text('')
    }
  })

  $('#date').blur(function() {
    if (validator.isEmpty($('#date_error').val())) {
      $('#date_error').text('')
    }
  })

  $('#officiant').blur(function() {
    if (validator.isEmpty($('#officiant_error').val())) {
      $('#officiant_error').text('')
    }
  })
})