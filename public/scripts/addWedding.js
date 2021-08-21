function display_div_bride (status) {
    if(status === "bride_non_member") {
      document.getElementById("bride_member_div").style.display = "none"
      document.getElementById("bride_member").checked = false
      document.getElementById("bride_member").removeAttribute("disabled")
      document.getElementById("bride_non_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup')
      
    }
    else {
      document.getElementById("bride_non_member_div").style.display = "none"
      document.getElementById("bride_non_member").checked = false
      document.getElementById("bride_non_member").removeAttribute("disabled")
      document.getElementById("bride_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup_member')
    }
    document.getElementById(status + "_div").style.display = "block"
  }

function display_div_groom (status) {
    if(status === "groom_non_member") {
      document.getElementById("groom_member_div").style.display = "none"
      document.getElementById("groom_member").checked = false
      document.getElementById("groom_member").removeAttribute("disabled")
      document.getElementById("groom_non_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup')
    }
    else {
      document.getElementById("groom_non_member_div").style.display = "none"
      document.getElementById("groom_non_member").checked = false
      document.getElementById("groom_non_member").removeAttribute("disabled")
      document.getElementById("groom_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup_member')
    }
    document.getElementById(status + "_div").style.display = "block"
  }

function display_div_bride_mother (status) {
    if(status === "bride_mother_non_member") {
      document.getElementById("bride_mother_member_div").style.display = "none"
      document.getElementById("bride_mother_member").checked = false
      document.getElementById("bride_mother_member").removeAttribute("disabled")
      document.getElementById("bride_mother_none").checked = false
      document.getElementById("bride_mother_none").removeAttribute("disabled")
      document.getElementById("bride_mother_non_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup')
      document.getElementById(status + "_div").style.display = "block"
    }
    else if(status === "bride_mother_member") {
      document.getElementById("bride_mother_non_member_div").style.display = "none"
      document.getElementById("bride_mother_non_member").checked = false
      document.getElementById("bride_mother_non_member").removeAttribute("disabled")
      document.getElementById("bride_mother_none").checked = false
      document.getElementById("bride_mother_none").removeAttribute("disabled")
      document.getElementById("bride_mother_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup_member')
      document.getElementById(status + "_div").style.display = "block"
    }
    else {
      document.getElementById("bride_mother_non_member").checked = false
      document.getElementById("bride_mother_non_member").removeAttribute("disabled")
      document.getElementById("bride_mother_member").checked = false
      document.getElementById("bride_mother_member").removeAttribute("disabled")
      document.getElementById("bride_mother_none").setAttribute("disabled", "disabled")
      document.getElementById("bride_mother_non_member_div").style.display = "none"
      document.getElementById("bride_mother_member_div").style.display = "none"
      document.getElementById("bride_mother_info_error").innerHTML = ""
    }
  }

  function display_div_bride_father (status) {
    if(status === "bride_father_non_member") {
      document.getElementById("bride_father_member_div").style.display = "none"
      document.getElementById("bride_father_member").checked = false
      document.getElementById("bride_father_member").removeAttribute("disabled")
      document.getElementById("bride_father_none").checked = false
      document.getElementById("bride_father_none").removeAttribute("disabled")
      document.getElementById("bride_father_non_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup')
      document.getElementById(status + "_div").style.display = "block"
    }
    else if(status === "bride_father_member") {
      document.getElementById("bride_father_non_member_div").style.display = "none"
      document.getElementById("bride_father_non_member").checked = false
      document.getElementById("bride_father_non_member").removeAttribute("disabled")
      document.getElementById("bride_father_none").checked = false
      document.getElementById("bride_father_none").removeAttribute("disabled")
      document.getElementById("bride_father_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup_member')
      document.getElementById(status + "_div").style.display = "block"
    }
    else {
      document.getElementById("bride_father_non_member").checked = false
      document.getElementById("bride_father_non_member").removeAttribute("disabled")
      document.getElementById("bride_father_member").checked = false
      document.getElementById("bride_father_member").removeAttribute("disabled")
      document.getElementById("bride_father_none").setAttribute("disabled", "disabled")
      document.getElementById("bride_father_non_member_div").style.display = "none"
      document.getElementById("bride_father_member_div").style.display = "none"
      document.getElementById("bride_father_info_error").innerHTML = ""
    }
  }

  function display_div_groom_mother (status) {
    if(status === "groom_mother_non_member") {
      document.getElementById("groom_mother_member_div").style.display = "none"
      document.getElementById("groom_mother_member").checked = false
      document.getElementById("groom_mother_member").removeAttribute("disabled")
      document.getElementById("groom_mother_none").checked = false
      document.getElementById("groom_mother_none").removeAttribute("disabled")
      document.getElementById("groom_mother_non_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup')
      document.getElementById(status + "_div").style.display = "block"
    }
    else if(status === "groom_mother_member") {
      document.getElementById("groom_mother_non_member_div").style.display = "none"
      document.getElementById("groom_mother_non_member").checked = false
      document.getElementById("groom_mother_non_member").removeAttribute("disabled")
      document.getElementById("groom_mother_none").checked = false
      document.getElementById("groom_mother_none").removeAttribute("disabled")
      document.getElementById("groom_mother_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup_member')
      document.getElementById(status + "_div").style.display = "block"
    }
    else {
      document.getElementById("groom_mother_non_member").checked = false
      document.getElementById("groom_mother_non_member").removeAttribute("disabled")
      document.getElementById("groom_mother_member").checked = false
      document.getElementById("groom_mother_member").removeAttribute("disabled")
      document.getElementById("groom_mother_none").setAttribute("disabled", "disabled")
      document.getElementById("groom_mother_non_member_div").style.display = "none"
      document.getElementById("groom_mother_member_div").style.display = "none"
      document.getElementById("groom_mother_info_error").innerHTML = ""
    }
  }

  function display_div_groom_father (status) {
    if(status === "groom_father_non_member") {
      document.getElementById("groom_father_member_div").style.display = "none"
      document.getElementById("groom_father_member").checked = false
      document.getElementById("groom_father_member").removeAttribute("disabled")
      document.getElementById("groom_father_none").checked = false
      document.getElementById("groom_father_none").removeAttribute("disabled")
      document.getElementById("groom_father_non_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup')
      document.getElementById(status + "_div").style.display = "block"
    }
    else if(status === "groom_father_member") {
      document.getElementById("groom_father_non_member_div").style.display = "none"
      document.getElementById("groom_father_non_member").checked = false
      document.getElementById("groom_father_non_member").removeAttribute("disabled")
      document.getElementById("groom_father_none").checked = false
      document.getElementById("groom_father_none").removeAttribute("disabled")
      document.getElementById("groom_father_member").setAttribute("disabled", "disabled")
      $("#prenup_form").attr('action', '/create_prenup_member')
      document.getElementById(status + "_div").style.display = "block"
    }
    else {
      document.getElementById("groom_father_non_member").checked = false
      document.getElementById("groom_father_non_member").removeAttribute("disabled")
      document.getElementById("groom_father_member").checked = false
      document.getElementById("groom_father_member").removeAttribute("disabled")
      document.getElementById("groom_father_none").setAttribute("disabled", "disabled")
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
      $('#input_witness_gmother_member').parent().find('.option[data-value="' + data + '"]').removeattr('data-selectable')
      $('#input_witness_gfather_member').parent().find('.option[data-value="' + data + '"]').removeattr('data-selectable')
    }

    $('#create-wedding-registry').click(function (){

      $('#create-wedding-registry').prop('disabled', true)
      if(validateFields()) {
        // AJAX
      } else {
        $('#create-wedding-registry').prop('disabled', false)
      }
    })

    function validateFields() {
      var isValid = true
      
      var brideMember = $('#input_bride_member').val() === '0' || $('#input_bride_member').val() === ''
      var brideNonMember = $('#bride_first_name').val() === '' || $('#bride_mid_name').val() === '' || $('#bride_last_name').val() === ''
  
      var groomMember = $('#input_groom_member').val() === '0' || $('#input_groom_member').val() === ''
      var groomNonMember = $('#groom_first_name').val() === '' || $('#groom_mid_name').val() === '' || $('#groom_last_name').val() === ''
  
      var brideMotherNone = $('#bride_mother_none').is(':checked')
      var brideMotherMember = $('#input_bride_mother_member').val() === '0' || $('#input_bride_mother_member').val() === ''
      var brideMotherNonMember = $('#bride_mother_first_name').val() === '' || $('#bride_mother_mid_name').val() === '' || $('#bride_mother_last_name').val() === ''
  
      var brideFatherNone = $('#bride_father_none').is(':checked')
      var brideFatherMember = $('#input_bride_father_member').val() === '0' || $('#input_bride_father_member').val() === ''
      var brideFatherNonMember = $('#bride_father_first_name').val() === '' || $('#bride_father_mid_name').val() === '' || $('#bride_father_last_name').val() === ''
  
      var groomMotherNone = $('#groom_mother_none').is(':checked')
      var groomMotherMember = $('#input_groom_mother_member').val() === '0' || $('#input_groom_mother_member').val() === ''
      var groomMotherNonMember = $('#groom_mother_first_name').val() === '' || $('#groom_mother_mid_name').val() === '' || $('#groom_mother_last_name').val() === ''
  
      var groomFatherNone = $('#groom_father_none').is(':checked')
      var groomFatherMember = $('#input_groom_father_member').val() === '0' || $('#input_groom_father_member').val() === ''
      var groomFatherNonMember = $('#groom_father_first_name').val() === '' || $('#groom_father_mid_name').val() === '' || $('#groom_father_last_name').val() === ''
  
      var addressLine = $('#address_line').val() === ''
      var city = $('#city').val() === ''
      var country = $('#country').val() === ''
  
      var dateField = $('#current_date').val() === ''
  
  
      if (brideMember && brideNonMember) {
        isValid = false
        $('#bride_info_error').text('Please provide bride name')
      } else {
        $('#bride_info_error').text('')
      }
  
      if (groomMember && groomNonMember) {
        isValid = false
        $('#groom_info_error').text('Please provide groom name')
      } else {
        $('#groom_info_error').text('')
      }
    
      if(!brideMotherNone && brideMotherMember && brideMotherNonMember) {
        isValid = false
        $('#bride_mother_info_error').text('Please provide name')
      } else {
        $('#bride_mother_info_error').text('')
      }
  
      if(!groomMotherNone && groomMotherMember && groomMotherNonMember) {
        isValid = false
        $('#groom_mother_info_error').text('Please provide name')
      } else {
        $('#groom_mother_info_error').text('')
      }
  
      if(!brideFatherNone && brideFatherMember && brideFatherNonMember) {
        isValid = false
        $('#bride_father_info_error').text('Please provide name')
      } else {
        $('#bride_father_info_error').text('')
      }
  
      if(!groomFatherNone && groomFatherMember && groomFatherNonMember) {
        isValid = false
        $('#groom_father_info_error').text('Please provide name')
      } else {
        $('#groom_father_info_error').text('')
      }
  
      if(addressLine) {
        isValid = false
        $('#address_line_error').text('Please accomplish')
      } else {
        $('#address_line_error').text('')
      }
  
      if(city) {
        isValid = false
        $('#city_error').text('Please accomplish')
      } else {
        $('#city_error').text('')
      }
  
      if(country) {
        isValid = false
        $('#country_error').text('Please accomplish')
      } else {
        $('#country_error').text('')
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
        const re = /[A-Z]/
        return re.test(mid)
      }
    
      $('.modal').on('hide.bs.modal', resetModal())

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
})