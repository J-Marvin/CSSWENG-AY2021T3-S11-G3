$(document).ready(function() {

  var GMotherWitnessCtr = 0
  var GFatherWitnessCtr = 0
  var addedWitness = false
  var witnessType = null

  const selectChild = $('#input_child_member').selectize()
  const selectParent1 = $('#input_parent1_member').selectize()
  const selectParent2 = $('#input_parent2_member').selectize()
  const selectWitnessGMother = $('#input_witness_gmother_member').selectize()
  const selectWitnessGFather = $('#input_witness_gfather_member').selectize()
  const currPerson = {}
  const editKeys = {
    editGodmother: 1,
    editGodfather: 2,
    addGodmother: 3,
    addGodfather: 4
  }

  initSelectize()
  initSelectizeOptions()
  
  $('select').change(hideChoices)

  // Show child modal
  $('#edit_child').click(function() {
    currPerson.memberId = $('#infant_info').data('member')
    currPerson.personId = $('#infant_info').data('person')
    currPerson.firstName = $('#child_first_name_view').text()
    currPerson.midName = $('#child_mid_name_view').text()
    currPerson.lastName = $('#child_last_name_view').text()
    currPerson.doesExist = true

    console.log(currPerson)

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#child_member').prop('checked', true)
      $('#child_member_div').show()
      $('#child_non_member_div').hide()
      $(selectChild)[0].selectize.setValue(getValue(currPerson.memberId))
    } else {
      $('#child_non_member').prop('checked', true)
      $('#child_non_member_div').show()
      $('#child_member_div').hide()

      $('#child_first_name').val(currPerson.firstName)
      $('#child_mid_name').val(currPerson.midName)
      $('#child_last_name').val(currPerson.lastName)
    }
    $('#editChild').modal('show')
  })

  // Show parent 1 modal
  $('#edit_parent_one').click(function() {
    currPerson.memberId = $('#parent1_info').data('member')
    currPerson.personId = $('#parent1_info').data('person')
    currPerson.firstName = $('#parent1_first_name_view').text()
    currPerson.midName = $('#parent1_mid_name_view').text()
    currPerson.lastName = $('#parent1_last_name_view').text()
    currPerson.doesExist = true

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#parent1_member').prop('checked', true)
      $('#parent1_member_div').show()
      $('#parent1_non_member_div').hide()
      $(selectParent1)[0].selectize.setValue(getValue(currPerson.memberId))
    } else {
      $('#parent1_non_member').prop('checked', true)
      $('#parent1_non_member_div').show()
      $('#parent1_member_div').hide()

      $('#parent1_first_name').val(currPerson.firstName)
      $('#parent1_mid_name').val(currPerson.midName)
      $('#parent1_last_name').val(currPerson.lastName)
    }
    $('#editParentOne').modal('show')
  })

  // Show parent 2 modal
  $('#edit_parent_two').click(function() {
    currPerson.memberId = $('#parent2_info').data('member')
    currPerson.personId = $('#parent2_info').data('person')
    currPerson.firstName = $('#parent2_first_name_view').text()
    currPerson.midName = $('#parent2_mid_name_view').text()
    currPerson.lastName = $('#parent2_last_name_view').text()
    currPerson.doesExist = !(currPerson.firstName === 'N/A')

    if (currPerson.memberId !== null && currPerson.personId !== '') {
      $('#parent2_member').prop('checked', true)
      $('#parent2_member_div').show()
      $('#parent2_non_member_div').hide()
      $(selectParent2)[0].selectize.setValue(getValue(currPerson.memberId))
    } else if(currPerson.doesExist) {
      $('#parent2_non_member').prop('checked', true)
      $('#parent2_non_member_div').show()
      $('#parent2_member_div').hide()

      $('#parent2_first_name').val(currPerson.firstName)
      $('#parent2_mid_name').val(currPerson.midName)
      $('#parent2_last_name').val(currPerson.lastName)
    } else {
      $('#parent2_none').prop('checked', true)
      $('#parent2_non_member_div').hide()
      $('#parent2_member_div').hide()
    }
    $('#editParentTwo').modal('show')
  })

  $('#save_edit_child').click(function() {
    const button = this

    $(button).prop('disabled', true)

    if(validateChild()) {
      let memberId = currPerson.memberId
      let personId = currPerson.personId
      let newPersonInfo = $('#input_child_member').val().split(', ')

      const data = {
        isOldMember: memberId !== null && memberId !== '',
        person: getDetails($('#child_member'), null, $('#input_child_member'), $('#child_first_name'), $('#child_mid_name'), $('#child_last_name')),
        recordId: $('#dedication_info').data('dedicationid'),
        oldMemberId: memberId,
        oldPersonId: personId
      }

      if (!data.person.isMember) {
        data.person.personId = newPersonInfo[1]
      }

      data.person = JSON.stringify(data.person)

      $.ajax({
        type: 'PUT',
        url: '/update_dedication/child',
        data: data,
        success: function (result) {
          if (result) { 
            const personInfo = JSON.parse(data.person)
            let infoField = $('#infant_info')
            let firstNameField = $('#child_first_name_view')
            let midNameField = $('#child_mid_name_view')
            let lastNameField = $('#child_last_name_view')
            if (personInfo.isMember) {
              $(infoField).data('member', personInfo.memberId)
              $(infoField).data('person', newPersonInfo[1])
              $(firstNameField).html(newPersonInfo[2])
              $(midNameField).html(newPersonInfo[3])
              $(lastNameField).html(newPersonInfo[4])
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
          } else {
            alert("SOMETHING WENT WRONG")
          }
          $('#editChild').modal('hide')
          $(button).prop('disabled', false)
        }
      })
    } else {
      $(button).prop('disabled', false)
    }
  })

  function validateChild() {
    var firstName = validator.isEmpty($('#child_first_name').val())
    var midName = validator.isEmpty($('#child_mid_name').val())
    var lastName = validator.isEmpty($('#child_last_name').val())

    var inputChild = validator.isEmpty($('#input_child_member').val())

    var isValid = true;

    if ($('#child_non_member').is(':checked')) {
      if (firstName || midName || lastName) {
        isValid = false
        $('#child_info_error').text('Accomplish all fields')
      } else {
        $('#child_info_error').text('')
      }
    }

    if ($('#child_member').is(':checked')) {
      if (inputChild) {
        isValid = false
        $('#child_info_error').text('Accomplish all fields')
      } else {
        $('#child_info_error').text('')
      }
    }

    return isValid
  }

  $('#save_edit_parent_one').click(function() {

    const button = this

    $(button).prop('disabled', true)

    if (validateParent1()) {
      let memberId = currPerson.memberId
      let personId = currPerson.personId
      let newPersonInfo = $('#input_parent1_member').val().split(', ')

      const data = {
        isOldMember: memberId !== null && memberId !== '',
        person: getDetails($('#parent1_member'), null, $('#input_parent1_member'), $('#parent1_first_name'), $('#parent1_mid_name'), $('#parent1_last_name')),
        coupleId: $('#dedication_info').data('parentsid'),
        oldMemberId: memberId,
        oldPersonId: personId,
        isFirstGuardian: true
      }

      if (!data.person.isMember) {
        data.person.personId = newPersonInfo[1]
      }

      data.person = JSON.stringify(data.person)

      $.ajax({
        type: 'PUT',
        url: '/update_dedication/guardian',
        data: data,
        success: function (result) {
          if (result) {
            const personInfo = JSON.parse(data.person)
            let infoField = $('#parent1_info')
            let firstNameField = $('#parent1_first_name_view')
            let midNameField = $('#parent1_mid_name_view')
            let lastNameField = $('#parent1_last_name_view')
            if (personInfo.isMember) {
              $(infoField).data('member', personInfo.memberId)
              $(infoField).data('person', newPersonInfo[1])
              $(firstNameField).html(newPersonInfo[2])
              $(midNameField).html(newPersonInfo[3])
              $(lastNameField).html(newPersonInfo[4])
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
          } else {
            alert("SOMETHING WENT WRONG")
          }
          $('#editParentOne').modal('hide')
          $(button).prop('disabled', false)
        }
      })
    } else {
      $(button).prop('disabled', false)
    }
  })

  function validateParent1() {
    var firstName = validator.isEmpty($('#parent1_first_name').val())
    var midName = validator.isEmpty($('#parent1_mid_name').val())
    var lastName = validator.isEmpty($('#parent1_last_name').val())

    var inputParent = validator.isEmpty($('#input_parent1_member').val())

    var isValid = true;

    if ($('#parent1_non_member').is(':checked')) {
      if (firstName || midName || lastName) {
        isValid = false
        $('#parent1_info_error').text('Accomplish all fields')
      } else {
        $('#parent1_info_error').text('')
      }
    }

    if ($('#parent1_member').is(':checked')) {
      if (inputParent) {
        isValid = false
        $('#parent1_info_error').text('Accomplish all fields')
      } else {
        $('#parent1_info_error').text('')
      }
    }

    return isValid
  }


  $('#save_edit_parent_two').click(function() {

    const button = this

    $(button).prop('disabled', true)

    if (validateParent2()) {
      let memberId = currPerson.memberId
      let personId = currPerson.personId
      let newPersonInfo = $('#input_parent2_member').val().split(', ')

      const data = {
        isOldMember: memberId !== null && memberId !== '',
        person: getDetails($('#parent2_member'), $('#parent2_none'), $('#input_parent2_member'), $('#parent2_first_name'), $('#parent2_mid_name'), $('#parent2_last_name')),
        coupleId: $('#dedication_info').data('parentsid'),
        oldMemberId: memberId,
        oldPersonId: personId,
        isFirstGuardian: false
      }

      if (data.person !== null) {
        if (data.person.isMember) {
          data.person.personId = newPersonInfo[1]
        }
      }

      data.person = JSON.stringify(data.person)

      $.ajax({
        type: 'PUT',
        url: '/update_dedication/guardian',
        data: data,
        success: function (result) {
          if (result) {
            const personInfo = JSON.parse(data.person)
            let infoField = $('#parent2_info')
            let firstNameField = $('#parent2_first_name_view')
            let midNameField = $('#parent2_mid_name_view')
            let lastNameField = $('#parent2_last_name_view')
            if (personInfo === null) {
              $(infoField).data('member', null)
              $(infoField).data('person', null)
              $(firstNameField).text('N/A')
              $(midNameField).text('N/A')
              $(lastNameField).text('N/A')
            } else if (personInfo.isMember) {
              $(infoField).data('member', personInfo.memberId)
              $(infoField).data('person', newPersonInfo[1])
              $(firstNameField).html(newPersonInfo[2])
              $(midNameField).html(newPersonInfo[3])
              $(lastNameField).html(newPersonInfo[4])
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
          } else {
            alert("SOMETHING WENT WRONG")
          }
          $('#editParentTwo').modal('hide')
          $(button).prop('disabled', false)
        }
      })
    } else {
      $(button).prop('disabled', false)
    }
  })

  function validateParent2() {
    var firstName = validator.isEmpty($('#parent2_first_name').val())
    var midName = validator.isEmpty($('#parent2_mid_name').val())
    var lastName = validator.isEmpty($('#parent2_last_name').val())

    var inputParent = validator.isEmpty($('#input_parent2_member').val())

    var isValid = true;

    if ($('#parent2_non_member').is(':checked')) {
      if (firstName || midName || lastName) {
        isValid = false
        $('#parent2_info_error').text('Accomplish all fields')
      } else {
        $('#parent2_info_error').text('')
      }
    }

    if ($('#parent2_member').is(':checked')) {
      if (inputParent) {
        isValid = false
        $('#parent2_info_error').text('Accomplish all fields')
      } else {
        $('#parent2_info_error').text('')
      }
    }
    return isValid
  }

  function validateFields() {
    var isValid = true
    

    return isValid
  }

  // bind function to child non-member
  $('#child_non_member').change(function() {
    $('#child_member_div').hide()
    $('#child_non_member_div').show()

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#child_first_name').val('')
      $('#child_mid_name').val('')
      $('#child_last_name').val('')
    } else {
      $('#child_first_name').val(currPerson.firstName)
      $('#child_mid_name').val(currPerson.midName)
      $('#child_last_name').val(currPerson.lastName)
    }
  })

  // bind function to child member
  $('#child_member').change(function () {
    $('#child_member_div').show()
    $('#child_non_member_div').hide()
    
    let value = '0'

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      value = getValue(currPerson.memberId)
    }
    $(selectChild)[0].selectize.setValue(value)
  })

  $('#witness_gmother_non_member').change(function() {
    $('#witness_gmother_member_div').hide()
    $('#witness_gmother_non_member_div').show()

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#witness_gmother_first_name').val('')
      $('#witness_gmother_mid_name').val('')
      $('#witness_gmother_last_name').val('')
    } else {
      $('#witness_gmother_first_name').val(currPerson.firstName)
      $('#witness_gmother_mid_name').val(currPerson.midName)
      $('#witness_gmother_last_name').val(currPerson.lastName)
    }
  })

  // bind function to witness member
  $('#witness_gmother_member').change(function () {
    $('#witness_gmother_non_member_div').hide()
    $('#witness_gmother_member_div').show()

    let value = '0'

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      value = getValue(currPerson.memberId)
    }
    $(selectWitnessGMother)[0].selectize.setValue(value)
  })

  $('#witness_gfather_non_member').change(function() {
    $('#witness_gfather_member_div').hide()
    $('#witness_gfather_non_member_div').show()

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#witness_gfather_first_name').val('')
      $('#witness_gfather_mid_name').val('')
      $('#witness_gfather_last_name').val('')
    } else {
      $('#witness_gfather_first_name').val(currPerson.firstName)
      $('#witness_gfather_mid_name').val(currPerson.midName)
      $('#witness_gfather_last_name').val(currPerson.lastName)
    }
  })

  // bind function to witness member
  $('#witness_gfather_member').change(function () {
    $('#witness_gfather_non_member_div').hide()
    $('#witness_gfather_member_div').show()

    let value = '0'

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      value = getValue(currPerson.memberId)
    }
    $(selectWitnessGFather)[0].selectize.setValue(value)
  })

  // bind function to parent1 non member
  $('#parent1_non_member').change(function() {
    $('#parent1_member_div').hide()
    $('#parent1_non_member_div').show()

    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      $('#parent1_first_name').val('')
      $('#parent1_mid_name').val('')
      $('#parent1_last_name').val('')
    } else {
      $('#parent1_first_name').val(currPerson.firstName)
      $('#parent1_mid_name').val(currPerson.midName)
      $('#parent1_last_name').val(currPerson.lastName)
    }
  })

  // bind function to parent1 member
  $('#parent1_member').change(function () {
    $('#parent1_non_member_div').hide()
    $('#parent1_member_div').show()

    let value = '0'
    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      value = getValue(currPerson.memberId)
    }
    $(selectParent1)[0].selectize.setValue(value)
  })

  $('#parent2_non_member').change(function () {
    $('#parent2_member_div').hide()
    $('#parent2_non_member_div').show()

    if (currPerson.memberId !== null && currPerson.memberId !== '' ) {
      $('#parent2_first_name').val('')
      $('#parent2_mid_name').val('')
      $('#parent2_last_name').val('')
    } else if (currPerson.personId !== null && currPerson.personId !== ''){
      $('#parent2_first_name').val(currPerson.firstName)
      $('#parent2_mid_name').val(currPerson.midName)
      $('#parent2_last_name').val(currPerson.lastName)
    } else {
      $('#parent2_first_name').val('')
      $('#parent2_mid_name').val('')
      $('#parent2_last_name').val('')
    }
  })

  $('#parent2_member').change(function () {
    $('#parent2_non_member_div').hide()
    $('#parent2_member_div').show()

    let value = '0'
    if (currPerson.memberId !== null && currPerson.memberId !== '') {
      value = getValue(currPerson.memberId)
    }
    $(selectParent2)[0].selectize.setValue(value)
  })

  $('#parent2_none').change(function () {
    $('#parent2_non_member_div').hide()
    $('#parent2_member_div').hide()
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

  // $(document).on('click', '.delGMotherWitnessBtn', function () {
  //   const member = $(this).closest('.card').attr('data-member-info')
  //   if (member !== null) {
  //     selectizeEnable(member)
  //   }
  //   $(this).closest('.col-4').remove()
  //   GMotherWitnessCtr--
  // })

  // $(document).on('click', '.delGFatherWitnessBtn', function () {
  //   const member = $(this).closest('.card').attr('data-member-info')
  //   if (member !== null) {
  //     selectizeEnable(member)
  //   }
  //   $(this).closest('.col-4').remove()
  //   GFatherWitnessCtr--
  // })


  // $('.modal').on('hide.bs.modal', resetModal)

  // function resetModal() {

  //   if (isMaleModal) {
  //     var currWitness = $('#input_witness_gfather_member').val()
  //     $('#input_witness_gfather_member').data('previous', null)
  //     if (currWitness !== '' && !addedWitness) {
  //       selectizeEnable(currWitness)
  //     } else {
  //       addedWitness = false
  //     }
  //     $(selectWitnessGFather)[0].selectize.setValue('0')
  //   } else {
  //     var currWitness = $('#input_witness_gmother_member').val()
  //     $('#input_witness_gmother_member').data('previous', null)
  //     if (currWitness !== '' && !addedWitness) {
  //       selectizeEnable(currWitness)
  //     } else {
  //       addedWitness = false
  //     }
  //     $(selectWitnessGMother)[0].selectize.setValue('0')
  //   }
  // }

  /**
 * This function hides the selected choice for all select fields to avoid duplication of choices
 */
  function hideChoices() {
    var previous = $(this).data('previous')
    var currOption = $(this).val()
    selectizeDisable(currOption)
    $(this).data('previous', currOption)

    // if there was a previously selected choice, free up from other input fields
    if (previous !== null || previous !== undefined) {
      selectizeEnable(previous)
    }
  }

  function selectizeEnable(data) {
    $('#input_child_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_parent1_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_parent2_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_witness_gmother_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    $('#input_witness_gfather_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
  }

  function selectizeDisable(data) {
    $('#input_child_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_parent1_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_parent2_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_witness_gmother_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    $('#input_witness_gfather_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
  }

  function initSelectize() {
    $(selectChild)[0].selectize.refreshOptions()
    $(selectParent1)[0].selectize.refreshOptions()
    $(selectParent2)[0].selectize.refreshOptions()
    $(selectWitnessGMother)[0].selectize.refreshOptions()
    $(selectWitnessGFather)[0].selectize.refreshOptions()

    $('.selectize-dropdown').hide();
    $('.selectize-input').removeClass('focus input-active dropdown-active');
    $('div.selectize-input > input').blur();
  }
  
  // used to validate middle initial
  function validateMidInitial (mid) {
    const re = /^[A-Z]/
    return re.test(mid)
  }

  function initSelectizeOptions() {
    // get child
    selectizeDisable(getValue($('#child_info').data('member')))
    // get parent 1
    selectizeDisable(getValue($('#guardian1_info').data('member')))
    // get parent 2
    selectizeDisable(getValue($('#guardian2_info').data('member')))

    // get witnesses
    $('.witness').each(function () {
      selectizeDisable(getValue($(this).data('member')))
    })
  }

})
  
  
  