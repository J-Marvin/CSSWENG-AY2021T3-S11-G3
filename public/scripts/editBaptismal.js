$(document).ready(function() {
  const member = $('#input_member').selectize()
  const officiant = $('#input_officiant_member').selectize()

  initSelectize()
  
  $('select').change(function () {
    const prev = $(this).data('prev')

    if (prev !== null && prev !== undefined) {
      selectizeEnable(prev)
    }
    
    selectizeDisable($(this).val())
    $(this).data('prev', $(this).val())
  })


  $('#officiant_member').click(function () {
    $(this).prop('disabled', true)
    $('#officiant_non_member').prop('checked', false)
    $('#officiant_non_member').prop('disabled', false)
    $('#officiant_non_member_div').hide()
    $('#officiant_member_div').show()
    $('#officiant_first_name').val('')
    $('#officiant_middle_name').val('')
    $('#officiant_last_name').val('')

  })

  $('#officiant_non_member').click(function () {
    $(this).prop('disabled', true)
    $('#officiant_member').prop('checked', false)
    $('#officiant_member').prop('disabled', false)
    $('#officiant_member_div').hide()
    $('#officiant_non_member_div').show()
    selectizeEnable($('#input_officiant_member').val())
    let officiantId = $('#officiant_member_div').data('member')
    if (officiantId !== null && officiantId !== undefined && officiantId !== '') {
      const value = $('div [data-value^="' + officiantId + '"]').data('value')
      $(officiant)[0].selectize.setValue(value)
      selectizeDisable(value)
    } else {
      $(officiant)[0].selectize.setValue('0')
    }
  })

  $('#edit_member').click(function () {
    let memberId = $('#member_div').data('member')
    const value = $('div [data-value^="' + memberId + '"]').data('value')
    $(member)[0].selectize.setValue(value)
    $('#editMemberModal').modal('show')
  })

  $('#edit_officiant').click(function () {
    let officiantId = $('#officiant_member_div').data('member')
    if (officiantId !== null && officiantId !== undefined && officiantId !== '') {
      const value = $('div [data-value^="' + officiantId + '"]').data('value')
      $(officiant)[0].selectize.setValue(value)
    } else {
      $('#officiant_member_div').hide()
      $('#officiant_non_member_div').show()
      $('#officiant_first_name').val($('#officiant_first_name_view').text())
      $('#officiant_mid_name').val($('#officiant_mid_name_view').text())
      $('#officiant_last_name').val($('#officiant_last_name_view').text())
    }
    $('#editOfficiantModal').modal('show')
  })

  $('#save_edit_officiant').click(function () {
    // insert validation
    let officiantId = $('#officiant_member_div').data('member')
    let officiantPersonId = $('#officiant_member_div'.data('person'))

    data = {
      isOldMember: officiantId !== null && officiantId !== undefined && officiantId !== '',
      person: JSON.stringify(getDetails($('#officiant_member'), null, $('#input_officiant_member'), $('#officiant_first_name'), $('#officiant_mid_name'), $('#officiant_last_name'))),
      recordId: $('#prenup_info').data('baptismal'),
      oldMemberId: officiantId,
      oldPersonId: officiantPersonId
    }

    $.ajax({
      type: 'PUT',
      url: '/update_bap/officiant',
      data: data,
      success: function (result) {
        alert(result)
        if (result) {

        } else {
          $('#create_error').text('Error Editing Officiant')
        }
      }
    })
  })

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

    let memberId = $('#member_div').data('member')
    const value = $('div [data-value^="' + memberId + '"]').data('value')
    selectizeDisable(value)

    let officiantId = $('#officiant_member_div').data('member')
    if (officiantId !== null && officiantId !== undefined && officiantId !== '') {
      const value = $('div [data-value^="' + officiantId + '"]').data('value')
      selectizeDisable(value)
    }
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
})