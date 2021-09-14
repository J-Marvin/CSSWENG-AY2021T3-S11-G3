$(document).ready(function() {
  const member = $('#input_member').selectize()
  const officiant = $('#input_officiant_member').selectize()
  var currPerson = {}

  initSelectize()
  initSelectizeOptions()

  function initSelectizeOptions() {
    selectizeDisable(getValue($('#member_div').data('member')))
    selectizeDisable(getValue($('#officiant_member_div').data('member')))
  }

  $('select').change(function () {
    const prev = $(this).data('prev')

    if (prev !== null && prev !== undefined) {
      selectizeEnable(prev)
    }
    
    selectizeDisable($(this).val())
    $(this).data('prev', $(this).val())
  })

  $('#officiant_member').change(function () {
    $('#officiant_non_member_div').hide()
    $('#officiant_member_div').show()

    selectizeEnable($('#input_officiant_member').val())

    let officiantId = currPerson.memberId
    let value = '0'
    if (officiantId !== null && officiantId !== undefined && officiantId !== '') {
      value = getValue(officiantId)
    } 
    $(officiant)[0].selectize.setValue(value)
  })

  $('#officiant_non_member').change(function () {
    $('#officiant_member_div').hide()
    $('#officiant_non_member_div').show()

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#officiant_first_name').val('')
      $('#officiant_mid_name').val('')
      $('#officiant_last_name').val('')
    } else {
      $('#officiant_first_name').val(currPerson.firstName)
      $('#officiant_mid_name').val(currPerson.midName)
      $('#officiant_last_name').val(currPerson.lastName)
    }
  })

  $('#edit_member').click(function () {
    let memberId = $('#member_div').data('member')
    currPerson.memberId = memberId
    const value = $('div [data-value^="' + memberId + '"]').data('value')
    $(member)[0].selectize.setValue(value)
    $('#editMemberModal').modal('show')
  })

  $('#edit_officiant').click(function () {
    const person = $('#officiant_member_div')
    currPerson.memberId = $(person).data('member')
    currPerson.firstName = $('#officiant_first_name_view').text()
    currPerson.midName = $('#officiant_mid_name_view').text()
    currPerson.lastName = $('#officiant_last_name_view').text()

    
    if (currPerson.memberId != null && currPerson.memberId !== undefined && currPerson.memberId !== '') {
      $(officiant)[0].selectize.setValue(getValue(currPerson.memberId))
    } else {
      $('#officiant_member_div').hide()
      $('#officiant_non_member_div').show()
      $('#officiant_non_member').prop('checked', true)
      $('#officiant_first_name').val(currPerson.firstName)
      $('#officiant_mid_name').val(currPerson.midName)
      $('#officiant_last_name').val(currPerson.lastName)
    }

    $('#editOfficiantModal').modal('show')
  })

  $('#save_edit_member').click(function () {
    if (validateMember()) {
      const oldMemberId = $('#member_div').data('member')
      const oldPersonId = $('#member_div').data('person')
      const recordId = $('#baptismal_info').data('baptismal')
      const info = $('#input_member').find(':selected').val().split(', ')
      const newPersonId = info[1]

      data = {
        oldPersonId: oldPersonId,
        newPersonId: newPersonId,
        recordId: recordId
      }
      $.ajax({
        type: 'PUT',
        url: '/update_bap/member',
        data: data,
        success: function (result) {
          // alert(result)
          if (result) {
            $('#editMemberModal').modal('hide')
            $('#member_div').data('member', info[0]) // member id
            $('#member_div').data('person', info[1]) // person id
            $('#first_name').text(info[2]) // first name
            $('#mid_name').text(info[3]) // middle name
            $('#last_name').text(info[4]) // last name
          } else {
            $('#modal_error').text('Error Editing Record')
          }
        }
      })
    }
  })

  $('#edit-baptismal').click(function () {
    $('#edit-baptismal').prop('disabled', true)
    if (validateMisc()) {
      const data = {
        location: $('#location').val(),
        date: new Date($('#date').val()).toISOString(),
        recordId: $('#baptismal_info').data('baptismal')
      }
  
      $.ajax({
        type: 'PUT',
        url: '/update_bap',
        data: data,
        success: function (result) {
          if (result) {
            location.href = '/view_baptismal/' + data.recordId
          } else {
            $('#modal_error').text('Error Editing Record')
            $('#edit-baptismal').prop('disabled', false)
          }
        }
      })
    } else {
      $('#edit-baptismal').prop('disabled', false)
    }
  })

  $('#save_edit_officiant').click(function () {
    // insert validation
    $('#save_edit_officiant').prop('disabled', true)
    if (validateOfficiant()) {
      let officiantId = $('#officiant_member_div').data('member')
      let officiantPersonId = $('#officiant_member_div').data('person')
      let info = $('#input_officiant_member').val().split(', ')

      const data = {
        isOldMember: officiantId !== null && officiantId !== undefined && officiantId !== '',
        person: getDetails($('#officiant_member'), null, $('#input_officiant_member'), $('#officiant_first_name'), $('#officiant_mid_name'), $('#officiant_last_name')),
        recordId: $('#baptismal_info').data('baptismal'),
        oldMemberId: officiantId,
        oldPersonId: officiantPersonId
      }

      data.person.personId = info[1]
      data.person = JSON.stringify(data.person)

      console.log(info)
      console.log(JSON.parse(data.person))

      $.ajax({
        type: 'PUT',
        url: '/update_bap/officiant',
        data: data,
        success: function (result) {
          if (result) {
            const personInfo = JSON.parse(data.person)
            console.log(personInfo)
            if (personInfo.isMember) {
              $('#officiant_member_div').data('member', personInfo.memberId)
              $('#officiant_member_div').data('person', info[1])
              $('#officiant_first_name_view').html(info[2])
              $('#officiant_mid_name_view').html(info[3])
              $('#officiant_last_name_view').html(info[4])
              $('#save_edit_officiant').prop('disabled', false)
            } else {
              $('#officiant_member_div').data('member', null)
              $('#officiant_member_div').data('person', result)
              $('#officiant_first_name_view').html(personInfo.firstName)
              $('#officiant_mid_name_view').html(personInfo.midName)
              $('#officiant_last_name_view').html(personInfo.lastName)
              $('#save_edit_officiant').prop('disabled', false)
            }
            $('#editOfficiantModal').modal('hide')
          } else {
            $('#create_error').text('Error Editing Officiant')
            $('#save_edit_officiant').prop('disabled', false)
          }
        }
      })
    } else {
      $('#save_edit_officiant').prop('disabled', false)
    }
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

  function validateMember() {
    var hasMember = $('#input_member').val() !== '' && $('#input_member').val() !== '0'

    if (!hasMember) {
      isValid = false
      $('#member_error').text('Please select member')
    } else {
      $('#member_error').text('')
    }

    return hasMember
  }

  function validateOfficiant() {
    var isValid = true
    var officiantIsMember = $('#officiant_member').is(':checked')
    var officiantHasMember = $('#input_officiant_member').val() !== '' && $('#input_officiant_member').val() !== '0'
    var officiantHasFirstName = !validator.isEmpty($('#officiant_first_name').val())
    var officiantHasMidName = !validator.isEmpty($('#officiant_mid_name').val())
    var officiantIsValidMidName = validator.isLength($('#officiant_mid_name').val(), { min: 1, max: 1 })
    var officiantHasLastName = !validator.isEmpty($('#officiant_last_name').val())

    if (officiantIsMember) {
      if (!officiantHasMember) {
        isValid = false
        $('#officiant_error').text('Please select member')
      } else {
        $('#officiant_error').text('')
      }
    } else {
      if (!officiantHasFirstName || !officiantHasMidName || !officiantHasLastName) {
        isValid = false
        $('#officiant_error').text('Please fill up all fields')
      } else if (!officiantIsValidMidName) {
        isValid = false
        $('#officiant_error').text('Middle initial should only contain one letter')
      } else if ($('#officiant_mid_name').val().length > 1) {
        isValid = false
        $(errorField).text("Middle initial should only contain 1 letter")
      }
    }

    return isValid
  }

  function validateMisc() {
    var isValid = true
    var hasLocation = !validator.isEmpty($('#location').val())
    var hasDate = !validator.isEmpty($('#date').val())

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

    return isValid
  }

  $('.modal').on('hidden.bs.modal', function (e) {
    const val = $(this).find('select').val()
    if (val !== '0' && val !== '' && val !== 'undefined') {
      selectizeEnable(val)
    }
  })

  $('.modal').on('show.bs.modal', function (e) {
    initSelectizeOptions()
  })

})