function display_div_bride (status) {
    if(status === "bride_non_member") {
      document.getElementById("bride_member_div").style.display = "none"
      
    }
    else {
      document.getElementById("bride_non_member_div").style.display = "none"
    }
    document.getElementById(status + "_div").style.display = "block"
  }

function display_div_groom (status) {
    if(status === "groom_non_member") {
      document.getElementById("groom_member_div").style.display = "none"
    }
    else {
      document.getElementById("groom_non_member_div").style.display = "none"
      document.getElementById("groom_non_member").checked = false
    }
    document.getElementById(status + "_div").style.display = "block"
  }

function display_div_bride_mother (status) {
    if(status === "bride_mother_non_member") {
      document.getElementById("bride_mother_member_div").style.display = "none"
      document.getElementById(status + "_div").style.display = "block"
    }
    else if(status === "bride_mother_member") {
      document.getElementById("bride_mother_non_member_div").style.display = "none"
      document.getElementById(status + "_div").style.display = "block"
    }
    else {
      document.getElementById("bride_mother_member_div").style.display = "none"
      document.getElementById("bride_mother_non_member_div").style.display = "none"
      document.getElementById("bride_mother_info_error").innerHTML = ""
    }
  }

  function display_div_bride_father (status) {
    if(status === "bride_father_non_member") {
      document.getElementById("bride_father_member_div").style.display = "none"
      document.getElementById(status + "_div").style.display = "block"
    }
    else if(status === "bride_father_member") {
      document.getElementById("bride_father_non_member_div").style.display = "none"
      $("#prenup_form").attr('action', '/create_prenup_member')
      document.getElementById(status + "_div").style.display = "block"
    }
    else {
      document.getElementById("bride_father_non_member_div").style.display = "none"
      document.getElementById("bride_father_member_div").style.display = "none"
      document.getElementById("bride_father_info_error").innerHTML = ""
    }
  }

  function display_div_groom_mother (status) {
    if(status === "groom_mother_non_member") {
      document.getElementById("groom_mother_member_div").style.display = "none"
      document.getElementById(status + "_div").style.display = "block"
    }
    else if(status === "groom_mother_member") {
      document.getElementById("groom_mother_non_member_div").style.display = "none"
      document.getElementById(status + "_div").style.display = "block"
    }
    else {
      document.getElementById("groom_mother_non_member_div").style.display = "none"
      document.getElementById("groom_mother_member_div").style.display = "none"
      document.getElementById("groom_mother_info_error").innerHTML = ""
    }
  }

  function display_div_groom_father (status) {
    if(status === "groom_father_non_member") {
      document.getElementById("groom_father_member_div").style.display = "none"
      document.getElementById(status + "_div").style.display = "block"
    }
    else if(status === "groom_father_member") {
      document.getElementById("groom_father_non_member_div").style.display = "none"
      document.getElementById(status + "_div").style.display = "block"
    }
    else {
      document.getElementById("groom_father_non_member").checked = false
      document.getElementById("groom_father_non_member_div").style.display = "none"
      document.getElementById("groom_father_member_div").style.display = "none"
      document.getElementById("groom_father_info_error").innerHTML = ""
    }
  }


$(document).ready(function() {

    var GMotherWitnessCtr = 0
    var GFatherWitnessCtr = 0
    var addedWitness = false

    const selectBride = $('#input_bride_member').selectize()
    const selectGroom = $('#input_groom_member').selectize()
    const selectBrideMother = $('#input_bride_mother_member').selectize()
    const selectBrideFather = $('#input_bride_father_member').selectize()
    const selectGroomMother = $('#input_groom_mother_member').selectize()
    const selectGroomFather = $('#input_groom_father_member').selectize()
    const selectGodMother = $('#input_witness_gmother_member').selectize()
    const selectGodFather = $('#input_witness_gfather_member').selectize()

    initSelectize()
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
      
      $(selectBride)[0].selectize.refreshOptions()
      $(selectGroom)[0].selectize.refreshOptions()
      $(selectBrideMother)[0].selectize.refreshOptions()
      $(selectBrideFather)[0].selectize.refreshOptions()
      $(selectGroomMother)[0].selectize.refreshOptions()
      $(selectGroomFather)[0].selectize.refreshOptions()
      $(selectGodMother)[0].selectize.refreshOptions()
      $(selectGodFather)[0].selectize.refreshOptions()
  
      $('.selectize-dropdown').hide();
      $('.selectize-input').removeClass('focus input-active dropdown-active');
      $('div.selectize-input > input').blur();
    }

    function selectizeEnable(data) {
      $('#input_bride_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
      $('#input_groom_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
      $('#input_bride_mother_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
      $('#input_bride_father_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
      $('#input_groom_mother_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
      $('#input_groom_father_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
      $('#input_witness_gmother_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
      $('#input_witness_gfather_member').parent().find('.option[data-value="' + data + '"]').attr('data-selectable', true)
    }
  
    function selectizeDisable(data) {
      $('#input_bride_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
      $('#input_groom_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
      $('#input_bride_mother_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
      $('#input_bride_father_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
      $('#input_groom_mother_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
      $('#input_groom_father_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
      $('#input_witness_gmother_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
      $('#input_witness_gfather_member').parent().find('.option[data-value="' + data + '"]').removeAttr('data-selectable')
    }

    $('#create-wedding-registry').click(function (){

      $('#create-wedding-registry').prop('disabled', true)
      if(validateFields()) {
        const data = {}
        data.witnessMale = []
        data.witnessFemale = []

        const witnesses = $('.witness')
        for (witness of witnesses) {
          const currWitness = {}
          const isMale = $(witness).hasClass('male')
          currWitness.type = isMale ? 'Godfather' : 'Godmother'

          if ($(witness).attr('data-member-info') !== null && $(witness).attr('data-member-info') !== undefined) {
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

        data.officiant = $('#officiant').val()
        data.solemnizer = $('#solemnizer').val()
        data.location = $('#location').val()
        data.contract = $('#contract').val()
        data.weddingDate = new Date($('#current_date').val()).toISOString()
        data.date = new Date().toISOString()

        data.bride = JSON.stringify(getDetails(
          $('#bride_member'),
          null,
          $('#input_bride_member'),
          $('#bride_first_name'),
          $('#bride_mid_name'),
          $('#bride_last_name')
          ))

        data.groom = JSON.stringify(getDetails(
          $('#groom_member'),
          null,
          $('#input_groom_member'),
          $('#groom_first_name'),
          $('#groom_mid_name'),
          $('#groom_last_name')
        ))

        data.brideMother = JSON.stringify(getDetails(
          $('#bride_mother_member'),
          $('#bride_mother_none'),
          $('#input_bride_mother_member'),
          $('#bride_mother_first_name'),
          $('#bride_mother_mid_name'),
          $('#bride_mother_last_name')
        ))

        data.brideFather = JSON.stringify(getDetails(
          $('#bride_father_member'),
          $('#bride_father_none'),
          $('#input_bride_father_member'),
          $('#bride_father_first_name'),
          $('#bride_father_mid_name'),
          $('#bride_father_last_name')
        ))

        data.groomMother = JSON.stringify(getDetails(
          $('#groom_mother_member'),
          $('#groom_mother_none'),
          $('#input_groom_mother_member'),
          $('#groom_mother_first_name'),
          $('#groom_mother_mid_name'),
          $('#groom_mother_last_name')
        ))

        data.groomFather = JSON.stringify(getDetails(
          $('#groom_father_member'),
          $('#groom_father_none'),
          $('#input_groom_father_member'),
          $('#groom_father_first_name'),
          $('#groom_father_mid_name'),
          $('#groom_father_last_name')
        ))


        data.witnessMale = JSON.stringify(data.witnessMale)
        data.witnessFemale = JSON.stringify(data.witnessFemale)

        $.ajax({
          type: 'POST',
          data: data,
          url: '/add_wedding_reg',
          success: function (result) {
            if (result) {
              location.href = '/view_wedding/' + result
            } else {
              $('#create-dedication').prop('disabled', false)
              alert('An error occured')
            }
          }
        })
      } else {
        $('#create-wedding-registry').prop('disabled', false)
      }
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
  function getDetails(memberBox, noneBox, selectField, firstNameField, midNameField, lastNameField) {
    if (noneBox !== null && $(noneBox).is(':checked')) {
      return null
    } else {
      const person = {}
  
      person.isMember = $(memberBox).is(':checked')
      
      console.log(person.isMember)

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
  }


    function validateFields() {
      var isValid = true
      
      var brideNonMember = $('#bride_non_member').is(':checked')
      var brideFieldMember = $('#input_bride_member').val() === '0' || $('#input_bride_member').val() === ''
      var brideFieldNonMember = $('#bride_first_name').val() === '' || $('#bride_mid_name').val() === '' || $('#bride_last_name').val() === ''
      var brideMiddleLen = $('#bride_mid_name').val().length === 1

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
  
      
      if ((brideNonMember && brideFieldNonMember) || (!brideNonMember && brideFieldMember)) {
        isValid = false
        $('#bride_info_error').text('Please provide bride name')
      } else {
        $('#bride_info_error').text('')
      }
      // check middle initial length
      if (!brideFieldNonMember && !brideMiddleLen) {
        isValid = false
        $('#bride_middle_len_error').text("Bride's middle initial should only contain 1 letter")
      } else {
        $('#bride_middle_len_error').text('')
      }

      // check the used middle initial
      if (brideFieldNonMember === false && validateMidInitial($('#bride_mid_name').val()) === false) {
        isValid = false
        $('#bride_middle_error').text("Bride's middle initial should only range from letters A-Z")
      } else {
        $('#bride_middle_error').text('')
      }

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

    $('#witness_gfather_non_member').change(function() {
      $(this).attr('disabled', true)
      $('#witness_gfather_member').removeAttr('disabled')
      $('#witness_gfather_member').prop('checked', false)
      $('#witness_gfather_member_div').hide()
      $('#witness_gfather_non_member_div').show()
      selectizeEnable($('#input_witness_gfather_member').val())
      $(selectGodFather)[0].selectize.setValue('0')
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

    $('#witness_gmother_non_member').change(function() {
      $(this).attr('disabled', true)
      $('#witness_gmother_member').removeAttr('disabled')
      $('#witness_gmother_member').prop('checked', false)
      $('#witness_gmother_member_div').hide()
      $('#witness_gmother_non_member_div').show()
      selectizeEnable($('#input_witness_gmother_member').val())
      $(selectGodMother)[0].selectize.setValue('0')
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
          $('#bride_middle_error').text('')
          $('#bride_middle_len_error').text('')
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
          $('#groom_middle_error').text('')
          $('#groom_middle_len_error').text('')
        }
      })
    
      $('#groom_last_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#groom_info_error').val())) {
          $('#groom_info_error').text('')
        }
      })
      
      // bride's parents
      $('#bride_mother_first_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#bride_mother_info_error').val())) {
          $('#bride_mother_info_error').text('')
        }
      })

      $('#bride_mother_mid_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#bride_mother_info_error').val())) {
          $('#bride_mother_info_error').text('')
          $('#bride_mother_middle_error').text('')
          $('#bride_mother_middle_len_error').text('')
        }
      })

      $('#bride_mother_last_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#bride_mother_info_error').val())) {
          $('#bride_mother_info_error').text('')
        }
      })

      $('#bride_father_first_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#bride_father_info_error').val())) {
          $('#bride_father_info_error').text('')
        }
      })

      $('#bride_father_mid_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#bride_father_info_error').val())) {
          $('#bride_father_info_error').text('')
          $('#bride_father_middle_error').text('')
          $('#bride_father_middle_len_error').text('')
        }
      })

      $('#bride_father_last_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#bride_father_info_error').val())) {
          $('#bride_father_info_error').text('')
        }
      })

      // groom's parents
      $('#groom_mother_first_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#groom_mother_info_error').val())) {
          $('#groom_mother_info_error').text('')
        }
      })

      $('#groom_mother_mid_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#groom_mother_info_error').val())) {
          $('#groom_mother_info_error').text('')
          $('#groom_mother_middle_error').text('')
          $('#groom_mother_middle_len_error').text('')
        }
      })

      $('#groom_mother_last_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#groom_mother_info_error').val())) {
          $('#groom_mother_info_error').text('')
        }
      })

      $('#groom_father_first_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#groom_father_info_error').val())) {
          $('#groom_father_info_error').text('')
        }
      })

      $('#groom_father_mid_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#groom_father_info_error').val())) {
          $('#groom_father_info_error').text('')
          $('#groom_father_middle_error').text('')
          $('#groom_father_middle_len_error').text('')
        }
      })

      $('#groom_father_last_name').blur(function () {
        // if error message is empty
        if (validator.isEmpty($('#groom_father_info_error').val())) {
          $('#groom_father_info_error').text('')
        }
      })

      $('#address_line').blur(function () {
        if (validator.isEmpty($('#address_line_error').val())) {
          $('#address_line_error').text('')
        }
      })

      $('#city').blur(function () {
        if (validator.isEmpty($('#city_error').val())) {
          $('#city_error').text('')
        }
      })

      $('#country').blur(function () {
        if (validator.isEmpty($('#country_error').val())) {
          $('#country_error').text('')
        }
      })

      $('#current_date').blur(function () {
        if (validator.isEmpty($('#current_date_error').val())) {
          $('#current_date_error').text('')
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
    
      $('.modal').on('hide.bs.modal', resetModal)

      function resetModal() {
        if (isMaleModal) {
          var currWitness = $('#input_witness_gfather_member').val()
          $('#input_witness_gfather_member').data('previous', null)
          if (currWitness !== '' && !addedWitness) {
            selectizeEnable(currWitness)
          } else {
            addedWitness = false
          }
          $(selectGodFather)[0].selectize.setValue('0')
        } else {
          var currWitness = $('#input_witness_gmother_member').val()
          $('#input_witness_gmother_member').data('previous', null)
          if (currWitness !== '' && !addedWitness) {
            selectizeEnable(currWitness)
          } else {
            addedWitness = false
          }
          $(selectGodMother)[0].selectize.setValue('0')
        }
      }
})