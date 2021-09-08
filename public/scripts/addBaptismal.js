$(document).ready(function() {
  const member = $('#input_member').selectize()
  const officiant = $('#input_officiant_member').selectize()

  
  initSelectize()
  if ($('#input_member').data('member-id')) {
    const value = $('div [data-value^="' + $('#input_member').data('member-id')+ '"]').data('value')
    $(member)[0].selectize.setValue(value)
    initSelectize()
  } 

  $('select').change(function () {

    const prev = $(this).data('prev')

    if (prev !== null && prev !== undefined) {
      selectizeEnable(prev)
    }
    
    selectizeDisable($(this).val())
    $(this).data('prev', $(this).val())
  })

  $('#officiant_member').click( function () {
    $('#officiant_non_member_div').hide()
    $('#officiant_member_div').show()
    $('#officiant_first_name').val('')
    $('#officiant_middle_name').val('')
    $('#officiant_last_name').val('')

  })

  $('#officiant_non_member').click(function () {
    $('#officiant_member_div').hide()
    $('#officiant_non_member_div').show()
    selectizeEnable($('#input_officiant_member').val())
    $(officiant)[0].selectize.setValue('0')
  })

  $('#create-baptismal').click( function () {
    
    $('#create-baptismal').prop('disabled', true)
    if (validateFields()) {
      const data = {}
      const member = $('#input_member').val().split(', ')
      data.personId = member[1]
      data.date = new Date($('#date').val()).toISOString()
      data.currentDate = new Date().toISOString()
      data.location = $('#location').val()

      data.officiant = JSON.stringify(getDetails($('#officiant_member'), null, $('#input_officiant_member'), $('#officiant_first_name'), $('#officiant_mid_name'), $('#officiant_last_name')))
      console.log(data.officiant)
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
    $('#input_officiant_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
  }

  function selectizeDisable(data) {
    $('#input_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_officiant_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
  }

  function initSelectize() {
    $(member)[0].selectize.refreshOptions()
    $(officiant)[0].selectize.refreshOptions()

    $('.selectize-dropdown').hide();
    $('.selectize-input').removeClass('focus input-active dropdown-active');
    $('div.selectize-input > input').blur();
  }

  function validateFields() {
    var isValid = true
    var hasMember = $('#input_member').val() !== '' && $('#input_member').val() !== '0'
    var hasLocation = !validator.isEmpty($('#location').val())
    var hasDate = !validator.isEmpty($('#date').val())
    
    var officiantIsMember = $('#officiant_member').is(':checked')
    var officiantHasMember = $('#input_officiant_member').val() !== '' && $('#input_officiant_member').val() !== '0'
    var officiantHasFirstName = !validator.isEmpty($('#officiant_first_name').val())
    var officiantHasMidName = !validator.isEmpty($('#officiant_mid_name').val())
    var officiantIsValidMidName = validator.isLength($('#officiant_mid_name').val(), {min: 1, max: 1})
    var officiantHasLastName = !validator.isEmpty($('#officiant_last_name').val())

    if (!hasMember) {
      isValid = false
      $('#member_error').text('Please select member')
    } else {
      $('#member_error').text('')
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

    if (officiantIsMember) {
      if (!officiantHasMember) {
        isValid = false
        $('#officiant_error').text('Please select member')
      } else {
        $('#officiant_error').text('')
      }
    } else {
      if (!officiantHasFirstName || !officiantHasLastName || !officiantHasLastName) {
        isValid = false
        $('#officiant_error').text('Please fill up all fields')
      } else if(!officiantIsValidMidName) {
        isValid = false
        $('#officiant_error').text('Middle initial should only contain one letter')
      } else {
        $('#officiant_error').text('')
      }
    }


    return isValid
  }

  function getDetails(memberBox, noneBox, selectField, firstNameField, midNameField, lastNameField) {
    if (noneBox !== null && $(noneBox).is(':checked')) {
      return null
    } else {
      const person = {}

      person.isMember = $(memberBox).is(':checked')

      if (person.isMember) {
        const info = $(selectField).find(':selected').val().split(', ')
        person.person_id = info[1]
        person.member_id = info[0]
      } else {
        person.first_name = toTitleCase($(firstNameField).val())
        person.mid_name = $(midNameField).val().toUpperCase()
        person.last_name = toTitleCase($(lastNameField).val())
      }
      return person
    }
  }

  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
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