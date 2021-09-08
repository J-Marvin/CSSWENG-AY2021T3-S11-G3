$(document).ready(function() {
  const selectMale = $('#input_male_member').selectize()
  const selectGroom = $('#input_groom_member').selectize()
  const selectFemale = $('#input_female_member').selectize()
  const selectBride = $('#input_bride_member').selectize()
  var GMotherWitnessCtr = 0
  var GFatherWitnessCtr = 0
  var addedWitness = false
  var modalType = null
  var isFemale = false
  var didUpdate = false
  var currPerson = {}

  initSelectize()
  initSelectizeOptions()
  $('select').change(hideChoices)

  function getValue(id) {
    return $('.option[data-value^="' + id + '"]').data('value')
  }

  function hideChoices() {
    var previous = $(this).data('previous')
    var currOption = $(this).val()
    //alert(previous + ' ' + currOption)
    selectizeDisable(currOption)
    $(this).data('previous', currOption)

    // if there was a previously selected choice, free up from other input fields
    if (previous !== null || previous !== undefined) {
      selectizeEnable(previous)
    }
  }

  function initSelectize() {
    $(selectMale)[0].selectize.refreshOptions()
    $(selectGroom)[0].selectize.refreshOptions()
    $(selectFemale)[0].selectize.refreshOptions()
    $(selectBride)[0].selectize.refreshOptions()
    $('.selectize-dropdown').hide();
    $('.selectize-input').removeClass('focus input-active dropdown-active');
    $('div.selectize-input > input').blur();
  }

  function initSelectizeOptions() {
    // get bride
    selectizeDisable(getValue($('#bride_info').data('member')))
    // get groom
    selectizeDisable(getValue($('#bride_info').data('member')))
    // get bride mother
    selectizeDisable(getValue($('#bride_info').data('member')))
    // get bride father
    selectizeDisable(getValue($('#bride_info').data('member')))
    // get groom mother
    selectizeDisable(getValue($('#bride_info').data('member')))
    // get groom father
    selectizeDisable(getValue($('#bride_info').data('member')))
    // get witnesses

    $('.witness').each(function () {
      selectizeDisable(getValue($(this).data('member')))
    })
  }

  function selectizeEnable(data) {
    $('#input_male_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_groom_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_female_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_bride_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
  }

  function selectizeDisable(data) {
    $('#input_male_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_groom_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_female_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_bride_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
  }

  $('#bride_non_member').click(function(){
    $('#bride_non_member_div').show()
    $('#bride_member_div').hide()
  })

  $('#bride_member').click(function () {
    $('#bride_non_member_div').hide()
    $('#bride_member_div').show()
  })

  $('#groom_non_member').click(function () {
    $('#groom_non_member_div').show()
    $('#groom_member_div').hide()
  })

  $('#groom_member').click(function () {
    $('#groom_non_member_div').hide()
    $('#groom_member_div').show()
  })

  $('#female_non_member').click(function () {
    $('#female_non_member_div').show()
    $('#female_member_div').hide()
  })

  $('#female_member').click(function () {
    $('#female_non_member_div').hide()
    $('#female_member_div').show()
  })

  $('#female_none').click(function () {
    $('#female_non_member_div').hide()
    $('#female_member_div').hide()
  })

  $('#male_non_member').click(function () {
    $('#male_non_member_div').show()
    $('#male_member_div').hide()
  })

  $('#male_member').click(function () {
    $('#male_non_member_div').hide()
    $('#male_member_div').show()
  })

  $('#male_none').click(function () {
    $('#male_non_member_div').hide()
    $('#male_member_div').hide()
  })

  $('#edit-wedding-registry').click(function (){
    $('#edit-wedding-registry').prop('disabled', true)
    if(validateFields()) {
      $('#edit-wedding-registry').prop('disabled', false)
    } else {
      $('#edit-wedding-registry').prop('disabled', false)
    }
  })

  // On Save Edit Bride
  $('#save_bride_btn').click(function() {
    $('#save_bride_btn').prop('disabled', true)
    if (validateBride()) {
      let brideId = currPerson.memberId
      let bridePersonId = currPerson.personId
      let info = $('#input_bride_member').val().split(', ')

      const data = {
        isOldMember: brideId !== null && brideId !== undefined && brideId !== '',
        person: getDetails($('#bride_member'), null, $('#input_bride_member'), $('#bride_first_name'), $('#bride_mid_name'), $('#bride_last_name')),
        recordId: $('#wedding_info').data('wedding-id'),
        coupleId: $('#wedding_info').data('couple-id'),
        oldMemberId: brideId,
        oldPersonId: bridePersonId,
        isBride: true
      }

      data.person.personId = info[1]
      console.log(data.person)
      data.person = JSON.stringify(data.person)

      $.ajax({
        type: 'PUT',
        url: '/update_wedding/couple',
        data: data,
        success: function (result) {
          console.log(result)
          if (result) {
            const personInfo = JSON.parse(data.person)
            console.log(personInfo)
            if (personInfo.isMember) {
              $('#bride_info').data('member', personInfo.memberId)
              $('#bride_info').data('person', info[1])
              $('#bride_first_name_view').html(info[2])
              $('#bride_mid_name_view').html(info[3])
              $('#bride_last_name_view').html(info[4])
              $('#save_bride_btn').prop('disabled', false)
            } else {
              $('#bride_info').removeData('member')
              $('#bride_info').data('person', result)
              $('#bride_first_name_view').html(personInfo.firstName)
              $('#bride_mid_name_view').html(personInfo.midName)
              $('#bride_last_name_view').html(personInfo.lastName)
              $('#save_bride_btn').prop('disabled', false)
            }
            $('#brideModal').modal('hide')
          } else {
            $('#create_error').text('Error Editing Bride')
            $('#save_bride_btn').prop('disabled', false)
          }
        }
      })
    } else {
      
      $('#save_bride_btn').prop('disabled', false)
    }
  })

  // On Save Groom Click
  $('#save_groom_btn').click(function() {
    $('#save_groom_btn').prop('disabled', true)
    if (validateGroom()) {
      let groomId = currPerson.memberId
      let groomPersonId = currPerson.personId
      let info = $('#input_groom_member').val().split(', ')

      const data = {
        isOldMember: groomId !== null && groomId !== undefined && groomId !== '',
        person: getDetails($('#groom_member'), null, $('#input_groom_member'), $('#groom_first_name'), $('#groom_mid_name'), $('#groom_last_name')),
        recordId: $('#wedding_info').data('wedding-id'),
        coupleId: $('#wedding_info').data('couple-id'),
        oldMemberId: groomId,
        oldPersonId: groomPersonId,
        isBride: false
      }

      data.person.personId = info[1]
      console.log(data.person)
      data.person = JSON.stringify(data.person)

      $.ajax({
        type: 'PUT',
        url: '/update_wedding/couple',
        data: data,
        success: function (result) {
          console.log(result)
          if (result) {
            const personInfo = JSON.parse(data.person)
            console.log(personInfo)
            if (personInfo.isMember) {
              $('#groom_info').data('member', personInfo.memberId)
              $('#groom_info').data('person', info[1])
              $('#groom_first_name_view').html(info[2])
              $('#groom_mid_name_view').html(info[3])
              $('#groom_last_name_view').html(info[4])
              $('#save_groom_btn').prop('disabled', false)
            } else {
              $('#groom_info').removeData('member')
              $('#groom_info').data('person', result)
              $('#groom_first_name_view').html(personInfo.firstName)
              $('#groom_mid_name_view').html(personInfo.midName)
              $('#groom_last_name_view').html(personInfo.lastName)
              $('#save_groom_btn').prop('disabled', false)
            }
            $('#groomModal').modal('hide')
          } else {
            $('#create_error').text('Error Editing Bride')
            $('#save_groom_btn').prop('disabled', false)
          }
        }
      })
    } else {

      $('#save_groom_btn').prop('disabled', false)
    }
  })

  // On Edit Bride Click
  $('#edit_bride').click(function () {
    modalType = 'editBride'
    currPerson.firstName = $('#bride_first_name_view').text()
    currPerson.midName = $('#bride_mid_name_view').text()
    currPerson.lastName = $('#bride_last_name_view').text()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#bride_info').data('member')
    currPerson.personId = $('#bride_info').data('person')
    currPerson.canBeNone = false
    isFemale = true

    console.log(currPerson)

    initBrideModal()
  })

  // On Edit Bride Mother Click
  $('#edit_bride_mother').click(function () {
    modalType = 'editBrideMother'
    currPerson.firstName = $('#bride_mother_first_name_view').text()
    currPerson.midName = $('#bride_mother_mid_name_view').text()
    currPerson.lastName = $('#bride_mother_last_name_view').text()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#bride_mother_info').data('member')
    currPerson.personId = $('#bride_mother_info').data('person')
    currPerson.canBeNone = true
    isFemale = true

    console.log(currPerson)

    initFemaleModal('Edit Bride Mother')
  })

  // On Edit Bride Father Click
  $('#edit_bride_father').click(function () {
    modalType = 'editBrideFather'
    currPerson.firstName = $('#bride_father_first_name_view').text()
    currPerson.midName = $('#bride_father_mid_name_view').text()
    currPerson.lastName = $('#bride_father_last_name_view').text()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#bride_father_info').data('member')
    currPerson.personId = $('#bride_father_info').data('person')
    currPerson.canBeNone = true
    isFemale = false

    console.log(currPerson)

    initMaleModal('Edit Bride Father')
  })

  // On Edit Groom Click
  $('#edit_groom').click(function() {
    modalType = 'editGroom'
    currPerson.firstName = $('#groom_first_name_view').text()
    currPerson.midName = $('#groom_mid_name_view').text()
    currPerson.lastName = $('#groom_last_name_view').text()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#groom_info').data('member')
    currPerson.personId = $('#groom_info').data('person')
    currPerson.canBeNone = false
    isFemale = false

    initGroomModal()
  })

    // On Edit Groom Mother Click
  $('#edit_groom_mother').click(function () {
    modalType = 'editGroomMother'
    currPerson.firstName = $('#groom_mother_first_name_view').text()
    currPerson.midName = $('#groom_mother_mid_name_view').text()
    currPerson.lastName = $('#groom_mother_last_name_view').text()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#groom_mother_info').data('member')
    currPerson.personId = $('#groom_mother_info').data('person')
    currPerson.canBeNone = true
    isFemale = true

    console.log(currPerson)

    initFemaleModal('Edit Groom Mother')
  })

  // On Edit Groom Father Click
  $('#edit_groom_father').click(function () {
    modalType = 'editGroomFather'
    currPerson.firstName = $('#groom_father_first_name_view').text()
    currPerson.midName = $('#groom_father_mid_name_view').text()
    currPerson.lastName = $('#groom_father_last_name_view').text()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#groom_father_info').data('member')
    currPerson.personId = $('#groom_father_info').data('person')
    currPerson.canBeNone = true
    isFemale = false

    console.log(currPerson)

    initMaleModal('Edit Groom Father')
  })

  function initFemaleModal(title) {
    $('#female_modal_title').html(title)
    if (currPerson.canBeNone) {
      $('#female_none_div').show()
    } else {
      $('#female_none_div').hide()
    }

    if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
      $('#female_member').prop('checked', true)
      $('female_member_div').show()
      $('#female_non_member_div').hide()
      console.log(currPerson.memberId)
      const id = currPerson.memberId
      const value = $('.option[data-value^="' + id + '"]').data('value')
      console.log(value)
      selectFemale[0].selectize.setValue(value)
    } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined){
      $('#female_non_member').prop('checked', true)
      $('female_non_member_div').show()
      $('#female_member_div').hide()
      $('female_first_name').val(currPerson.firstName)
      $('female_mid_name').val(currPerson.midname)
      $('female_last_name').val(currPerson.lastname)
    } else {
      $('#female_member_div').hide()
      $('#female_non_member_div').hide()
    }
    
    $('#femaleModal').modal('show')
  }

  function initBrideModal() {
    if (currPerson.canBeNone) {
      $('#bride_none_div').show()
    } else {
      $('#bride_none_div').hide()
    }

    if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
      $('#bride_member').prop('checked', true)
      $('#bride_member_div').show()
      $('#bride_non_member_div').hide()
      console.log(currPerson.memberId)
      const id = currPerson.memberId
      const value = $('.option[data-value^="' + id + '"]').data('value')
      console.log(value)
      selectBride[0].selectize.setValue(value)
      selectizeDisable(value)
    } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined) {
      $('#bride_non_member').prop('checked', true)
      $('#bride_non_member_div').show()
      $('#bride_member_div').hide()
      $('#bride_first_name').val(currPerson.firstName)
      $('#bride_mid_name').val(currPerson.midname)
      $('#bride_last_name').val(currPerson.lastname)
    } else {
      $('#bride_member_div').hide()
      $('#bride_non_member_div').hide()
    }

    $('#brideModal').modal('show')
  }

  function initGroomModal() {
    if (currPerson.canBeNone) {
      $('#groom_none_div').show()
    } else {
      $('#groom_none_div').hide()
    }

    if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
      $('#groom_member').prop('checked', true)
      $('#groom_member_div').show()
      $('#groom_non_member_div').hide()
      console.log(currPerson.memberId)
      const id = currPerson.memberId
      const value = $('.option[data-value^="' + id + '"]').data('value')
      console.log(value)
      selectGroom[0].selectize.setValue(value)
    } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined) {
      $('#groom_non_member').prop('checked', true)
      $('#groom_non_member_div').show()
      $('#groom_member_div').hide()
      $('#groom_first_name').val(currPerson.firstName)
      $('#groom_mid_name').val(currPerson.midname)
      $('#groom_last_name').val(currPerson.lastname)
    } else {
      $('#groom_member_div').hide()
      $('#groom_non_member_div').hide()
    }

    $('#groomModal').modal('show')
  }

  function initMaleModal(title) {
    $('#male_modal_title').html(title)
    if (currPerson.canBeNone) {
      $('#male_none_div').show()
    } else {
      $('#male_none_div').hide()
    }

    if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
      $('#male_member').prop('checked', true)
      $('#male_member_div').show()
      $('#male_non_member_div').hide()
      console.log(currPerson.memberId)
      const id = currPerson.memberId
      const value = $('.option[data-value^="' + id + '"]').data('value')
      console.log(value)
      selectMale[0].selectize.setValue(value)
    } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined) {
      $('#male_non_member').prop('checked', true)
      $('#male_non_member_div').show()
      $('#male_member_div').hide()
      $('#male_first_name').val(currPerson.firstName)
      $('#male_mid_name').val(currPerson.midname)
      $('#male_last_name').val(currPerson.lastname)
    } else {
      $('#male_member_div').hide()
      $('#male_non_member_div').hide()
    }

    $('#maleModal').modal('show')
  }

  function validateGroom() {
    var isValid = true
    var errorField = $('#groom_modal_info_error')
    $(errorField).text('')

    var isMember = $('#groom_member').is(':checked')
    var isValidMemberField = !($('#input_groom_member').val() === '0' || $('#input_groom_member').val() === '')
    var anyEmpty = $('#groom_first_name').val() === '' || $('#groom_mid_name').val() === '' || $('#groom_last_name').val() === ''
    var isValidMidName = $('#groom_mid_name').val().length === 1

    // Check if valid member
    if (isMember && !isValidMemberField) {
      console.log("EHERE")
      isValid = false
      $(errorField).text('Please select groom')
    } else if (!isMember) {
      if (anyEmpty) {
        isValid = false
        $(errorField).text('Please provide groom name')
      } else if (!isValidMidName) {
        isValid = false
        $(errorField).text("Bride's middle initial should only range from letters A-Z")
      }
    }

    if (isValid) {
      $(errorField).text('')
    }
    return isValid
  }

  function validateBride() {
    var isValid = true
    var errorField = $('#bride_modal_info_error')
    $(errorField).text('')

    var isMember = $('#bride_member').is(':checked')
    var isValidMemberField = !($('#input_bride_member').val() === '0' || $('#input_bride_member').val() === '')
    var anyEmpty = $('#bride_first_name').val() === '' || $('#bride_mid_name').val() === '' || $('#bride_last_name').val() === ''
    var isValidMidName = $('#bride_mid_name').val().length === 1

    // Check if valid member
    if (isMember && !isValidMemberField) {
      console.log("EHERE")
      isValid = false
      $(errorField).text('Please select bride')
    } else if (!isMember) {
      if (anyEmpty) {
        isValid = false
        $(errorField).text('Please provide bride name')
      } else if (!isValidMidName) {
        isValid = false
        $(errorField).text("Bride's middle initial should only range from letters A-Z")
      }
    }

    if (isValid) {
      $(errorField).text('')
    }
    return isValid
  }

  function validateMale() {

  }

  function validateFemale() {

  }

  

  // SPLIT
  function validateFields() {
    var groomNonMember = $('#groom_non_member').is(':checked')
    var groomFieldMember = $('#input_groom_member').val() === '0' || $('#input_groom_member').val() === ''
    var groomFieldNonMember = $('#groom_first_name').val() === '' || $('#groom_mid_name').val() === '' || $('#groom_last_name').val() === ''
    var groomMiddleLen = $('#groom_mid_name').val().length === 1

    var brideMotherNonMember = $('#bride_mother_non_member').is(':checked')
    var brideMotherNone = $('#bride_mother_none').is(':checked')
    var brideMotherFieldMember = $('#input_bride_mother_member').val() === '0' || $('#input_bride_mother_member').val() === ''
    var brideMotherFieldNonMember = $('#bride_mother_first_name').val() === '' || $('#bride_mother_mid_name').val() === '' || $('#bride_mother_last_name').val() === ''
    var brideMotherMiddleLen = $('#bride_mother_mid_name').val().length === 1

    var brideFatherNonMember = $('#bride_father_non_member').is(':checked')
    var brideFatherNone = $('#bride_father_none').is(':checked')
    var brideFatherFieldMember = $('#input_bride_father_member').val() === '0' || $('#input_bride_father_member').val() === ''
    var brideFatherFieldNonMember = $('#bride_father_first_name').val() === '' || $('#bride_father_mid_name').val() === '' || $('#bride_father_last_name').val() === ''
    var brideFatherMiddleLen = $('#bride_father_mid_name').val().length === 1

    var groomMotherNonMember = $('#groom_mother_non_member').is(':checked')
    var groomMotherNone = $('#groom_mother_none').is(':checked')
    var groomMotherFieldMember = $('#input_groom_mother_member').val() === '0' || $('#input_groom_mother_member').val() === ''
    var groomMotherFieldNonMember = $('#groom_mother_first_name').val() === '' || $('#groom_mother_mid_name').val() === '' || $('#groom_mother_last_name').val() === ''
    var groomMotherMiddleLen = $('#groom_mother_mid_name').val().length === 1

    var groomFatherNonMember = $('#groom_father_non_member').is(':checked')
    var groomFatherNone = $('#groom_father_none').is(':checked')
    var groomFatherFieldMember = $('#input_groom_father_member').val() === '0' || $('#input_groom_father_member').val() === ''
    var groomFatherFieldNonMember = $('#groom_father_first_name').val() === '' || $('#groom_father_mid_name').val() === '' || $('#groom_father_last_name').val() === ''
    var groomFatherMiddleLen = $('#groom_father_mid_name').val().length === 1

    var location = $('#location').val() === ''
    var contract = $('#contract').val() === ''
    var officiant = $('#officiant').val() === ''
    var solemnizer = $('#solemnizer').val() === ''

    var dateField = $('#current_date').val() === ''


    if ((groomNonMember && groomFieldNonMember) || (!groomNonMember && groomFieldMember)) {
      isValid = false
      $('#groom_info_error').text('Please provide groom name')
    } else {
      $('#groom_info_error').text('')
    }
    // check middle initial length
    if (!groomFieldNonMember && !groomMiddleLen) {
      isValid = false
      $('#groom_middle_len_error').text("Groom's middle initial should only contain 1 letter")
    } else {
      $('#groom_middle_len_error').text('')
    }

    // check the used middle initial
    if (groomFieldNonMember === false && validateMidInitial($('#groom_mid_name').val()) === false) {
      isValid = false
      $('#groom_middle_error').text("Groom's middle initial should only range from letters A-Z")
    } else {
      $('#groom_middle_error').text('')
    }
    if(!brideMotherNone && brideMotherFieldMember && brideMotherFieldNonMember) {
      isValid = false
      $('#bride_mother_info_error').text('Please provide name')
    } else {
      $('#bride_mother_info_error').text('')
    }

    if ((!brideMotherNone && brideMotherNonMember && brideMotherFieldNonMember) || (!brideMotherNone && !brideMotherNonMember && brideMotherFieldMember)) {
      isValid = false
      $('#bride_mother_info_error').text('Please provide name')
    } else {
      $('#bride_mother_info_error').text('')
    }
    // check middle initial length
    if (!brideMotherFieldNonMember && !brideMotherMiddleLen) {
      isValid = false
      $('#bride_mother_middle_len_error').text("The middle initial of the bride's mother should only contain 1 letter")
    } else {
      $('#bride_mother_middle_len_error').text('')
    }

    // check the used middle initial
    if (brideMotherFieldNonMember === false && validateMidInitial($('#bride_mother_mid_name').val()) === false) {
      isValid = false
      $('#bride_mother_middle_error').text("The middle initial of the bride's mother should only range from letters A-Z")
    } else {
      $('#bride_mother_middle_error').text('')
    }
    
    // GROOM'S MOTHER
    if(!groomMotherNone && groomMotherFieldMember && groomMotherFieldNonMember) {
      isValid = false
      $('#groom_mother_info_error').text('Please provide name')
    } else {
      $('#groom_mother_info_error').text('')
    }

    if ((!groomMotherNone && groomMotherNonMember && groomMotherFieldNonMember) || (!groomMotherNone && !groomMotherNonMember && groomMotherFieldMember)) {
      isValid = false
      $('#groom_mother_info_error').text('Please provide name')
    } else {
      $('#groom_mother_info_error').text('')
    }
    // check middle initial length
    if (!groomMotherFieldNonMember && !groomMotherMiddleLen) {
      isValid = false
      $('#groom_mother_middle_len_error').text("The middle initial of the groom's mother should only contain 1 letter")
    } else {
      $('#groom_mother_middle_len_error').text('')
    }
    // check the used middle initial
    if (groomMotherFieldNonMember === false && validateMidInitial($('#groom_mother_mid_name').val()) === false) {
      isValid = false
      $('#groom_mother_middle_error').text("The middle initial of the groom's mother should only range from letters A-Z")
    } else {
      $('#groom_mother_middle_error').text('')
    }
    
    // BRIDE'S FATHER
    if(!brideFatherNone && brideFatherFieldMember && brideFatherFieldNonMember) {
      isValid = false
      $('#bride_father_info_error').text('Please provide name')
    } else {
      $('#bride_father_info_error').text('')
    }

    if((!brideFatherNone && brideFatherNonMember && brideFatherFieldNonMember) || (!brideFatherNone && !brideFatherNonMember && brideFatherFieldMember)) {
      isValid = false
      $('#bride_father_info_error').text('Please provide name')
    } else {
      $('#bride_father_info_error').text('')
    }
    // check middle initial length
    if (!brideFatherFieldNonMember && !brideFatherMiddleLen) {
      isValid = false
      $('#bride_father_middle_len_error').text("The middle initial of the bride's father should only contain 1 letter")
    } else {
      $('#bride_father_middle_len_error').text('')
    }

    // check the used middle initial
    if (brideFatherFieldNonMember === false && validateMidInitial($('#bride_father_mid_name').val()) === false) {
      isValid = false
      $('#bride_father_middle_error').text("The middle initial of the bride's father should only range from letters A-Z")
    } else {
      $('#bride_father_middle_error').text('')
    }
    
    if(!groomFatherNone && groomFatherFieldMember && groomFatherFieldNonMember) {
      isValid = false
      $('#groom_father_info_error').text('Please provide name')
    } else {
      $('#groom_father_info_error').text('')
    }

    if ((!groomFatherNone && groomFatherNonMember && groomFatherFieldNonMember) || (!groomFatherNone && !groomFatherNonMember && groomFatherFieldMember)) {
      isValid = false
      $('#groom_father_info_error').text('Please provide name')
    } else {
      $('#groom_father_info_error').text('')
    }
    // check middle initial length
    if (!groomFatherFieldNonMember && !groomFatherMiddleLen) {
      isValid = false
      $('#groom_father_middle_len_error').text("The middle initial of the groom's father should only contain 1 letter")
    } else {
      $('#groom_father_middle_len_error').text('')
    }

    // check the used middle initial
    if (groomFatherFieldNonMember === false && validateMidInitial($('#groom_father_mid_name').val()) === false) {
      isValid = false
      $('#groom_father_middle_error').text("The middle initial of the groom's father should only range from letters A-Z")
    } else {
      $('#groom_father_middle_error').text('')
    }
    
    if (location) {
      isValid = false
      $('#location_error').text('Please accomplish')
    } else {
      $('#location_error').text('')
    }

    if(contract) {
      isValid = false
      $('#contract_info_error').text('Please accomplish')
    } else {
      $('#contract_info_error').text('')
    }

    if (officiant) {
      isValid = false
      $('#officiant_info_error').text('Please accomplish')
    } else {
      $('#officiant_info_error').text('')
    }

    if (solemnizer) {
      isValid = false
      $('#solemnizer_info_error').text('Please accomplish')
    } else {
      $('#solemnizer_info_error').text('')
    }

    if (GMotherWitnessCtr === 0 && GFatherWitnessCtr === 0) {
      isValid = false
      $('#witness_gmother_info_error').text('There must be at least one godmother or godfather')
      $('#witness_gfather_info_error').text('There must be at least one godmother or godfather')
    } else {
      $('#witness_gmother_info_error').text('')
      $('#witness_gfather_info_error').text('')
    }

    if(dateField) {
      isValid = false
      $('#current_date_error').text('Please accomplish')
    } else {
      $('#current_date_error').text('')
    }
  
    return isValid
  }

  $('#male_non_member').change(function() {
    $('#male_member_div').hide()
    $('#male_non_member_div').show()
    selectizeEnable($('#male_member').val())
    $(selectGodFather)[0].selectize.setValue('0') // TODO: change this to select current member
  })

  // bind function to member (male)
  $('#male_member').change(function () {
    $('#male_non_member_div').hide()
    $('#male_member_div').show()
    $('#male_first_name').val('')
    $('#male_mid_name').val('')
    $('#male_last_name').val('')
  })

  $('#female_non_member').change(function() {
    $('#witness_gmother_member_div').hide()
    $('#witness_gmother_non_member_div').show()
    selectizeEnable($('#male_member').val())
    $(selectFemale)[0].selectize.setValue('0')
  })

  // bind function to witness member
  $('#female_member').change(function () {
    $('#female_non_member_div').hide()
    $('#female_member_div').show()
    $('#female_first_name').val('')
    $('#female_mid_name').val('')
    $('#female_last_name').val('')
  })

  $('#add_gmother_button').click(function() {
    if(GMotherWitnessCtr === 6) {
      $('#witness_gmother_info_error').text('You have reached the maximum number of witnesses')
    } else {
      $('#GMotherWitnessModal').modal('show')
      $('#witness_gmother_info_error').text('')
      isMaleModal = false
    }
  })

  $('#add_gfather_button').click(function() {
    if(GFatherWitnessCtr === 6) {
      $('#witness_gfather_info_error').text('You have reached the maximum number of witnesses')
    } else {
      $('#GFatherWitnessModal').modal('show')
      $('#witness_gfather_info_error').text('')
      isMaleModal = true
    }
  })

  $('#add_gmother_witness').click(function (){
    var isValid = true

    var witnessMember = $('#input_witness_gmother_member').val() === '0' || $('#input_witness_gmother_member').val() === ''
    var witnessNonMember = $('#witness_gmother_first_name').val() === '' || $('#witness_gmother_mid_name').val() === '' || $('#witness_gmother_last_name').val() === ''
    var witnessMiddleLen = $('#witness_gmother_mid_name').val().length === 1

    if (witnessMember && witnessNonMember) {
      isValid = false
      $('#witness_gmother_modal_info_error').text('Please accomplish all fields')
    } else {
      $('#witness_gmother_modal_info_error').text('')
    }
    if (!witnessNonMember && !witnessMiddleLen) {
      isValid = false
      $('#witness_gmother_modal_middle_len_error').text('Middle Initial should only contain 1 letter')
    } else {
      $('#witness_gmother_modal_middle_len_error').text('')
    }

    if (witnessNonMember === false && validateMidInitial($('#witness_gmother_mid_name').val()) === false) {
      isValid = false
      $('#witness_gmother_modal_middle_error').text('Middle Initial should only range from letters A-Z')
    } else {
      $('#witness_gmother_modal_middle_error').text('')
    }

    if(isValid) {
      var witnessName
      if(witnessMember) {
        const firstName = $('#witness_gmother_first_name').val()
        const midName = $('#witness_gmother_mid_name').val()
        const lastName = $('#witness_gmother_last_name').val()
        $('#gmother_witness_row').append(
          "<div class='col-4' style='margin-bottom: 1em;'>" +
            "<div class='card witness female'><div class='card-body'>" + 
              "<p class='card-text'>" + 
                "<span class='first_name'>" + firstName + "</span> " + 
                "<span class='mid_name'>" + midName + "</span> " + 
                "<span class='last_name'>" + lastName + "</span>" + 
              "</p>" +
              "<button type='button' class='fas fa-trash delGMotherWitnessBtn '></button>" + 
            "</div>" + 
          "</div>" + 
        "</div>")
      } else {
        const witness_info = $('#input_witness_gmother_member').val()
        witnessName = witness_info.replace(/\d+/g, '')
        witnessName = witnessName.replace(/,/g, '')
        $('#gmother_witness_row').append("<div class='col-4' style='margin-bottom: 1em;'><div class='card witness female' data-member-info=\"" + witness_info + "\"><div class='card-body'><p class='card-text'>" + witnessName + "</p><button type='button' class='fas fa-trash delGMotherWitnessBtn '></button> </div></div></div>")
      }
      $('#witness_gmother_info_error').text('')
      $('#witness_gfather_info_error').text('')
      $('#witness_gmother_first_name').val('')
      $('#witness_gmother_mid_name').val('')
      $('#witness_gmother_last_name').val('')
      GMotherWitnessCtr++;
      
      addedWitness = true
      $('#GMotherWitnessModal').modal('hide');
    }
  })

  $('#add_gfather_witness').click(function (){
    var isValid = true

    var witnessMember = $('#input_witness_gfather_member').val() === '0' || $('#input_witness_gfather_member').val() === ''
    var witnessNonMember = $('#witness_gfather_first_name').val() === '' || $('#witness_gfather_mid_name').val() === '' || $('#witness_gfather_last_name').val() === ''
    var witnessMiddleLen = $('#witness_gfather_mid_name').val().length === 1

    if (witnessMember && witnessNonMember) {
      isValid = false
      $('#witness_gfather_modal_info_error').text('Please accomplish all fields')
    } else {
      $('#witness_gfather_modal_info_error').text('')
    }
    if (!witnessNonMember && !witnessMiddleLen) {
      isValid = false
      $('#witness_gfather_modal_middle_len_error').text('Middle Initial should only contain 1 letter')
    } else {
      $('#witness_gfather_modal_middle_len_error').text('')
    }

    if (witnessNonMember === false && validateMidInitial($('#witness_gfather_mid_name').val()) === false) {
      isValid = false
      $('#witness_gfather_modal_middle_error').text('Middle Initial should only range from letters A-Z')
    } else {
      $('#witness_gfather_modal_middle_error').text('')
    }


    if(isValid) {
      var witnessName
      if(witnessMember) {
        const firstName = $('#witness_gfather_first_name').val()
        const midName = $('#witness_gfather_mid_name').val()
        const lastName = $('#witness_gfather_last_name').val()
        $('#gfather_witness_row').append(
          "<div class='col-4' style='margin-bottom: 1em;'>" +
            "<div class='card witness male'><div class='card-body'>" + 
              "<p class='card-text'>" + 
                "<span class='first_name'>" + firstName + "</span> " + 
                "<span class='mid_name'>" + midName + "</span> " + 
                "<span class='last_name'>" + lastName + "</span>" + 
              "</p>" +
              "<button type='button' class='fas fa-trash delGFatherWitnessBtn '></button>" + 
            "</div>" + 
          "</div>" + 
        "</div>")
      } else {
        const witness_info = $('#input_witness_gfather_member').val()
        witnessName = witness_info.replace(/\d+/g, '')
        witnessName = witnessName.replace(/,/g, '')
        $('#gfather_witness_row').append("<div class='col-4' style='margin-bottom: 1em;'><div class='card witness male' data-member-info=\"" + witness_info + "\"><div class='card-body'><p class='card-text'>" + witnessName + "</p><button type='button' class='fas fa-trash delGFatherWitnessBtn '></button> </div></div></div>")
      }
      $('#witness_gfather_info_error').text('')
      $('#witness_gmother_info_error').text('')
      $('#witness_gfather_first_name').val('')
      $('#witness_gfather_mid_name').val('')
      $('#witness_gfather_last_name').val('')
      GFatherWitnessCtr++;
      
      addedWitness = true
      $('#GFatherWitnessModal').modal('hide');
    }
  })

  $(document).on('click', '.delGMotherWitnessBtn', function () {
    const member = $(this).closest('.card').attr('data-member-info')
    if (member !== null) {
      selectizeEnable(member)
    }
    $(this).closest('.col-4').remove()
    GMotherWitnessCtr--
  })
  
  $(document).on('click', '.delGFatherWitnessBtn', function () {
    const member = $(this).closest('.card').attr('data-member-info')
    if (member !== null) {
      selectizeEnable(member)
    }
    $(this).closest('.col-4').remove()
    GFatherWitnessCtr--
  })

  function validateMidInitial (mid) {
    const re = /^[A-Z]/
    return re.test(mid)
  }
    
})