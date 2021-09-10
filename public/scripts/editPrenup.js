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
        }
        if (validateMidInitial($('#bride_mid_name').val()) === false) {
          isValid = false
          $('#bride_info_error').text("Bride's middle initial should only range from letters A-Z")
        }
        if ($('#groom_mid_name').val().length > 1) {
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

  $('#edit-prenup').click(function() {
    alert('Submit')
  })


  function submitBride() {
    const bridePerson = getDetails($('#bride_member'), null, $('#input_bride_member'), $('#bride_first_name'), $('#bride_mid_name'), $('#bride_last_name'))
    const oldBrideMemberId = $('#oldbride-info').data('oldbride-memberid')
    const oldBridePersonId = $('#oldbride-info').data('oldbride-personid')
    const inputBrideInfo = $('#input_bride_member').val().split(', ')
    const prenupRecordId = $('#prenup-info').data('prenuprecord-id')
    const coupleId = $('#prenup-info').data('couple-id')

    const data = {
      isOldMember: oldBrideMemberId !== null && oldBrideMemberId !== undefined && oldBrideMemberId !== '',
      person: bridePerson,
      recordId: prenupRecordId,
      coupleId: coupleId,
      oldPersonId: oldBridePersonId
    }
    data.person.personId = oldBridePersonId
    data.person = JSON.stringify(data.person)
    console.log(data)
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
            $('#oldbride-info').data('oldbride-memberid', newBrideInfo.memberId)
            $('#oldbride-info').data('oldbride-personid', inputBrideInfo[1])
            $('#oldbride-info').data('oldbride-first', inputBrideInfo[2])
            $('#oldbride-info').data('oldbride-middle', inputBrideInfo[3])
            $('#oldbride-info').data('oldbride-last', inputBrideInfo[4])
            $('#bride_first_name_view').text(inputBrideInfo[2])
            $('#bride_mid_name_view').text(inputBrideInfo[3])
            $('#bride_last_name_view').text(inputBrideInfo[4])
          } else {
            $('#oldbride-info').data('oldbride-memberid','')
            $('#oldbride-info').data('oldbride-personid', newBrideInfo.personId)
            $('#oldbride-info').data('oldbride-first', newBrideInfo.firstName)
            $('#oldbride-info').data('oldbride-middle', newBrideInfo.midName)
            $('#oldbride-info').data('oldbride-last', newBrideInfo.lastName)
          }
        }
      }
    })
  }

  function submitGroom() {
    alert('submit groom function')
  }
})