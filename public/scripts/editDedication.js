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

  initSelectize()
  initSelectizeOptions()
  
  $('select').change(hideChoices)

  // Show child modal
  $('#edit_child').click(function() {
    currPerson.memberId = $('#infant_info').data('member')
    currPerson.personId = $('#infant_info').data('person')
    currPerson.firstName = $('#infant_info').data('first-name')
    currPerson.midName = $('#infant_info').data('mid-name')
    currPerson.lastName = $('#infant_info').data('last-name')
    currPerson.doesExist = true

    if (currPerson.memberId !== null && currPerson.personId !== '') {
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
    currPerson.firstName = $('#parent1_info').data('first-name')
    currPerson.midName = $('#parent1_info').data('mid-name')
    currPerson.lastName = $('#parent1_info').data('last-name')
    currPerson.doesExist = true

    if (currPerson.memberId !== null && currPerson.personId !== '') {
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
    currPerson.firstName = $('#parent2_info').data('first-name')
    currPerson.midName = $('#parent2_info').data('mid-name')
    currPerson.lastName = $('#parent2_info').data('last-name')
    currPerson.doesExist = !(currPerson.firstName === '' || currPerson.firstName === null)

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
    var firstName = validator.isEmpty($('#child_first_name').val())
    var midName =  validator.isEmpty($('#child_mid_name').val())
    var lastName = validator.isEmpty($('#child_last_name').val())

    var inputChild = validator.isEmpty($('#input_child_member').val())

    var isValid = true;

    if($('#child_non_member').is(':checked')) {
      if(firstName || midName || lastName) {
        isValid = false
        $('#child_info_error').text('Accomplish all fields')
      } else {
        $('#child_info_error').text('')
      }
    }

    if($('#child_member').is(':checked')) {
      if(inputChild) {
        isValid = false
        $('#child_info_error').text('Accomplish all fields')
      } else {
        $('#child_info_error').text('')
      }
    }

    if(isValid) {
      submitChild()
    }
  })

  function submitChild () {
    alert('Add child')
  }  

  $('#save_edit_parent_one').click(function() {
    var firstName = validator.isEmpty($('#parent1_first_name').val())
    var midName =  validator.isEmpty($('#parent1_mid_name').val())
    var lastName = validator.isEmpty($('#parent1_last_name').val())

    var inputParent = validator.isEmpty($('#input_parent1_member').val())

    var isValid = true;

    if($('#parent1_non_member').is(':checked')) {
      if(firstName || midName || lastName) {
        isValid = false
        $('#parent1_info_error').text('Accomplish all fields')
      } else {
        $('#parent1_info_error').text('')
      }
    }

    if($('#parent1_member').is(':checked')) {
      if(inputParent) {
        isValid = false
        $('#parent1_info_error').text('Accomplish all fields')
      } else {
        $('#parent1_info_error').text('')
      }
    }

    if(isValid) {
      submitParentOne()
    }
  })

  function submitParentOne () {
    alert('Add parent one')
  }  

  $('#save_edit_parent_two').click(function() {
    var firstName = validator.isEmpty($('#parent2_first_name').val())
    var midName =  validator.isEmpty($('#parent2_mid_name').val())
    var lastName = validator.isEmpty($('#parent2_last_name').val())

    var inputParent = validator.isEmpty($('#input_parent2_member').val())

    var isValid = true;

    if($('#parent2_non_member').is(':checked')) {
      if(firstName || midName || lastName) {
        isValid = false
        $('#parent2_info_error').text('Accomplish all fields')
      } else {
        $('#parent2_info_error').text('')
      }
    }

    if($('#parent2_member').is(':checked')) {
      if(inputParent) {
        isValid = false
        $('#parent2_info_error').text('Accomplish all fields')
      } else {
        $('#parent2_info_error').text('')
      }
    }

    if(isValid) {
      submitParentTwo()
    }
  })

  function submitParentTwo () {
    alert('Add parent Two')
  }  

  function validateFields() {
    var isValid = true
    

    return isValid
  }

  // bind function to child non-member
  $('#child_non_member').change(function() {
    $(this).attr('disabled', true)
    $('#child_member').removeAttr('disabled')
    $('#child_member').prop('checked', false)
    $('#child_member_div').hide()
    $('#child_non_member_div').show()

    selectizeEnable($('#input_child_member').val())
    $(selectChild)[0].selectize.setValue('0')
  })

  // bind function to child member
  $('#child_member').change(function () {
    $(this).attr('disabled', true)
    $('#child_non_member').removeAttr('disabled')
    $('#child_non_member').prop('checked', false)
    $('#child_member_div').show()
    $('#child_non_member_div').hide()
    $('#child_first_name').val('')
    $('#child_mid_name').val('')
    $('#child_last_name').val('')
  })

  $('#witness_gmother_non_member').change(function() {
    $(this).attr('disabled', true)
    $('#witness_gmother_member').removeAttr('disabled')
    $('#witness_gmother_member').prop('checked', false)
    $('#witness_gmother_member_div').hide()
    $('#witness_gmother_non_member_div').show()
    selectizeEnable($('#input_witness_gmother_member').val())
    $(selectWitnessGMother)[0].selectize.setValue('0')
  })

  // bind function to witness member
  $('#witness_gmother_member').change(function () {
    $(this).attr('disabled', true)
    $('#witness_gmother_non_member').removeAttr('disabled')
    $('#witness_gmother_non_member').prop('checked', false)
    $('#witness_gmother_non_member_div').hide()
    $('#witness_gmother_member_div').show()
    $('#witness_gmother_first_name').val('')
    $('#witness_gmother_mid_name').val('')
    $('#witness_gmother_last_name').val('')
  })

  $('#witness_gfather_non_member').change(function() {
    $(this).attr('disabled', true)
    $('#witness_gfather_member').removeAttr('disabled')
    $('#witness_gfather_member').prop('checked', false)
    $('#witness_gfather_member_div').hide()
    $('#witness_gfather_non_member_div').show()
    selectizeEnable($('#input_witness_gfather_member').val())
    $(selectWitnessGFather)[0].selectize.setValue('0')
  })

  // bind function to witness member
  $('#witness_gfather_member').change(function () {
    $(this).attr('disabled', true)
    $('#witness_gfather_non_member').removeAttr('disabled')
    $('#witness_gfather_non_member').prop('checked', false)
    $('#witness_gfather_non_member_div').hide()
    $('#witness_gfather_member_div').show()
    $('#witness_gfather_first_name').val('')
    $('#witness_gfather_mid_name').val('')
    $('#witness_gfather_last_name').val('')
  })

  // bind function to parent1 non member
  $('#parent1_non_member').change(function() {
    $(this).attr('disabled', true)
    $('#parent1_member').removeAttr('disabled')
    $('#parent1_member').prop('checked', false)
    $('#parent1_member_div').hide()
    $('#parent1_non_member_div').show()
    selectizeEnable($('#input_parent1_member').val())
    $(selectParent1)[0].selectize.setValue('0')
  })

  // bind function to parent1 member
  $('#parent1_member').change(function () {
    $('#parent1_non_member').removeAttr('disabled')
    $('#parent1_non_member').prop('checked', false)
    $('#parent1_non_member_div').hide()
    $('#parent1_member_div').show()
    $('#parent1_first_name').val('')
    $('#parent1_mid_name').val('')
    $('#parent1_last_name').val('')
  })

  $('#parent2_non_member').change(function () {
    $(this).attr('disabled', true)
    $('#parent2_member').removeAttr('disabled')
    $('#parent2_member').prop('checked', false)
    $('#parent2_member_div').hide()
    $('#parent2_non_member_div').show()

    selectizeEnable($('#input_parent2_member').val())
    $(selectParent2)[0].selectize.setValue('0')

    $('#parent2_none').removeAttr('disabled')
    $('#parent2_none').prop('checked', false)
  })

  $('#parent2_member').change(function () {
    $('#parent2_non_member_div').hide()
    $('#parent2_member_div').show()

  })

  $('#parent2_none').change(function () {
    $(this).attr('disabled', true)
    $('#parent2_non_member').removeAttr('disabled')
    $('#parent2_member').removeAttr('disabled')

    $('#parent2_non_member').prop('checked', false)
    $('#parent2_member').prop('checked', false)

    $('#parent2_non_member_div').hide()
    $('#parent2_member_div').hide()

    $('#parent2_first_name').val('')
    $('#parent2_mid_name').val('')
    $('#parent2_last_name').val('')

    selectizeEnable($('#input_parent2_member').val())
    $(selectParent2)[0].selectize.setValue('0')
    $('#parent2_info_error').text('')
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
        $('#gmother_witness_row').append("<div class='col-4' style='margin-bottom: 1em;'><div class='card witness' data-member-info=\"" + witness_info + "\"><div class='card-body'><p class='card-text'>" + witnessName + "</p><button type='button' class='fas fa-trash delGMotherWitnessBtn '></button> </div></div></div>")
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
  
  
  