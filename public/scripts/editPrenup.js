function display_div_bride (status) {
    
  if(status === "bride_non_member") {
    document.getElementById("bride_member_div").style.display = "none"
    document.getElementById("bride_member").checked = false
    document.getElementById("bride_member").removeAttribute("disabled")
    document.getElementById("bride_non_member").setAttribute("disabled", "disabled")
    $("#prenup-info").attr('data-checkbride-member', '0')
    console.log("data('data-checkbride-member', '0')")
  }
  else {
    document.getElementById("bride_non_member_div").style.display = "none"
    document.getElementById("bride_non_member").checked = false
    document.getElementById("bride_non_member").removeAttribute("disabled")
    document.getElementById("bride_member").setAttribute("disabled", "disabled")
    $('#prenup-info').attr('data-checkbride-member', '1')
    console.log("data('data-checkbride-member', '1')")
  }
  document.getElementById(status + "_div").style.display = "block"
}
function display_div_groom (status) {
  if(status === "groom_non_member") {
    document.getElementById("groom_member_div").style.display = "none"
    document.getElementById("groom_member").checked = false
    document.getElementById("groom_member").removeAttribute("disabled")
    document.getElementById("groom_non_member").setAttribute("disabled", "disabled")
    $('#prenup-info').attr('data-checkgroom-member', '0')
    console.log("data('data-checkgroom-member', '0')")
  }
  else {
    document.getElementById("groom_non_member_div").style.display = "none"
    document.getElementById("groom_non_member").checked = false
    document.getElementById("groom_non_member").removeAttribute("disabled")
    document.getElementById("groom_member").setAttribute("disabled", "disabled")
    $('#prenup-info').attr('data-checkgroom-member', '1')
    console.log("data('data-checkgroom-member', '1')")
  }
  document.getElementById(status + "_div").style.display = "block"
}

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

  function validateFields () {
    var isValid = true

    var brideNonMember = validator.isEmpty($('#bride_first_name').val()) || validator.isEmpty($('#bride_mid_name').val()) || validator.isEmpty($('#bride_last_name').val())
    var brideMember = $('#input_bride_member').val() === '' || $('#input_bride_member').val() === null

    var groomNonMember = validator.isEmpty($('#groom_first_name').val()) || validator.isEmpty($('#groom_mid_name').val()) || validator.isEmpty($('#groom_last_name').val())
    var groomMember = $('#input_groom_member').val() === '' || $('#input_groom_member').val() === null

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

    if((brideNonMember) && (brideMember)) {
      isValid = false
      $('#bride_info_error').text('Accomplish all fields')
      }

    if((groomNonMember) && (groomMember)) {
      isValid = false
      $('#groom_info_error').text('Accomplish all fields')
      } 

    if(validator.isEmpty($('#wedding_date').val())) {
      isValid = false
      $('#wedding_date_error').text('Select a date')
      } else {
      $('#wedding_date_error').text('')
    }

    if ($('#prenup-info').attr('data-currentdate') > $('#wedding_date').val()) {
      isValid = false
      $('#wedding_date_error').text('Wedding date should not be earlier than current date')
    } else {
      $('#wedding_date_error').text('')
    }
    return isValid
  }

  $('#edit-prenup').click(function () {
    console.log('edit prenup submit button')
    if (validateFields()) {
      let data = {
        coupleId: $('#prenup-info').attr('data-couple-id'),
        prenupId:$('#prenup-info').attr('data-prenuprecord-id'),
        weddingDate: $('#wedding_date').val(),
        // old data groom
        oldgroomMemberId: $('#oldgroom-info').attr('data-oldgroom-memberid'),
        oldgroomPersonId: $('#oldgroom-info').attr('data-oldgroom-personid'),
        oldgroomFirst: $('#oldgroom-info').attr('data-oldgroom-first'),
        oldgroomMiddle: $('#oldgroom-info').attr('data-oldgroom-middle'),
        oldgroomLast: $('#oldgroom-info').attr('data-oldgroom-last'),
    
        // old data bride
        oldbrideMemberId: $('#oldbride-info').attr('data-oldbride-memberid'),
        oldbridePersonId: $('#oldbride-info').attr('data-oldbride-personid'),
        oldbrideFirst: $('#oldbride-info').attr('data-oldbride-first'),
        oldbrideMiddle: $('#oldbride-info').attr('data-oldbride-middle'),
        oldbrideLast: $('#oldbride-info').attr('data-oldbride-last')
      }
    
      const bridecheck_member = $('#prenup-info').attr('data-checkbride-member')
      const groomcheck_member = $('#prenup-info').attr('data-checkgroom-member')
      let url_route = ''
      // INDICES
      const MEMBER_ID = 0
      const PERSON_ID = 1
      const FIRST = 2
      const MIDDLE = 3
      const LAST = 4
      // if both members
      if (parseInt(groomcheck_member) == 1 && parseInt(bridecheck_member) == 1) {
        url_route = '/postUpdatePrenupMember'

        const bride = $('#input_bride_member').val()
        const groom = $('#input_groom_member').val()
        const brideInfo = bride.split(', ')
        const groomInfo = groom.split(', ')
    
        data.newgroomMemberId = groomInfo[MEMBER_ID]
        data.newgroomPersonId = groomInfo[PERSON_ID]
        data.newgroomFirst = groomInfo[FIRST]
        data.newgroomMiddle = groomInfo[MIDDLE]
        data.newgroomLast = groomInfo[LAST]
        
        data.newbrideMemberId = brideInfo[MEMBER_ID]
        data.newbridePersonId = brideInfo[PERSON_ID]
        data.newbrideFirst = brideInfo[FIRST]
        data.newbrideMiddle = brideInfo[MIDDLE]
        data.newbrideLast = brideInfo[LAST]
        
      } else if (parseInt(groomcheck_member) == 0 && parseInt(bridecheck_member) == 1) {
        // if bride is member and groom non-member
        url_route = '/postUpdatePrenupBrideMember'
        // get nonmember groom's info
        data.newgroomFirst = $('#groom_first_name').val()
        data.newgroomMiddle = $('#groom_mid_name').val()
        data.newgroomLast = $('#groom_last_name').val()
    
      } else if (parseInt(groomcheck_member) == 1 && parseInt(bridecheck_member) == 0) {
        // if groom member and bride nonmmember
        url_route = '/postUpdatePrenupGroomMember'
        // get nonmember bride's info
        data.newbrideFirst = $('#bride_first_name').val()
        data.newbrideMiddle = $('#bride_mid_name').val()
        data.newbrideLast = $('#bride_last_name').val()

      } else if (parseInt(groomcheck_member) == 0 && parseInt(bridecheck_member) == 0) {
        // if both groom and bride are nonmembers
        url_route = '/postUpdatePrenupNonMember'
        // get nonmember bride's info
        data.newbrideFirst = $('#bride_first_name').val()
        data.newbrideMiddle = $('#bride_mid_name').val()
        data.newbrideLast = $('#bride_last_name').val()
        // get nonmember groom's info
        data.newgroomFirst = $('#groom_first_name').val()
        data.newgroomMiddle = $('#groom_mid_name').val()
        data.newgroomLast = $('#groom_last_name').val()
      }
        
      console.log("DATA:\n")
      console.log('data.oldbridePerson' + data.oldbridePersonId)
      console.log('data.oldbrideMember' + data.oldbrideMemberId)
      console.log('data.oldbrideFirst)' + data.oldbrideFirst)
      console.log('data.oldbrideMiddle' + data.oldbrideMiddle)
      console.log('data.oldbrideLast)' + data.oldbrideLast)

      console.log('data.oldgroomPerson' + data.oldgroomPersonId)
      console.log('data.oldgroomMember' + data.oldgroomMemberId)
      console.log('data.oldgroomFirst)' + data.oldgroomFirst)
      console.log('data.oldgroomMiddle' + data.oldgroomMiddle)
      console.log('data.oldgroomLast)' + data.oldgroomLast)

      console.log('data.newbridePerson' + data.newbridePersonId)
      console.log('data.newbrideMember' + data.newbrideMemberId)
      console.log('data.newbrideFirst)' + data.newbrideFirst)
      console.log('data.newbrideMiddle' + data.newbrideMiddle)
      console.log('data.newbrideLast)' + data.newbrideLast)

      console.log('data.newgroomPerson' + data.newgroomPersonId)
      console.log('data.newgroomMember' + data.newgroomMemberId)
      console.log('data.newgroomFirst)' + data.newgroomFirst)
      console.log('data.newgroomMiddle' + data.newgroomMiddle)
      console.log('data.newgroomLast)' + data.newgroomLast)

      console.log('data.weddingDate' + data.weddingDate)
      console.log('data.prenupId' + data.prenupId)
      console.log('data.coupleId' + data.coupleId)

      console.log("url_route = " + url_route)
      $.ajax({
        type: "POST",
        data: data,
        url: url_route,
        success: function (result) {
            if (result === true) {
              //location.href('/member/' + data.member_id)
              window.location = '/view_prenup/' + data.prenupId
            }
            else alert("Changes not saved")
        }
      })
    } else {
        console.log('validateFields error')
    }
  })
  function clearTextFields () {
    if ($('#oldbride-info').attr('data-oldbride-memberid') !== '' || 
       $('#oldbride-info').attr('data-oldbride-memberid') !== '') {
      $('#bride_first_name').val('')
      $('#bride_mid_name').val('')
      $('#bride_last_name').val('')
      console.log('bride text fields cleared')
    } else {
      console.log('bride text fields not cleared')
    }
  
    if ($('#oldgroom-info').attr('data-oldgroom-memberid') !== '' ||
        $('#oldgroom-info').attr('data-oldgroom-memberid') !== '') {
      $('#groom_first_name').val('')
      $('#groom_mid_name').val('')
      $('#groom_last_name').val('')
      console.log('groom text fields cleared')
    } else {
      console.log('groom text fields not cleared')
    }
  }
  clearTextFields()
})