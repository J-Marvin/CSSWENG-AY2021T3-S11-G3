function validateMidInitial (mid) {
  const re = /[A-Z]/
  return re.test(mid)
}
function selectizeEnable(data) {
  $('#input_bride_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
  $('#input_groom_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
}

$(document).ready(function () {
  const brideSelect = $('#input_bride_member').selectize()
  const groomSelect = $('#input_groom_member').selectize()
  let currPerson = {}

  initSelectize()

  function initSelectize() {
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
    currPerson.memberId = $('#bride-info').data('memberid')
    currPerson.personId = $('#bride-info').data('personid')
    currPerson.firstName = $('#bride_first_name_view').text()
    currPerson.midName = $('#bride_mid_name_view').text()
    currPerson.lastName = $('#bride_last_name_view').text()

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#bride_member').prop('checked', true)
      $('#bride_member_div').show()
      $('#bride_non_member_div').hide()
      $(brideSelect)[0].selectize.setValue(getValue(currPerson.memberId))
    } else {
      $('#bride_non_member').prop('checked', true)
      $('#bride_non_member_div').show()
      $('#bride_member_div').hide()

      $('#bride_first_name').val(currPerson.firstName)
      $('#bride_mid_name').val(currPerson.midName)
      $('#bride_last_name').val(currPerson.lastName)
    }
    $('#brideModal').modal('show')
  })

  $('#edit_groom').click(function() {
    currPerson.memberId = $('#groom-info').data('memberid')
    currPerson.personId = $('#groom-info').data('personid')
    currPerson.firstName = $('#groom_first_name_view').text()
    currPerson.midName = $('#groom_mid_name_view').text()
    currPerson.lastName = $('#groom_last_name_view').text()

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#groom_member').prop('checked', true)
      $('#groom_member_div').show()
      $('#groom_non_member_div').hide()
      $(groomSelect)[0].selectize.setValue(getValue(currPerson.memberId))
    } else {
      $('#groom_non_member').prop('checked', true)
      $('#groom_non_member_div').show()
      $('#groom_member_div').hide()

      $('#groom_first_name').val(currPerson.firstName)
      $('#groom_mid_name').val(currPerson.midName)
      $('#groom_last_name').val(currPerson.lastName)
    }
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
        }
        if (validateMidInitial($('#bride_mid_name').val()) === false) {
          isValid = false
          $('#bride_info_error').text("Bride's middle initial should only range from letters A-Z")
        }
        if ($('#bride_mid_name').val().length > 1) {
          isValid = false
          $('#bride_info_error').text("Bride's middle initial should only contain 1 letter")
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
      }
      if (validateMidInitial($('#groom_mid_name').val()) === false) {
        isValid = false
        $('#groom_info_error').text("Groom's middle initial should only range from letters A-Z")
      }
      if ($('#groom_mid_name').val().length > 1) {
        isValid = false
        $('#groom_info_error').text("Groom's middle initial should only contain 1 letter")
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

  $('#save_changes').click(function () {
    var isValid = true
    var hasDate = !validator.isEmpty($('#wedding_date').val())
    if (!hasDate) {
      isValid = false
      $('#wedding_date_error').text('Wedding date should not be empty!')
    } else {
      $('#wedding_date_error').text('')
    }
    if(isValid) {
      $('#confirmationModal').modal('toggle')
    }
  })

  $('#edit-prenup').click(function () {
    const newWeddingDate = new Date($('#wedding_date').val()).toISOString()
    const prenupId = $('#prenup-info').data('prenuprecord-id')
    $.ajax({
      type: 'PUT',
      url: '/update_prenup/date',
      data: {
        newWeddingDate: newWeddingDate,
        prenupId: prenupId
      },
      success: function (result) {
        if (result) {
          location.href = '/view_prenup/' + prenupId
        } else {
          console.log('update wedding date error')
        }
      }
    })
  })

  function submitBride() {
    const bridePerson = getDetails($('#bride_member'), null, $('#input_bride_member'), $('#bride_first_name'), $('#bride_mid_name'), $('#bride_last_name'))
    const oldBrideMemberId = currPerson.memberId
    const oldBridePersonId = currPerson.personId
    const inputBrideInfo = $('#input_bride_member').val().split(', ')
    const prenupRecordId = $('#prenup-info').data('prenuprecord-id')
    const coupleId = $('#prenup-info').data('couple-id')

    const data = {
      isOldMember: oldBrideMemberId !== null && oldBrideMemberId !== undefined && oldBrideMemberId !== '',
      person: bridePerson,
      recordId: prenupRecordId,
      coupleId: coupleId,
      oldPersonId: oldBridePersonId,
    }
    if (!data.person.isMember) {
      data.person.personId = inputBrideInfo[1]
    }
    data.person = JSON.stringify(data.person)

    $.ajax({
      type: 'PUT',
      url: '/update_prenup/bride',
      data: data,
      success: function (result) {
        if (result) {
          // update the frontend bride details
          const newBrideInfo = JSON.parse(data.person)
          console.log(newBrideInfo)
          if(newBrideInfo.isMember) {
            $('#bride-info').data('memberid', newBrideInfo.memberId)
            $('#bride-info').data('personid', newBrideInfo.personId)
            $('#bride-info').data('first', inputBrideInfo[2])
            $('#bride-info').data('middle', inputBrideInfo[3])
            $('#bride-info').data('last', inputBrideInfo[4])
            $('#bride_first_name_view').text(inputBrideInfo[2])
            $('#bride_mid_name_view').text(inputBrideInfo[3])
            $('#bride_last_name_view').text(inputBrideInfo[4])

            // clear modal fields and hide bride modal
            $('#bride_first_name').text('')
            $('#bride_mid_name').text('')
            $('#bride_last_name').text('')
            $('#brideModal').modal('hide')
          } else {
            $('#bride-info').data('memberid','')
            $('#bride-info').data('personid', result)
            $('#bride-info').data('first', newBrideInfo.firstName)
            $('#bride-info').data('middle', newBrideInfo.midName)
            $('#bride-info').data('last', newBrideInfo.lastName)
            $('#bride_first_name_view').text(newBrideInfo.firstName)
            $('#bride_mid_name_view').text(newBrideInfo.midName)
            $('#bride_last_name_view').text(newBrideInfo.lastName)

            // clear modal fields and hide bride modal
            $('#bride_first_name').text('')
            $('#bride_mid_name').text('')
            $('#bride_last_name').text('')
            $('#brideModal').modal('hide')
          }
          if (oldBrideMemberId) {
            selectizeEnable(getValue(oldBrideMemberId))
          }
        }
      }
    })
  }

  function submitGroom() {
    const groomPerson = getDetails($('#groom_member'), null, $('#input_groom_member'), $('#groom_first_name'), $('#groom_mid_name'), $('#groom_last_name'))
    const oldGroomMemberId = currPerson.memberId
    const oldGroomPersonId = currPerson.personId
    const inputGroomInfo = $('#input_groom_member').val().split(', ')
    const prenupRecordId = $('#prenup-info').data('prenuprecord-id')
    const coupleId = $('#prenup-info').data('couple-id')

    const data = {
      isOldMember: oldGroomMemberId !== null && oldGroomMemberId !== undefined && oldGroomMemberId !== '',
      person: groomPerson,
      recordId: prenupRecordId,
      coupleId: coupleId,
      oldPersonId: oldGroomPersonId
    }
    if (!data.person.isMember) {
      data.person.personId = inputGroomInfo[1]
    }
    data.person = JSON.stringify(data.person)

    $.ajax({
      type: 'PUT',
      url: '/update_prenup/groom',
      data: data,
      success: function (result) {
        if (result) {
          // update the frontend bride details
          const newGroomInfo = JSON.parse(data.person)
          console.log(newGroomInfo)
          if(newGroomInfo.isMember) {
            $('#groom-info').data('memberid', newGroomInfo.memberId)
            $('#groom-info').data('personid', newGroomInfo.personId)
            $('#groom-info').data('first', inputGroomInfo[2])
            $('#groom-info').data('middle', inputGroomInfo[3])
            $('#groom-info').data('last', inputGroomInfo[4])
            $('#groom_first_name_view').text(inputGroomInfo[2])
            $('#groom_mid_name_view').text(inputGroomInfo[3])
            $('#groom_last_name_view').text(inputGroomInfo[4])

            // clear modal fields and hide groom modal
            $('#groom_first_name').text('')
            $('#groom_mid_name').text('')
            $('#groom_last_name').text('')
            $('#groomModal').modal('hide')
          } else {
            $('#groom-info').data('memberid','')
            $('#groom-info').data('personid', result)
            $('#groom-info').data('first', newGroomInfo.firstName)
            $('#groom-info').data('middle', newGroomInfo.midName)
            $('#groom-info').data('last', newGroomInfo.lastName)
            $('#groom_first_name_view').text(newGroomInfo.firstName)
            $('#groom_mid_name_view').text(newGroomInfo.midName)
            $('#groom_last_name_view').text(newGroomInfo.lastName)

            // clear modal fields and hide bride modal
            $('#groom_first_name').text('')
            $('#groom_mid_name').text('')
            $('#groom_last_name').text('')
            $('#groomModal').modal('hide')
          }
          if (oldGroomMemberId) {
            selectizeEnable(getValue(oldGroomMemberId))
          }
        }
      }
    })
  }
})