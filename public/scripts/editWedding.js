$(document).ready(function() {
  const selectMale = $('#input_male_member').selectize()
  const selectGroom = $('#input_groom_member').selectize()
  const selectFemale = $('#input_female_member').selectize()
  const selectBride = $('#input_bride_member').selectize()
  const selectWitnessMale = $('#input_male_witness_member').selectize()
  const selectWinessFemale = $('#input_female_witness_member').selectize()
  const editKeys = {
    brideMother: 0,
    brideFather: 1,
    groomMother: 2,
    groomFather: 3,
    editGodFather: 4,
    editGodMother: 5,
    addGodFather: 6,
    addGodMother: 7,
    deleteGodFather: 8,
    deleteGodMother: 9
  }
  var trigger = null
  var GMotherWitnessCtr = $('#gmother_witness_row > div').length
  var GFatherWitnessCtr = $('#gfather_witness_row > div').length
  var addedWitness = false
  var modalType = null
  var isFemale = false
  var didUpdate = false
  var currPerson = {}

  initSelectize()
  initSelectizeOptions()
  $('select').change(hideChoices)

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
    $(selectWinessFemale)[0].selectize.refreshOptions()
    $(selectWitnessMale)[0].selectize.refreshOptions()
    $('.selectize-dropdown').hide();
    $('.selectize-input').removeClass('focus input-active dropdown-active');
    $('div.selectize-input > input').blur();
  }

  function initSelectizeOptions() {
    // get bride
    selectizeDisable(getValue($('#bride_info').data('member')))
    // get groom
    selectizeDisable(getValue($('#groom_info').data('member')))
    // get bride mother
    selectizeDisable(getValue($('#bride_mother_info').data('member')))
    // get bride father
    selectizeDisable(getValue($('#bride_father_info').data('member')))
    // get groom mother
    selectizeDisable(getValue($('#groom_mother_info').data('member')))
    // get groom father
    selectizeDisable(getValue($('#groom_father_info').data('member')))
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
    $('#input_female_witness_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_male_witness_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
  }

  function selectizeDisable(data) {
    $('#input_male_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_groom_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_female_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_bride_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_female_witness_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_male_witness_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
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

  $('#save_changes').click(function() {
    const button = $(this)
    $(button).prop('disabled', true)
    if (validateMisc()) {
      const data = {
        date: new Date($('#date').val()).toISOString(),
        contract: $('#contract').val(),
        officiant: $('#officiant').val(),
        location: $('#location').val(),
        solemnizer: $('#solemnizer').val(),
        recordId: $('#wedding_info').data('wedding-id')
      }

      console.log(data)

      $.ajax({
        type: 'PUT',
        url: '/update_wedding',
        data: data,
        success: function (result) {
          if (result) {
            location.href = '/view_wedding/' + data.recordId
          }
        }
      })
    } else {
      $(button).prop('disabled', false)
    }
  })

  // On Save Edit Bride
  $('#save_bride_btn').click(function () {
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
        isFemale: true,
        isParent: false
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
              $('#bride_info').data('member', null)
              $('#bride_info').data('person', result)
              $('#bride_first_name_view').html(personInfo.firstName)
              $('#bride_mid_name_view').html(personInfo.midName)
              $('#bride_last_name_view').html(personInfo.lastName)
              $('#save_bride_btn').prop('disabled', false)
            }
            if (brideId) {
              selectizeEnable(getValue(brideId))
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
  $('#save_groom_btn').click(function () {
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
        isFemale: false,
        isParent: false
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
              $('#groom_info').data('member', null)
              $('#groom_info').data('person', result)
              $('#groom_first_name_view').html(personInfo.firstName)
              $('#groom_mid_name_view').html(personInfo.midName)
              $('#groom_last_name_view').html(personInfo.lastName)
              $('#save_groom_btn').prop('disabled', false)
            }

            if (groomId) {
              selectizeEnable(getValue(groomId))
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

  // On Save Female Click (Mothers)
  $('#save_female_btn').click(function () {
    $('#save_female_btn').prop('disabled', true)
    if (validateFemale()) {
      let memberId = currPerson.memberId
      let personId = currPerson.personId
      let info = $('#input_female_member').val().split(', ')

      const data = {
        isOldMember: memberId !== null && memberId !== undefined && memberId !== '',
        person: getDetails($('#female_member'), $('#female_none'), $('#input_female_member'), $('#female_first_name'), $('#female_mid_name'), $('#female_last_name')),
        recordId: $('#wedding_info').data('wedding-id'),
        oldMemberId: memberId,
        oldPersonId: personId,
        isFemale: true,
        isParent: false
      }

      let infoField = null
      let firstNameField = null
      let midNameField = null
      let lastNameField = null

      if (data.person !== null)
        data.person.personId = info[1]
      console.log(data)
      data.person = JSON.stringify(data.person)

      if (modalType === editKeys.brideMother) {
        data.coupleId = $('#wedding_info').data('bride-parents')
        infoField = $('#bride_mother_info')
        firstNameField = $('#bride_mother_first_name_view')
        midNameField = $('#bride_mother_mid_name_view')
        lastNameField = $('#bride_mother_last_name_view')
      } else if (modalType === editKeys.groomMother) {
        data.coupleId = $('#wedding_info').data('groom-parents')
        infoField = $('#groom_mother_info')
        firstNameField = $('#groom_mother_first_name_view')
        midNameField = $('#groom_mother_mid_name_view')
        lastNameField = $('#groom_mother_last_name_view')
      }

      $.ajax({
        type: 'PUT',
        url: '/update_wedding/couple',
        data: data,
        success: function (result) {

          console.log(result)
          if (result) {
            const personInfo = JSON.parse(data.person)
            console.log(personInfo)
            if (personInfo === null) {
              $(infoField).data('member', null)
              $(infoField).data('person', null)
              $(firstNameField).text('N/A')
              $(midNameField).text('N/A')
              $(lastNameField).text('N/A')
            } else if (personInfo.isMember) {
              $(infoField).data('member', info[0])
              $(infoField).data('person', info[1])
              $(firstNameField).html(info[2])
              $(midNameField).html(info[3])
              $(lastNameField).html(info[4])
            } else {
              $(infoField).data('member', null)
              $(infoField).data('person', result)
              $(firstNameField).html(personInfo.firstName)
              $(midNameField).html(personInfo.midName)
              $(lastNameField).html(personInfo.lastName)
            }
            $('#femaleModal').modal('hide')

            if (memberId) {
              selectizeEnable(getValue(memberId))
            }
          } else {
            $('#create_error').text('Error Editing Female')
          }
          $('#save_female_btn').prop('disabled', false)
        }
      })
    } else {
      $('#save_female_btn').prop('disabled', false)
    }
    
  })

  // On Save Male Click (Fathers)
  $('#save_male_btn').click(function () {
    $('#save_male_btn').prop('disabled', true)
    if (validateMale()) {

      console.log(modalType)
      let memberId = currPerson.memberId
      let personId = currPerson.personId
      let info = $('#input_male_member').val().split(', ')

      const data = {
        isOldMember: memberId !== null && memberId !== undefined && memberId !== '',
        person: getDetails($('#male_member'), $('#male_none'), $('#input_male_member'), $('#male_first_name'), $('#male_mid_name'), $('#male_last_name')),
        recordId: $('#wedding_info').data('wedding-id'),
        oldMemberId: memberId,
        oldPersonId: personId,
        isFemale: false,
        isParent: false
      }

      let infoField = null
      let firstNameField = null
      let midNameField = null
      let lastNameField = null

      if (data.person !== null)
        data.person.personId = info[1]
      console.log(data)
      data.person = JSON.stringify(data.person)

      if (modalType === editKeys.brideFather) {
        data.coupleId = $('#wedding_info').data('bride-parents')
        infoField = $('#bride_father_info')
        firstNameField = $('#bride_father_first_name_view')
        midNameField = $('#bride_father_mid_name_view')
        lastNameField = $('#bride_father_last_name_view')
      } else if (modalType === editKeys.groomFather) {
        data.coupleId = $('#wedding_info').data('groom-parents')
        infoField = $('#groom_father_info')
        firstNameField = $('#groom_father_first_name_view')
        midNameField = $('#groom_father_mid_name_view')
        lastNameField = $('#groom_father_last_name_view')
      }

      $.ajax({
        type: 'PUT',
        url: '/update_wedding/couple',
        data: data,
        success: function (result) {
          console.log(result)
          if (result) {

            const personInfo = JSON.parse(data.person)
            console.log("SAVE MALE")
            console.log(personInfo)
            if (personInfo === null) {
              $(infoField).data('member', null)
              $(infoField).data('person', null)
              $(firstNameField).text('N/A')
              $(midNameField).text('N/A')
              $(lastNameField).text('N/A')
            } else if (personInfo.isMember) {
              $(infoField).data('member', info[0])
              $(infoField).data('person', info[1])
              $(firstNameField).html(info[2])
              $(midNameField).html(info[3])
              $(lastNameField).html(info[4])
            } else {
              $(infoField).data('member', null)
              $(infoField).data('person', result)
              $(firstNameField).html(personInfo.firstName)
              $(midNameField).html(personInfo.midName)
              $(lastNameField).html(personInfo.lastName)
            }
            if (memberId) {
              selectizeEnable(getValue(memberId))
            }
            $('#maleModal').modal('hide')
          } else {
            $('#create_error').text('Error Editing Female')
          }
          $('#save_male_btn').prop('disabled', false)
        }
      })
    } else {
      $('#save_male_btn').prop('disabled', false)
    }


  })

  // On Save Female Witnesses Click
  $('#save_female_witness_btn, #save_male_witness_btn').click(function () {
    $(this).prop('disabled', true)
    let url = ''
    let isFemale = true
    let isEdit = true
    if (modalType === editKeys.editGodMother || modalType === editKeys.editGodFather) {
      url = '/update_wedding/witness'
    }
    else if (modalType === editKeys.addGodMother || modalType === editKeys.addGodFather) {
      url = '/update_wedding/add_witness'
      isEdit = false
    }

    if (modalType === editKeys.editGodFather || modalType === editKeys.addGodFather) {
      isFemale = false
    }

    let validation = validateFemaleWitness

    if (!isFemale) {
      validation = validateMaleWitness
    }
    console.log(url)
    saveWitness(this, validation, isFemale, isEdit, url)
  })

  $('#confirm_delete_witness').click(function () {
    const button = this
    $(button).prop('disabled', true)
    let isFemale = true

    if (modalType === editKeys.deleteGodFather) {
      isFemale = false
    }

    let errorModal = null

    if (isFemale) {
      errorModal = $('#witness_gmother_info_error')
    } else {
      errorModal = $('#witness_gfather_info_error')
    }

    const data = {
      recordId: $(trigger).data('record'),
      person: {
        memberId: $(trigger).data('member'),
        personId: $(trigger).data('person')
      }
    }

    data.person = JSON.stringify(data.person)
    $.ajax({
      type: 'DELETE',
      url: '/delete_wedding/witness',
      data: data,
      success: function(result) {
        console.log(result)
        if (result) {
          $(trigger).parent().remove()

          if (isFemale) {
            GMotherWitnessCtr--
          } else {
            GFatherWitnessCtr--
          }

          errorModal.text('')

          selectizeEnable(getValue($(trigger).data('member')))
        } else {
          errorModal.text('Error deleting witness')
        }
        $('#confirmDeleteWitnessModal').modal('hide')
        $(button).prop('disabled', false)
      }
    })
  })


  function saveWitness(button, validation, isFemale, isEdit, url) {
    $(button).prop('disabled', true)

    if (validation()) {
      let infoSelect = null
      let memberCheckField = null
      let memberSelectField = null
      let firstNameFormField = null
      let midNameFormField = null
      let lastNameFormField = null
      let modal = null


      if (isFemale) {
        infoSelect = $('#input_female_witness_member')
        memberCheckField = $('#female_witness_member')
        memberSelectField = $('#input_female_witness_member')
        firstNameFormField = $('#female_witness_first_name')
        midNameFormField = $('#female_witness_mid_name')
        lastNameFormField = $('#female_witness_last_name')
        modal = $('#femaleWitnessModal')
      } else {
        infoSelect = $('#input_male_witness_member')
        memberCheckField = $('#male_witness_member')
        memberSelectField = $('#input_male_witness_member')
        firstNameFormField = $('#male_witness_first_name')
        midNameFormField = $('#male_witness_mid_name')
        lastNameFormField = $('#male_witness_last_name')
        modal = $('#maleWitnessModal')
      }

      let memberId = currPerson.memberId
      let personId = currPerson.personId
      let info = $(infoSelect).val().split(', ')

      console.log(info)

      const data = {
        isOldMember: memberId !== null && memberId !== undefined && memberId !== '',
        person: getDetails(memberCheckField, null, memberSelectField, firstNameFormField, midNameFormField, lastNameFormField),
        recordId: $('#wedding_info').data('wedding-id'),
        witnessId: currPerson.witnessId,
        oldMemberId: memberId,
        oldPersonId: personId,
        isFemale: isFemale
      }

      let infoField = trigger

      if (data.person !== null)
        data.person.personId = info[1]

      data.person = JSON.stringify(data.person)
      $.ajax({
        type: 'PUT',
        url: url,
        data: data,
        success: function (result) {
          console.log(result)
          if (result) {
            const personInfo = JSON.parse(data.person)
            console.log(personInfo)
            
            if (isEdit) {
              let firstNameField = trigger.find('.witness_first_name_view')
              let midNameField = trigger.find('.witness_mid_name_view')
              let lastNameField = trigger.find('.witness_last_name_view')
              if (personInfo.isMember) {
                $(infoField).data('member', personInfo.memberId)
                $(infoField).data('person', info[1])
                $(firstNameField).html(info[2])
                $(midNameField).html(info[3])
                $(lastNameField).html(info[4])
              } else {
                $(infoField).data('member', null)
                $(infoField).data('person', JSON.parse(result))
                $(firstNameField).html(personInfo.firstName)
                $(midNameField).html(personInfo.midName)
                $(lastNameField).html(personInfo.lastName)
              }

              if (memberId) {
                selectizeEnable(getValue(memberId))
              }
            } else {
              let div = null
              if (isFemale) {
                div = $('#gmother_witness_row')
                GMotherWitnessCtr++
              } else {
                div = $('#gfather_witness_row')
                GFatherWitnessCtr++
              }

              const witness_info = $.parseHTML(result)
              
              if (personInfo.isMember) {
                $(witness_info).find('.witness_first_name_view').text(info[2])
                $(witness_info).find('.witness_mid_name_view').text(info[3])
                $(witness_info).find('.witness_last_name_view').text(info[4])
              } 

              $(div).append(witness_info)
            }

            $(modal).modal('hide')
          } else {
            $('#create_error').text('Error Editing Godmother')
          }
          $(button).prop('disabled', false)
        }
      })
    } else {
      $(button).prop('disabled', false)
    }
  }

  // On Edit Bride Click
  $('#edit_bride').click(function () {
    currPerson.firstName = $('#bride_first_name_view').text().trim()
    currPerson.midName = $('#bride_mid_name_view').text().trim()
    currPerson.lastName = $('#bride_last_name_view').text().trim()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#bride_info').data('member')
    currPerson.personId = $('#bride_info').data('person')
    currPerson.canBeNone = false
    isFemale = true

    initBrideModal()
  })

  // On Edit Bride Mother Click
  $('#edit_bride_mother').click(function () {
    modalType = editKeys.brideMother
    currPerson.firstName = $('#bride_mother_first_name_view').text().trim()
    currPerson.midName = $('#bride_mother_mid_name_view').text().trim()
    currPerson.lastName = $('#bride_mother_last_name_view').text().trim()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#bride_mother_info').data('member')
    currPerson.personId = $('#bride_mother_info').data('person')
    currPerson.canBeNone = true
    isFemale = true

    initFemaleModal('Edit Bride Mother')
  })

  // On Edit Bride Father Click
  $('#edit_bride_father').click(function () {
    modalType = editKeys.brideFather
    currPerson.firstName = $('#bride_father_first_name_view').text().trim()
    currPerson.midName = $('#bride_father_mid_name_view').text().trim()
    currPerson.lastName = $('#bride_father_last_name_view').text().trim()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#bride_father_info').data('member')
    currPerson.personId = $('#bride_father_info').data('person')
    currPerson.canBeNone = true

    console.log("PERSON INFO: ")
    console.log(currPerson)
    isFemale = false

    initMaleModal('Edit Bride Father')
  })

  // On Edit Groom Click
  $('#edit_groom').click(function() {
    currPerson.firstName = $('#groom_first_name_view').text().trim()
    currPerson.midName = $('#groom_mid_name_view').text().trim()
    currPerson.lastName = $('#groom_last_name_view').text().trim()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#groom_info').data('member')
    currPerson.personId = $('#groom_info').data('person')
    currPerson.canBeNone = false
    isFemale = false

    console.log(currPerson)
    initGroomModal()
  })

    // On Edit Groom Mother Click
  $('#edit_groom_mother').click(function () {
    modalType = editKeys.groomMother
    currPerson.firstName = $('#groom_mother_first_name_view').text().trim()
    currPerson.midName = $('#groom_mother_mid_name_view').text().trim()
    currPerson.lastName = $('#groom_mother_last_name_view').text().trim()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#groom_mother_info').data('member')
    currPerson.personId = $('#groom_mother_info').data('person')
    currPerson.canBeNone = true
    isFemale = true

    initFemaleModal('Edit Groom Mother')
  })

  // On Edit Groom Father Click
  $('#edit_groom_father').click(function () {
    modalType = editKeys.groomFather
    currPerson.firstName = $('#groom_father_first_name_view').text().trim()
    currPerson.midName = $('#groom_father_mid_name_view').text().trim()
    currPerson.lastName = $('#groom_father_last_name_view').text().trim()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')
    currPerson.memberId = $('#groom_father_info').data('member')
    currPerson.personId = $('#groom_father_info').data('person')
    currPerson.canBeNone = true
    isFemale = false

    initMaleModal('Edit Groom Father')
  })

  // On Edit GodMother
  $(document).on('click', '.edit_female_witness_btn', function() {
    const person = $(this).closest('.witness')
    modalType = editKeys.editGodMother
    currPerson.firstName = $(person).find('.witness_first_name_view').text().trim()
    currPerson.midName = $(person).find('.witness_mid_name_view').text().trim()
    currPerson.lastName = $(person).find('.witness_last_name_view').text().trim()
    currPerson.doesExist =true
    currPerson.memberId = $(person).data('member')
    currPerson.personId = $(person).data('person')
    currPerson.witnessId = $(person).data('record')
    currPerson.canBeNone = false
    isFemale = true
    trigger = person
    
    initFemaleWitnessModal('Edit Godmother')
  })

  $(document).on('click', '.edit_male_witness_btn', function () {
    const person = $(this).closest('.witness')
    modalType = editKeys.editGodFather
    currPerson.firstName = $(person).find('.witness_first_name_view').text().trim()
    currPerson.midName = $(person).find('.witness_mid_name_view').text().trim()
    currPerson.lastName = $(person).find('.witness_last_name_view').text().trim()
    currPerson.doesExist = true
    currPerson.memberId = $(person).data('member')
    currPerson.personId = $(person).data('person')
    currPerson.witnessId = $(person).data('record')
    currPerson.canBeNone = false
    isFemale = false
    trigger = person

    initMaleWitnessModal('Edit Godfather')
  })

  $(document).on('click', '.delete_male_witness_btn', function() {
    trigger = $(this).closest('.witness')
    modalType = editKeys.deleteGodFather
    $('#confirmDeleteWitnessModal').modal('show')
  })

  $(document).on('click', '.delete_female_witness_btn', function() {
    trigger = $(this).closest('.witness')
    modalType = editKeys.deleteGodMother
    $('#confirmDeleteWitnessModal').modal('show')
  })

  $('#add_gmother_button').click(function() {
    // add validation here
    if (GMotherWitnessCtr >= 6) {
      $('#witness_gmother_info_error').text('You have reached the maximum number of witnesses')
    } else {
      modalType = editKeys.addGodMother
      currPerson = {}
      isFemale = true
      initFemaleWitnessModal('Add Godmother')
    }
  })
  

  $('#add_gfather_button').click(function() {
    if (GFatherWitnessCtr >= 6) {
      $('#witness_gfather_info_error').text('You have reached the maximum number of witnesses')
    } else {
      modalType = editKeys.addGodFather
      currPerson = {}
      isFemale = false
      initMaleWitnessModal('Add Godfather')
    }
  })

  function initFemaleWitnessModal(title) {
    $('#femaleWitnessModalTitle').text(title)
    if (modalType === editKeys.addGodMother) {
      $('#female_witness_member').prop('checked', true)
      $('#female_witness_member_div').show()
      $('#female_witness_non_member_div').hide()
      selectWinessFemale[0].selectize.setValue('0')
    } else if (modalType === editKeys.editGodMother) {
      if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
        $('#female_witness_member').prop('checked', true)
        $('#female_witness_member_div').show()
        $('#female_witness_non_member_div').hide()
        const id = currPerson.memberId
        const value = $('.option[data-value^="' + id + '"]').data('value')
        selectWinessFemale[0].selectize.setValue(value)
        selectizeDisable(value)
      } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined) {
        $('#female_witness_non_member').prop('checked', true)
        $('#female_witness_non_member_div').show()
        $('#female_witness_member_div').hide()
        $('#female_witness_first_name').val(currPerson.firstName)
        $('#female_witness_mid_name').val(currPerson.midName)
        $('#female_witness_last_name').val(currPerson.lastName)
      }
    }

    $('#femaleWitnessModal').modal('show')
  }

  function initMaleWitnessModal(title) {
    $('#maleWitnessModalTitle').text(title)
    if (modalType === editKeys.addGodFather) {
      $('#male_witness_member').prop('checked', true)
      $('#male_witness_member_div').show()
      $('#male_witness_non_member_div').hide()
      selectWitnessMale[0].selectize.setValue('0')
    } else if (modalType === editKeys.editGodFather) {
      if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
        $('#male_witness_member').prop('checked', true)
        $('#male_witness_member_div').show()
        $('#male_witness_non_member_div').hide()
        const id = currPerson.memberId
        const value = $('.option[data-value^="' + id + '"]').data('value')
        selectWitnessMale[0].selectize.setValue(value)
        selectizeDisable(value)
      } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined) {
        $('#male_witness_non_member').prop('checked', true)
        $('#male_witness_non_member_div').show()
        $('#male_witness_member_div').hide()
        $('#male_witness_first_name').val(currPerson.firstName)
        $('#male_witness_mid_name').val(currPerson.midName)
        $('#male_witness_last_name').val(currPerson.lastName)
      }
    }

    $('#maleWitnessModal').modal('show')
  }

  function initFemaleModal(title) {
    $('#female_modal_title').html(title)
    if (currPerson.canBeNone) {
      $('#female_none_div').show()
    } else {
      $('#female_none_div').hide()
    }

    if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
      $('#female_member').prop('checked', true)
      $('#female_member_div').show()
      $('#female_non_member_div').hide()
      const id = currPerson.memberId
      const value = $('.option[data-value^="' + id + '"]').data('value')
      selectFemale[0].selectize.setValue(value)
    } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined){
      $('#female_non_member').prop('checked', true)
      $('#female_non_member_div').show()
      $('#female_member_div').hide()
      $('#female_first_name').val(currPerson.firstName)
      $('#female_mid_name').val(currPerson.midName)
      $('#female_last_name').val(currPerson.lastName)
    } else {
      $('#female_none').prop('checked', true)
      $('#female_member_div').hide()
      $('#female_non_member_div').hide()
    }
    
    $('#femaleModal').modal('show')
  }

  function initBrideModal() {
    if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
      $('#bride_member').prop('checked', true)
      $('#bride_member_div').show()
      $('#bride_non_member_div').hide()
      const id = currPerson.memberId
      const value = $('.option[data-value^="' + id + '"]').data('value')
      selectBride[0].selectize.setValue(value)
      selectizeDisable(value)
    } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined) {
      $('#bride_non_member').prop('checked', true)
      $('#bride_non_member_div').show()
      $('#bride_member_div').hide()
      $('#bride_first_name').val(currPerson.firstName)
      $('#bride_mid_name').val(currPerson.midName)
      $('#bride_last_name').val(currPerson.lastName)
    } 

    $('#brideModal').modal('show')
  }

  function initGroomModal() {

    if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
      $('#groom_member').prop('checked', true)
      $('#groom_member_div').show()
      $('#groom_non_member_div').hide()
      const id = currPerson.memberId
      const value = $('.option[data-value^="' + id + '"]').data('value')
      selectGroom[0].selectize.setValue(value)
    } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined) {
      $('#groom_non_member').prop('checked', true)
      $('#groom_non_member_div').show()
      $('#groom_member_div').hide()
      console.log(currPerson)
      $('#groom_first_name').val(currPerson.firstName)
      $('#groom_mid_name').val(currPerson.midName)
      $('#groom_last_name').val(currPerson.lastName)
    }

    $('#groomModal').modal('show')
  }

  function initMaleModal(title) {
    $('#maleModalTitle').text(title)
    if (currPerson.canBeNone) {
      $('#male_none_div').show()
    } else {
      $('#male_none_div').hide()
    }

    if (currPerson.memberId !== '' && currPerson.memberId !== null && currPerson.memberId !== undefined) {
      $('#male_member').prop('checked', true)
      $('#male_member_div').show()
      $('#male_non_member_div').hide()
      const id = currPerson.memberId
      const value = $('.option[data-value^="' + id + '"]').data('value')
      selectMale[0].selectize.setValue(value)
    } else if (currPerson.personId !== '' && currPerson.personId !== null && currPerson.personId !== undefined) {
      $('#male_non_member').prop('checked', true)
      $('#male_non_member_div').show()
      $('#male_member_div').hide()
      $('#male_first_name').val(currPerson.firstName)
      $('#male_mid_name').val(currPerson.midName)
      $('#male_last_name').val(currPerson.lastName)
    } else {
      $('#male_none').prop('checked', true)
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
    var isValidMidName = validateMidInitial($('#groom_mid_name').val())
    var midNameLen = $('#groom_mid_name').val().length === 1
    // Check if valid member
    if (isMember && !isValidMemberField) {
      isValid = false
      $(errorField).text('Please select groom')
    } else if (!isMember) {
      if (anyEmpty) {
        isValid = false
        $(errorField).text('Please provide groom name')
      } else if (!isValidMidName) {
        isValid = false
        $(errorField).text("Bride's middle initial should only range from letters A-Z")
      } else if (!midNameLen) {
        isValid = false
        $(errorField).text("Middle initial should only contain 1 letter")
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
    var isValidMidName = validateMidInitial($('#bride_mid_name').val())
    var midNameLen = $('#bride_mid_name').val().length === 1
    // Check if valid member
    if (isMember && !isValidMemberField) {
      isValid = false
      $(errorField).text('Please select bride')
    } else if (!isMember) {
      if (anyEmpty) {
        isValid = false
        $(errorField).text('Please provide bride name')
      } else if (!isValidMidName) {
        isValid = false
        $(errorField).text("Bride's middle initial should only range from letters A-Z")
      } else if (!midNameLen) {
        isValid = false
        $(errorField).text("Middle initial should only contain 1 letter")
      }
    }

    if (isValid) {
      $(errorField).text('')
    }
    return isValid
  }

  function validateMale() {
    var isValid = true
    var errorField = $('#male_modal_info_error')
    $(errorField).text('')

    var isMember = $('#male_member').is(':checked')
    var isNone = $('#male_none').is(':checked')
    var isValidMemberField = !($('#input_male_member').val() === '0' || $('#input_male_member').val() === '')
    var anyEmpty = $('#male_first_name').val() === '' || $('#male_mid_name').val() === '' || $('#male_last_name').val() === ''
    var isValidMidName = validateMidInitial($('#male_mid_name').val())
    var midNameLen = $('#male_mid_name').val().length === 1
    // Check if valid member
    if (isMember && !isValidMemberField) {
      isValid = false
      $(errorField).text('Please select member')
    } else if (!isMember && !isNone) {
      if (anyEmpty) {
        isValid = false
        $(errorField).text('Please provide name')
      } else if (!isValidMidName) {
        isValid = false
        $(errorField).text("Middle initial should only range from letters A-Z")
      } else if (!midNameLen) {
        isValid = false
        $(errorField).text("Middle initial should only contain 1 letter")
      }
    }

    if (isValid) {
      $(errorField).text('')
    }
    return isValid
  }

  function validateFemale() {
    var isValid = true
    var errorField = $('#female_modal_info_error')
    $(errorField).text('')

    var isMember = $('#female_member').is(':checked')
    var isNone = $('#female_none').is(':checked')
    var isValidMemberField = !($('#input_female_member').val() === '0' || $('#input_female_member').val() === '')
    var anyEmpty = $('#female_first_name').val() === '' || $('#female_mid_name').val() === '' || $('#female_last_name').val() === ''
    var isValidMidName = validateMidInitial($('#female_mid_name').val())
    var midNameLen = $('#female_mid_name').val().length === 1
    // Check if valid member
    if (isMember && !isValidMemberField) {
      isValid = false
      $(errorField).text('Please select member')
    } else if (!isMember && !isNone) {
      if (anyEmpty) {
        isValid = false
        $(errorField).text('Please provide name')
      } else if (!isValidMidName) {
        isValid = false
        $(errorField).text("Middle initial should only range from letters A-Z")
      } else if (!midNameLen) {
        isValid = false
        $(errorField).text("Middle initial should only contain 1 letter")
      }
    }

    if (isValid) {
      $(errorField).text('')
    }
    return isValid
  }

  function validateMaleWitness() {
    var isValid = true
    var errorField = $('#male_witness_modal_info_error')
    $(errorField).text('')

    var isMember = $('#male_witness_member').is(':checked')
    var isNone = $('#male_witness_none').is(':checked')
    var isValidMemberField = !($('#input_male_witness_member').val() === '0' || $('#input_male_witness_member').val() === '')
    var anyEmpty = $('#male_witness_first_name').val() === '' || $('#male_witness_mid_name').val() === '' || $('#male_witness_last_name').val() === ''
    var isValidMidName = validateMidInitial($('#male_witness_mid_name').val())
    var midNameLen = $('#male_witness_mid_name').val().length === 1
    // Check if valid member
    if (isMember && !isValidMemberField) {
      isValid = false
      $(errorField).text('Please select member')
    } else if (!isMember && !isNone) {
      if (anyEmpty) {
        isValid = false
        $(errorField).text('Please provide name')
      } else if (!isValidMidName) {
        isValid = false
        $(errorField).text("Middle initial should only range from letters A-Z")
      } else if (!midNameLen) {
        isValid = false
        $(errorField).text("Middle initial should only contain 1 letter")
      }
    }

    if (isValid) {
      $(errorField).text('')
    }
    return isValid
  }

  function validateFemaleWitness() {
    var isValid = true
    var errorField = $('#female_witness_modal_info_error')
    $(errorField).text('')

    var isMember = $('#female_witness_member').is(':checked')
    var isNone = $('#female_witness_none').is(':checked')
    var isValidMemberField = !($('#input_female_witness_member').val() === '0' || $('#input_female_witness_member').val() === '')
    var anyEmpty = $('#female_witness_first_name').val() === '' || $('#female_witness_mid_name').val() === '' || $('#female_witness_last_name').val() === ''
    var isValidMidName = validateMidInitial($('#female_witness_mid_name').val())
    var midNameLen = $('#female_witness_mid_name').val().length === 1
    // Check if valid member
    if (isMember && !isValidMemberField) {
      isValid = false
      $(errorField).text('Please select member')
    } else if (!isMember && !isNone) {
      if (anyEmpty) {
        isValid = false
        $(errorField).text('Please provide name')
      } else if (!isValidMidName) {
        isValid = false
        $(errorField).text("Middle initial should only range from letters A-Z")
      } else if (!midNameLen) {
        isValid = false
        $(errorField).text("Middle initial should only contain 1 letter")
      }
    }

    if (isValid) {
      $(errorField).text('')
    }
    return isValid
  }

  function validateMisc() {
    var isValid = true
    var hasLocation = !validator.isEmpty($('#location').val())
    var hasDate = !validator.isEmpty($('#date').val())
    var hasContract = !validator.isEmpty($('#contract').val())
    var hasOfficiant = !validator.isEmpty($('#officiant').val())
    var hasSolemnizer = !validator.isEmpty($('#solemnizer').val())
    
    if (!hasDate) {
      isValid = false
      $('#date_error').text('Please add date')
    } else {
      $('#date_error').text('')
    }
    
    if (!hasLocation) {
      isValid = false
      $('#location_error').html('Please add location')
    } else {
      $('#location_error').text('')
    }

    if (!hasContract) {
      isValid = false
      $('#contract_info_error').text('Please add contract')
    } else {
      $('#contract_info_error').text('')
    }

    if (!hasOfficiant) {
      isValid = false
      $('#officiant_info_error').text('Please add officiant')
    } else {
      $('#officiant_info_error').text('')
    }

    if (!hasSolemnizer) {
      isValid = false
      $('#solemnizer_info_error').text('Please add solemnizer')
    } else {
      $('#solemnizer_info_error').text('')
    }

    if (GMotherWitnessCtr < 1 && GFatherWitnessCtr < 1) {
      isValid = false
      $('#witness_gmother_info_error').text('Need at least 1 Witness')
      $('#witness_gfather_info_error').text('Need at least 1 Witness')
    } else {
      $('#witness_gfather_info_error').text('')
      $('#witness_gmother_info_error').text('')
    }


    return isValid
  }

  $('#male_non_member').change(function() {
    $('#male_member_div').hide()
    $('#male_non_member_div').show()
    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#male_first_name').val('')
      $('#male_mid_name').val('')
      $('#male_last_name').val('')
    } else {
      $('#male_first_name').val(currPerson.firstName)
      $('#male_mid_name').val(currPerson.midName)
      $('#male_last_name').val(curPerson.lastName)
    }
  })

  // bind function to member (male)
  $('#male_member').change(function () {
    $('#male_non_member_div').hide()
    $('#male_member_div').show()
    let value = '0'
    selectizeEnable($('#male_member').val())
    if (currPerson.memberId !== null && currPerson.memberId !== '' && currPerson.memberId !== undefined) {
      value = getValue(currPerson.memberId)
    }
    $(selectMale)[0].selectize.setValue(value) 
  })

  $('#female_non_member').change(function() {
    $('#female_member_div').hide()
    $('#female_non_member_div').show()

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#female_first_name').val('')
      $('#female_mid_name').val('')
      $('#female_last_name').val('')
    } else {
      $('#female_first_name').val(currPerson.firstName)
      $('#female_mid_name').val(currPerson.midName)
      $('#female_last_name').val(curPerson.lastName)
    }
  })

  // bind function to witness member
  $('#female_member').change(function () {
    $('#female_non_member_div').hide()
    $('#female_member_div').show()

    let value = '0'
    selectizeEnable($('#female_member').val())
    if (currPerson.memberId !== null && currPerson.memberId !== '' && currPerson.memberId !== undefined) {
      value = getValue(currPerson.memberId)
    }
    $(selectFemale)[0].selectize.setValue(value)
  })

  $('#female_witness_member').change(function() {
    $('#female_witness_non_member_div').hide()
    $('#female_witness_member_div').show()

    let value = '0'
    selectizeEnable($('#female_witness_member').val())
    if (currPerson.memberId !== null && currPerson.memberId !== '' && currPerson.memberId !== undefined) {
      value = getValue(currPerson.memberId)
    }
    $(selectWinessFemale)[0].selectize.setValue(value)
  })

  $('#female_witness_non_member').change(function() {
    $('#female_witness_member_div').hide()
    $('#female_witness_non_member_div').show()

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#female+_witness_first_name').val('')
      $('#female+_witness_mid_name').val('')
      $('#female+_witness_last_name').val('')
    } else {
      $('#female+_witness_first_name').val(currPerson.firstName)
      $('#female+_witness_mid_name').val(currPerson.midName)
      $('#female+_witness_last_name').val(curPerson.lastName)
    } 
  })

  $('#male_witness_member').change(function() {
    $('#male_witness_non_member_div').hide()
    $('#male_witness_member_div').show()

    let value = '0'
    selectizeEnable($('#male_witness_member').val())
    if (currPerson.memberId !== null && currPerson.memberId !== '' && currPerson.memberId !== undefined) {
      value = getValue(currPerson.memberId)
    }
    $(selectWitnessMale)[0].selectize.setValue(value)
  })

  $('#male_witness_non_member').change(function () {
    $('#male_witness_member_div').hide()
    $('#male_witness_non_member_div').show()
    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#male_witness_first_name').val('')
      $('#male_witness_mid_name').val('')
      $('#male_witness_last_name').val('')
    } else {
      $('#male_witness_first_name').val(currPerson.firstName)
      $('#male_witness_mid_name').val(currPerson.midName)
      $('#male_witness_last_name').val(curPerson.lastName)
    }
  })

  function validateMidInitial (mid) {
    const re = /^[A-Z]/
    return re.test(mid)
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