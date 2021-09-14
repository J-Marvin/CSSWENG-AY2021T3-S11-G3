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

  initDate()
  initSelectize()
  
  $('select').change(hideChoices)

  // bind function to child non-member
  $('#child_non_member').change(function() {
    $('#child_member').prop('checked', false)
    $('#child_member_div').hide()
    $('#child_non_member_div').show()

    selectizeEnable($('#input_child_member').val())
    $(selectChild)[0].selectize.setValue('0')
  })

  // bind function to child member
  $('#child_member').change(function () {
    $('#child_non_member').prop('checked', false)
    $('#child_member_div').show()
    $('#child_non_member_div').hide()
    $('#child_first_name').val('')
    $('#child_mid_name').val('')
    $('#child_last_name').val('')
  })

  $('#witness_gmother_non_member').change(function() {
    $('#witness_gmother_member').prop('checked', false)
    $('#witness_gmother_member_div').hide()
    $('#witness_gmother_non_member_div').show()
    selectizeEnable($('#input_witness_gmother_member').val())
    $(selectWitnessGMother)[0].selectize.setValue('0')
  })

  // bind function to witness member
  $('#witness_gmother_member').change(function () {
    $('#witness_gmother_non_member').prop('checked', false)
    $('#witness_gmother_non_member_div').hide()
    $('#witness_gmother_member_div').show()
    $('#witness_gmother_first_name').val('')
    $('#witness_gmother_mid_name').val('')
    $('#witness_gmother_last_name').val('')
  })

  $('#witness_gfather_non_member').change(function() {
    $('#witness_gfather_member').prop('checked', false)
    $('#witness_gfather_member_div').hide()
    $('#witness_gfather_non_member_div').show()
    selectizeEnable($('#input_witness_gfather_member').val())
    $(selectWitnessGFather)[0].selectize.setValue('0')
  })

  // bind function to witness member
  $('#witness_gfather_member').change(function () {
    $('#witness_gfather_non_member').prop('checked', false)
    $('#witness_gfather_non_member_div').hide()
    $('#witness_gfather_member_div').show()
    $('#witness_gfather_first_name').val('')
    $('#witness_gfather_mid_name').val('')
    $('#witness_gfather_last_name').val('')
  })

  // bind function to parent1 non member
  $('#parent1_non_member').change(function() {
    $('#parent1_member').prop('checked', false)
    $('#parent1_member_div').hide()
    $('#parent1_non_member_div').show()
    selectizeEnable($('#input_parent1_member').val())
    $(selectParent1)[0].selectize.setValue('0')
  })

  // bind function to parent1 member
  $('#parent1_member').change(function () {
    $('#parent1_non_member').prop('checked', false)
    $('#parent1_non_member_div').hide()
    $('#parent1_member_div').show()
    $('#parent1_first_name').val('')
    $('#parent1_mid_name').val('')
    $('#parent1_last_name').val('')
  })

  $('#parent2_non_member').change(function () {
    $('#parent2_member').prop('checked', false)
    $('#parent2_member_div').hide()
    $('#parent2_non_member_div').show()

    selectizeEnable($('#input_parent2_member').val())
    $(selectParent2)[0].selectize.setValue('0')

    $('#parent2_none').prop('checked', false)
  })

  $('#parent2_member').change(function () {
    $('#parent2_non_member').prop('checked', false)
    $('#parent2_non_member_div').hide()
    $('#parent2_member_div').show()
    $('#parent2_first_name').val('')
    $('#parent2_mid_name').val('')
    $('#parent2_last_name').val('')

    $('#parent2_none').prop('checked', false)
  })

  $('#parent2_none').change(function () {
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

  $('#create-dedication').click(function (){

    $('#create-dedication').prop('disabled', true)
    if(validateFields()) {
      const data = {
        child: {},
        guardian1: {},
        guardian2: {}
      }
  
      data.child = JSON.stringify(getDetails($('#child_member'), $('#input_child_member'), $('#child_first_name'), $('#child_mid_name'), $('#child_last_name')))
      data.guardian1 = JSON.stringify(getDetails($('#parent1_member'), $('#input_parent1_member'), $('#parent1_first_name'), $('#parent1_mid_name'), $('#parent1_last_name')))

      if ($('#parent2_none').is(':checked')){
        data.guardian2 = null
      } else {
        data.guardian2 = JSON.stringify(getDetails($('#parent2_member'), $('#input_parent2_member'), $('#parent2_first_name'), $('#parent2_mid_name'), $('#parent2_last_name')))
      }

      data.officiant = $('#officiant').val()
      data.place = $('#address').val()
      data.witnessMale = []
      data.witnessFemale = []
      data.date = new Date($('#date').val()).toISOString()

      const witnesses = $('.witness')
      for (witness of witnesses) {
        const currWitness = {}
        const isMale = $(witness).hasClass('male')
        currWitness.type = isMale ? 'Godfather' : 'Godmother'

        if($(witness).attr('data-member-info') !== null && $(witness).attr('data-member-info') !== undefined) {
          currWitness.person_id = $(witness).attr('data-member-info').split(', ')[1]
          currWitness.isMember = true
        } else {
          currWitness.first_name = $(witness).find('.first_name').text()
          currWitness.mid_name = $(witness).find('.mid_name').text()
          currWitness.last_name = $(witness).find('.last_name').text()
        }

        if (isMale) {
          data.witnessMale.push(currWitness)
        } else {
          data.witnessFemale.push(currWitness)
        }
      }
      
      data.witnessMale = JSON.stringify(data.witnessMale)
      data.witnessFemale = JSON.stringify(data.witnessFemale)

      $.ajax({
        type: 'POST',
        data: data,
        url: '/add_dedication',
        success: function (result){
          if (result) {
            location.href = '/view_dedication/' + result
          } else {
            $('#create-dedication').prop('disabled', false)
            alert('An error occured')
          }
        }
      })

    } else {
      $('#create-dedication').prop('disabled', false)
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

  $('.modal').on('hide.bs.modal', resetModal)
  

  /**
   * 
   * @param {jQuery Object} memberBox the member checkfield
   * @param {jQuery Object} selectField the select field
   * @param {jQuery Object} firstNameField the first name field
   * @param {jQuery Object} midNameField the middle name field
   * @param {jQuery Object} lastNameField  the last name field
   * @returns 
   */
  function getDetails(memberBox, selectField, firstNameField, midNameField, lastNameField) {
    const person = {}

    person.isMember = $(memberBox).is(':checked')

    if (person.isMember) {
      const info = $(selectField).find(':selected').val().split(', ')
      person.person_id = info[1]
      person.member_id = info[0]
    } else {
      person.first_name = $(firstNameField).val()
      person.mid_name = $(midNameField).val()
      person.last_name = $(lastNameField).val()
    }
    return person
  }

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

  function resetModal() {

    if (isMaleModal) {
      var currWitness = $('#input_witness_gfather_member').val()
      $('#input_witness_gfather_member').data('previous', null)
      if (currWitness !== '' && !addedWitness) {
        selectizeEnable(currWitness)
      } else {
        addedWitness = false
      }
      $(selectWitnessGFather)[0].selectize.setValue('0')
    } else {
      var currWitness = $('#input_witness_gmother_member').val()
      $('#input_witness_gmother_member').data('previous', null)
      if (currWitness !== '' && !addedWitness) {
        selectizeEnable(currWitness)
      } else {
        addedWitness = false
      }
      $(selectWitnessGMother)[0].selectize.setValue('0')
    }
  }

  function validateFields() {
    var isValid = true
    
    var childNonMember = $('#child_non_member').is(':checked')
    var childFieldMember = $('#input_child_member').val() === '0' || $('#input_child_member').val() === ''
    var childFieldNonMember = $('#child_first_name').val() === '' || $('#child_mid_name').val() === '' || $('#child_last_name').val() === ''
    var childMiddleLen = $('#child_mid_name').val().length === 1
    //alert(childFieldNonMember + ' ' + childFieldMember )
  
    var guardianOneMember = $('#input_parent1_member').val() === '0' || $('#input_parent1_member').val() === ''
    var guardianOneNonMember = $('#parent1_first_name').val() === '' || $('#parent1_mid_name').val() === '' || $('#parent1_last_name').val() === ''
    var guardianOneMiddleLen = $('#parent1_mid_name').val().length === 1

    var guardianTwoNone = $('#parent2_none').is(':checked')
    var guardianTwoMember = $('#input_parent2_member').val() === '0' || $('#input_parent2_member').val() === ''
    var guardianTwoNonMember = $('#parent2_first_name').val() === '' || $('#parent2_mid_name').val() === '' || $('#parent2_last_name').val() === ''
    var guardianTwoMiddleLen = $('#parent2_mid_name').val().length === 1

    var officiantField = $('#officiant').val() === ''
    var addressField = $('#address').val() === ''
    var dateField = $('#date').val() === ''
  
  
    if ((childNonMember && childFieldNonMember) || (!childNonMember && childFieldMember)) {
      isValid = false
      $('#child_info_error').text('Please provide child name')
    } else {
      $('#child_info_error').text('')
    }

    if (!childFieldNonMember && !childMiddleLen) {
      isValid = false
      $('#child_middle_len_error').text("Child's middle initial should only contain 1 letter")
    } else {
      $('#child_middle_len_error').text('')
    }

    if (childFieldNonMember === false && validateMidInitial($('#child_mid_name').val()) === false) {
      isValid = false
      $('#child_middle_error').text("Child's middle initial should only range from letters A-Z")
    } else {
      $('#child_middle_error').text('')
    }
  
    if (guardianTwoNone && guardianOneMember && guardianOneNonMember) {
      isValid = false
      $('#parent1_info_error').text('Accomplish all fields')
      $('#parent2_info_error').text('')
    } else if (!guardianTwoNone) {
      if (guardianOneMember && guardianOneNonMember) {
        isValid = false
        $('#parent1_info_error').text('Accomplish all fields')
      } else {
        $('#parent1_info_error').text('')
      }
      // middle initial should only be 1 letter
      if (!guardianOneNonMember && !guardianOneMiddleLen) {
        isValid = false
        $('#parent1_middle_len_error').text('Middle Initial should only contain 1 letter')
      } else {
        $('#parent1_middle_len_error').text('')
      }

      // middle initial checking for A-Z
      if (guardianOneNonMember === false && validateMidInitial($('#parent1_mid_name').val()) === false) {
        isValid = false
        $('#parent1_middle_error').text('Middle Initial should only range from letters A-Z')
      } else {
        $('#parent1_middle_error').text('')
      }

      if (guardianTwoMember && guardianTwoNonMember) {
        isValid = false
        $('#parent2_info_error').text('Accomplish all fields')
      } else {
        $('#parent2_info_error').text('')
      }

      // middle initial should only be 1 letter
      if (!guardianTwoNonMember && !guardianTwoMiddleLen) {
        isValid = false
        $('#parent2_middle_len_error').text('Middle Initial should only contain 1 letter')
      } else {
        $('#parent2_middle_len_error').text('')
      }

      // middle initial checking for A-Z
      if (guardianTwoNonMember === false && validateMidInitial($('#parent2_mid_name').val()) === false) {
        isValid = false
        $('#parent2_middle_error').text('Middle Initial should only range from letters A-Z')
      } else {
        $('#parent2_middle_error').text('')
      }
    } else if (guardianTwoNone) { // if checked
      if (guardianOneMember && guardianOneNonMember) {
        isValid = false
        $('#parent1_info_error').text('Accomplish all fields')
      } else {
        $('#parent1_info_error').text('')
      }
      // middle initial should only be 1 letter
      if (!guardianOneNonMember && !guardianOneMiddleLen) {
        isValid = false
        $('#parent1_middle_len_error').text('Middle Initial should only contain 1 letter')
      } else {
        $('#parent1_middle_len_error').text('')
      }

      // middle initial checking for A-Z
      if (guardianOneNonMember === false && validateMidInitial($('#parent1_mid_name').val()) === false) {
        isValid = false
        $('#parent1_middle_error').text('Middle Initial should only range from letters A-Z')
      } else {
        $('#parent1_middle_error').text('')
      }
    } else {
  
      $('#parent1_info_error').text('')
      $('#parent2_info_error').text('')
    }
  
    if (officiantField) {
      isValid = false
      $('#officiant_info_error').text('Please accomplish')
    } else {
  
      $('#officiant_info_error').text('')
    }
  
    if (addressField) {
      isValid = false
      $('#address_info_error').text('Please accomplish')
    } else {
  
      $('#address_info_error').text('')
    }
  
    if (dateField) {
      isValid = false
      $('#date_info_error').text('Please accomplish')
    } else {
      $('#date_info_error').text('')
    }
  
    if (GMotherWitnessCtr === 0 && GFatherWitnessCtr === 0) {
      isValid = false
      $('#witness_gmother_info_error').text('There must be at least one godmother or godfather')
      $('#witness_gfather_info_error').text('There must be at least one godmother or godfather')
    } else {
      $('#witness_gmother_info_error').text('')
      $('#witness_gfather_info_error').text('')
    }
  
    return isValid
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

  function initDate() {
    const today = new Date()

    $('#date').val(today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate())
  }
  
  // used to validate middle initial
  function validateMidInitial (mid) {
    const re = /^[A-Z]/
    return re.test(mid)
  }
})


