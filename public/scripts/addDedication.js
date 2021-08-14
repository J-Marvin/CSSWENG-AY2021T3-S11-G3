$(document).ready(function() {

  var witnessCtr = 0

  $('select').change(hideChoices)

  // bind function to child non-member
  $('#child_non_member').change(function() {
    $(this).attr('disabled', true)
    $('#child_member').removeAttr('disabled')
    $('#child_member').prop('checked', false)
    $('#child_member_div').hide()
    $('#child_non_member_div').show()
    $('select').find('option[value="' + $('#input_child_member').val() + '"]').removeAttr('hidden')
    $('#input_child_member').val(0)
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

  $('#witness_non_member').change(function() {
    $(this).attr('disabled', true)
    $('#witness_member').removeAttr('disabled')
    $('#witness_member').prop('checked', false)
    $('#witness_member_div').hide()
    $('#witness_non_member_div').show()
    $('select').find('option[value="' + $('#input_witness_member').val() + '"]').removeAttr('hidden')
    $('#input_witness_member').val(0)
  })

  // bind function to witness member
  $('#witness_member').change(function () {
    $(this).attr('disabled', true)
    $('#witness_non_member').removeAttr('disabled')
    $('#witness_non_member').prop('checked', false)
    $('#witness_non_member_div').hide()
    $('#witness_member_div').show()
    $('#witness_first_name').val('')
    $('#witness_mid_name').val('')
    $('#witness_last_name').val('')
  })

  // bind function to parent1 non member
  $('#parent1_non_member').change(function() {
    $(this).attr('disabled', true)
    $('#parent1_member').removeAttr('disabled')
    $('#parent1_member').prop('checked', false)
    $('#parent1_member_div').hide()
    $('#parent1_non_member_div').show()
    $('select').find('option[value="' + $('#input_parent1_member').val() + '"]').removeAttr('hidden')
    $('#input_parent1_member').val(0)
  })

  // bind function to parent1 member
  $('#parent1_member').change(function () {
    $(this).attr('disabled', true)
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
    $('select').find('option[value="' + $('#input_parent2_member').val() + '"]').removeAttr('hidden')
    $('#input_parent2_member').val(0)

    $('#parent2_none').removeAttr('disabled')
    $('#parent2_none').prop('checked', false)
  })

  $('#parent2_member').change(function () {
    $(this).attr('disabled', true)
    $('#parent2_non_member').removeAttr('disabled')
    $('#parent2_non_member').prop('checked', false)
    $('#parent2_non_member_div').hide()
    $('#parent2_member_div').show()
    $('#parent2_first_name').val('')
    $('#parent2_mid_name').val('')
    $('#parent2_last_name').val('')

    $('#parent2_none').removeAttr('disabled')
    $('#parent2_none').prop('checked', false)
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

    $('#input_parent2_member').val(0)
    $('#parent2_info_error').text('')
  })

  $('#create-dedication').click(function (){
    // valdiation first 

    var isValid = true

    var childFieldMember = $('#input_child_member').val() === null
    var childFieldNonMember = $('#child_first_name').val() === '' || $('#child_mid_name').val() === '' || $('#child_last_name').val() === ''
    //alert(childFieldNonMember + ' ' + childFieldMember )

    var guardianOneMember = $('#input_parent1_member').val() === null
    var guardianOneNonMember = $('#parent1_first_name').val() === '' || $('#parent1_mid_name').val() === '' || $('#parent1_last_name').val() === ''

    var guardianTwoNone = $('#parent2_none').is(':checked')
    var guardianTwoMember = $('#input_parent2_member').val() === null
    var guardianTwoNonMember = $('#parent2_first_name').val() === '' || $('#parent2_mid_name').val() === '' || $('#parent2_last_name').val() === ''

    var officiantField = $('#officiant').val() === ''
    var addressField = $('#address').val() === ''
    var dateField = $('#date').val() === ''


    if(childFieldMember && childFieldNonMember) {
      isValid = false
      $('#child_info_error').text('Please provide child name')
    } else {
      
      $('#child_info_error').text('')
    }

    if(guardianTwoNone && guardianOneMember && guardianOneNonMember) {
      isValid = false
      $('#parent1_info_error').text('Accomplish all fields')
      $('#parent2_info_error').text('')
    } else if(!guardianTwoNone) {
      isValid = false
      if(guardianOneMember && guardianOneNonMember) {
        $('#parent1_info_error').text('Accomplish all fields')
      } else {
        $('#parent1_info_error').text('')
      }
      if(guardianTwoMember && guardianTwoNonMember) {
        $('#parent2_info_error').text('Accomplish all fields')
      } else {
        $('#parent2_info_error').text('')
      }
    } else {
      
      $('#parent1_info_error').text('')
      $('#parent2_info_error').text('')
    }

    if(officiantField) {
      isValid = false
      $('#officiant_info_error').text('Please accomplish')
    } else {
      
      $('#officiant_info_error').text('')
    }

    if(addressField) {
      isValid = false
      $('#address_info_error').text('Please accomplish')
    } else {
      
      $('#address_info_error').text('')
    }

    if(dateField) {
      isValid = false
      $('#date_info_error').text('Please accomplish')
    } else {
      $('#date_info_error').text('')
    }

    if(witnessCtr === 0) {
      isValid = false
      $('#witness_info_error').text('There must be at least one witness')
    } else {
      $('#witness_info_error').text('')
    }

    if(isValid) {
      const data = {
        child: {},
        guardian1: {},
        guardian2: {}
      }
  
      data.child = JSON.stringify(getDetails($('#child_member'), $('#input_child_member'), $('#child_first_name'), $('#child_mid_name'), $('#child_last_name')))
      data.guardian1 = JSON.stringify(getDetails($('#parent1_member'), $('#input_parent1_member'), $('#parent1_first_name'), $('#parent1_mid_name'), $('#parent1_last_name')))
      data.guardian2 = JSON.stringify(getDetails($('#parent2_member'), $('#input_parent2_member'), $('#parent2_first_name'), $('#parent2_mid_name'), $('#parent2_last_name')))
  
      $.ajax({
        type: 'POST',
        data: data,
        url: '/add_dedication',
        success: function (result){
          
        }
      })
  
      console.log(data)
    }
  })

  $('#add_witness').click(function (){
    var isValid = true

    var witnessMember = $('#input_witness_member').val() === null
    var witnessNonMember = $('#witness_first_name').val() === '' || $('#witness_mid_name').val() === '' || $('#witness_last_name').val() === ''

    if (witnessMember && witnessNonMember) {
      isValid = false
      $('#witness_modal_info_error').text('Please accomplish all fields')
    } else {
      $('#witness_modal_info_error').text('')
    }

    if(isValid) {
      $('#witnessModal').modal('toggle');
      var witnessName
      if(witnessMember) {
        witnessName = $('#witness_first_name').val() + ' ' + $('#witness_mid_name').val() + ' ' + $('#witness_last_name').val()
        $('#witness_row').append("<div class='col-4' style='margin-bottom: 1em;'><div class='card'><div class='card-body'><p class='card-text'>" + witnessName + "</p><button type='button' class='fas fa-trash delWitnessBtn '></button></div></div></div>")
      } else {
        witnessName = $('#input_witness_member').val()
        witnessName = witnessName.replace(/\d+/g, '')
        witnessName = witnessName.replace(/,/g, '')
        $('#witness_row').append("<div class='col-4' style='margin-bottom: 1em;'><div class='card'><div class='card-body'><p class='card-text'>" + witnessName + "</p><button type='button' class='fas fa-trash delWitnessBtn '></button> </div></div></div>")
      }
      $('#witness_info_error').text('')
      $('#witness_first_name').val('')
      $('#witness_mid_name').val('')
      $('#witness_last_name').val('')
      witnessCtr++;
    }
  })

  $('#add_witness_button').click(function() {
    if(witnessCtr === 12) {
      $('#witness_info_error').text('You have reached the maximum number of witnesses')
    } else {
      $('#witnessModal').modal('show')
      $('#witness_info_error').text('')
    }
  })

  $(document).on('click', '.delWitnessBtn', function () {
    $(this).closest('.col-4').remove()
    witnessCtr--
  })
  

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
    $('select').find('option[value="' + $(this).val() + '"]').attr('hidden', true)

    $(this).data('previous', $(this).val())

    // if there was a previously selected choice, free up from other input fields
    if (previous !== null || previous !== undefined) {
      $('select').find('option[value="' + previous + '"]').removeAttr('hidden')
    }
  }
})