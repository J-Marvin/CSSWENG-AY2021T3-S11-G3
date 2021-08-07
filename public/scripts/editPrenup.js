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

  function validateFields () {
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

    if(validator.isEmpty($('#wedding_date').val())) {
    isValid = false
    $('#wedding_date_error').text('Select a date')
    } else {
    $('#wedding_date_error').text('')
    }
  }

  $('#edit-prenup').click(function () {
    console.log('edit prenup submit button')
    if (validateFields()) {
      let data = {
        coupleId: $('#prenup-info').attr('data-couple-id'),
        prenupId:$('#prenup-info').attr('data-prenuprecord-id'),
        wedding_date: $('#wedding_date').val(),
        // old data groom
        oldgroomMemberId: $('#oldgroom-info').attr('oldgroom-memberid'),
        oldgroomPersonId: $('#oldgroom-info').attr('oldgroom-personid'),
        oldgroomFirst: $('#oldgroom-info').attr('oldgroom-first'),
        oldgroomMiddle: $('#oldgroom-info').attr('oldgroom-middle'),
        oldgroomLast: $('#oldgroom-info').attr('oldgroom-last'),
    
        // old data bride
        oldbrideMemberId: $('#oldbride-info').attr('oldbride-memberid'),
        oldbridePersonId: $('#oldbride-info').attr('oldbride-personid'),
        oldbrideFirst: $('#oldbride-info').attr('oldbride-first'),
        oldbrideMiddle: $('#oldbride-info').attr('oldbride-middle'),
        oldbrideLast: $('#oldbride-info').attr('oldbride-last')
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
      }
        
      console.log("data")
      console.log(url_route)
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
})