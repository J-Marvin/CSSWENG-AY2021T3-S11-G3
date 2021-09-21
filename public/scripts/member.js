$(document).ready(function () {
  let addObservation = false
  let addChurch = false
  let editObservationId = null
  let editChurchId = null
  let editChurchAddressId = null
  let parentDiv = null
  const churchModal = $('#addChurchModal')
  const observationModal = $('#addObservationModal')

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase());
  }

  function validateMobile(number) {
    const re = /\d{4}\s?-?\d{3}\s?-?\d{4}/
    const reCountry = /^([+]\d{2,3})?\d{10}$/
    return re.test(number) || reCountry.test(number) || validator.isNumeric(number) || validator.isEmpty(number)
  }

  function validateTelephone(number) {
    const regex = /^([+])?[0-9]+$/
    const localRegex = /^([(]\d{2,3}[)]){0,1}(\d{3}[-]\d{4}|\d{7})$/

    return regex.test(number) || localRegex.test(number) || validator.isNumeric(number) || validator.isEmpty(number)
  }

  function validateFields() {
    var isValid = true
    var errors = ''
    
    if (validator.isEmpty($('#first_name').val())) {
        $('#first_name_error').text('Required')
        errors += 'First name is required\n'
        isValid = false
    } else {
        $('#first_name_error').text('')
    }

    if(validator.isEmpty($('#mid_name').val())) {
        $('#mid_name_error').text('Required')
        errors += 'Middle name is required\n'
        isValid = false
    } else if (!validator.isLength($('#mid_name').val(), { min: 1, max: 1 })){
      $('#mid_name_error').text('Middle initial should be one letter only')
      errors += 'Middle Initial only\n'
      isValid = false
    } else {
        $('#mid_name_error').text('')
    }

    if(validator.isEmpty($('#last_name').val())) {
        $('#last_name_error').text('Required')
        errors += 'Last name is required\n'
        isValid = false
    } else {
        $('#last_name_error').text('')
    }

    if(validator.isEmpty($('#birthday').val())) {
      errors += 'Birthday is required\n'
      $('#birthday_error').text('Required')
      isValid = false
    } else if (new Date($('#birthday').val()) > new Date()) {
      errors += 'Birthday is required\n'
      $('#birthday_error').text('Invalid date')
      isValid = false
    }
    else {
        $('#birthday_error').text('')
    }

    if(validator.isEmpty($('#occupation').val())) {
        errors += 'Occupation is required\n'
        $('#occupation_error').text('Required')
        isValid = false
    } else {
        $('#occupation_error').text('')
    }

    if(validator.isEmpty($('#membership_status').val())) {
        errors += 'Membership status is required\n'
        $('#membership_status_error').text('Required')
        isValid = false
    } else {
        $('#membership_status_error').text('')
    }

    if(validator.isEmpty($('#civil_status').val())) {
        errors += 'Civil status is required\n'
        $('#civil_status_error').text('Required')
        isValid = false
    } else {
      $('#civil_status_error').text('')
      if($('#civil_status').val() === 'Others' && validator.isEmpty($('#civil_status_others').val())) {
          $('#civil_status_others_error').text('Required')
          isValid = false
        } else {
          $('#civil_status_others_error').text('')
        }
    }

    if(validator.isEmpty($('#sex').val())) {
        $('#sex_error').text('Required')
        errors += 'Sex is required\n'
        isValid = false
    } else {
        $('#sex_error').text('')
    }

    if(validator.isEmpty($('#address_line').val())) {
        $('#address_line_error').text('Required')
       errors += 'Address is required\n'
        isValid = false
    } else {
        $('#address_line_error').text('')
    }

    if(validator.isEmpty($('#city').val())) {
        errors += 'Cityis required\n'
        $('#city_error').text('Required')
        isValid = false
    } else {
        $('#city_error').text('')
    }

    if(validator.isEmpty($('#country').val())) {
        $('#country_error').text('Required')
        errors += 'Country is required\n'
        isValid = false
    } else {
        $('#country_error').text('')
    }

    if (!validator.isEmail($('#email').val()) && !validator.isEmpty($('#email').val())) {
        $('#email_error').text('Enter valid email')
        errors += 'Invalid email\n'
        isValid = false
    } else {
        $('#email_error').text('')
    }

    if(!validateMobile($('#mobile').val())) {
        $('#mobile_error').text('Enter valid mobile number')
        errors += 'Invalid mobile number\n'
        isValid = false
    } else {
        $('#mobile_error').text('')
    }

    if(!validateTelephone($('#telephone').val())) {
      $('#telephone_error').text('Enter valid telephone number')
      errors += 'Invalid telephone number\n'
      isValid = false
    } else {
      $('#telephone_error').text('')
    }

    console.log(errors)

    return isValid
  }

  $('#civil_status').on('change', function() {
    const status = $('#civil_status').val()
    if(status === 'Single' || status === 'Married') {
      $('#civil_status_others').parent().hide()
    } else {
      $('#civil_status_others').parent().show()
    }
  })
  $('#create-member').click(function() {
    $('#create-member').prop('disabled', true)

    if(validateFields()) {
      $('#create-member-form').submit()
    } else {
      $('#create-member').prop('disabled', false)
    }
  })

  $('#membership_status').on('change', function() {
    const status = $('#membership_status').val()

    if (status === 'Active' || status === 'Inactive') {
      $('#membership_type').closest('div').show()
    } else {
      $('#membership_type').closest('div').hide()
    }
  })

  $('#edit-member').click(function() {

    var civil_status

    if($('#civil_status').val() !== 'Others') {
      civil_status = $('#civil_status').val()
    } else {
      civil_status = $('#civil_status_others').val()
    }

    if (validateFields()) {
      const data = {
        member_id: $('#member_id').text(),
        first_name: $('#first_name').val(),
        middle_name: $('#mid_name').val(),
        last_name: $('#last_name').val(),
        age: $('#age').val(),
        birthday: $('#birthday').val(),
        occupation: $('#occupation').val(),
        membership_status: $('#membership_status').val(),
        civil_status: civil_status,
        sex: $('#sex').val(),
        address_line: $('#address_line').val(),
        address_line2: $('#address_line2').val(),
        city: $('#city').val(),
        province: $('#province').val(),
        postal_code: $('#postal_code').val(),
        country: $('#country').val(),
        workplace: $('#workplace').val(),
        email: $('#email').val(),
        telephone: $('#telephone').val(),
        mobile: $('#mobile').val(),
        educational_attainment: $('#educational_attainment').val(),
        alma_mater: $('#alma_mater').val(),
        family_members: $('#family_members').val(),
        skills: $('#skills').val(),
        member_id: $('#member_info').attr('data-member'),
        address_id: $('#member_info').attr('data-address'),
        person_id: $('#member_info').attr('data-person'),
        membership_type: $('#membership_type').val()
      }
      
      console.log("data")
      $.ajax({
        type: "POST",
        data: data,
        url: "/update_member",
        success: function (result) {
          if (result === true)
            //location.href('/member/' + data.member_id)
            window.location = '/member/' + data.member_id
          else alert("Changes not saved")
        }
      })
    } 
  })

  $('#addChurchBtn').click(function() {
    const fields = $(churchModal).find('input').val("")
    addChurch = true
    editChurchId = null
    parentDiv = null

    $(churchModal).find('.error_codes').text('')
    $(churchModal).modal('show')
  })

  $('#saveChurchBtn').click(function() {

    $('#saveChurchBtn').prop('disabled', true)
    var isValid = true
    var errors = ''
    
    const churchFieldset = $('#churchFieldset')
    const church = {}

    church.church_name = $(churchFieldset).find('#church_name').val()
    church.address_line = $(churchFieldset).find('#church_address_line').val()
    church.address_line2 = $(churchFieldset).find('#church_address_line2').val()
    church.city = $(churchFieldset).find('#church_city').val()
    church.province = $(churchFieldset).find('#church_province').val()
    church.postal_code = $(churchFieldset).find('#church_postal_code').val()
    church.country = $(churchFieldset).find('#church_country').val()
    church.member_id = $('#member_info').attr('data-member')

    if(validator.isEmpty($('#church_name').val())) {
      isValid = false
      errors = errors + 'pls enter church name\n'
      $('#church_name_error').text('Enter church name')
    }

    if(validator.isEmpty($('#church_address_line').val())) {
      isValid = false
      errors = errors + 'pls enter church address\n'
      $('#church_address_line_error').text('Enter address')
    }

    if(validator.isEmpty($('#church_city').val())) {
      isValid = false
      errors = errors + 'pls enter church city\n'
      $('#church_city_error').text('Enter city')
    }

    if(validator.isEmpty($('#church_country').val())) {
      isValid = false
      errors = errors + 'pls enter church country\n'
      $('#church_country_error').text('Enter country')
    }

    if(!isValid) {
      //alert(errors)
      $('#saveChurchBtn').prop('disabled', false)
    } else {
      if(addChurch) {

        console.log(church)
        $.ajax({
          type: "POST",
          data: church,
          url: "/add_church",
          success: function (result) {
            $('#saveChurchBtn').prop('disabled', false)
            $('#churchList').append(result)
            $(churchModal).modal('hide')
          }
        })
      } else {
        church.church_id = editChurchId
        church.address_id = editChurchAddressId
  
        $.ajax({
          type: "PUT",
          data: church,
          url: "/update_church",
          success: function (result) {
            $('#saveChurchBtn').prop('disabled', false)
            if(result) {
              $(parentDiv).find('.church_name').text(church.church_name)
              $(parentDiv).find('.church_address_line').text(church.address_line)
              $(parentDiv).find('.church_address_line2').text(church.address_line2)
              $(parentDiv).find('.church_city').text(church.city)
              $(parentDiv).find('.church_province').text(church.province)
              $(parentDiv).find('.church_postal_code').text(church.postal_code)
              $(parentDiv).find('.church_country').text(church.country)
  
              $(churchModal).modal('hide')
            }
          }
        })
      }
    }
  })

  $('#saveObservationBtn').click(function() {

    $('#saveObservationBtn').prop('disabled', true)
    var isValid = true
    var errors = ''

    const observationFieldset = $('#observationFieldset')
    const observation = {}

    observation.observer = $(observationFieldset).find('#commenter').val()
    observation.comment = $(observationFieldset).find('#comment').val()
    observation.observee = $('#member_info').attr('data-member')

    if(validator.isEmpty($(observationFieldset).find('#commenter').val())) {
      isValid = false
      errors = errors + 'please provide commenter name\n'
      $('#commenter_error').text('Enter commenter')
    }
    
    if(validator.isEmpty($(observationFieldset).find('#comment').val())) {
      isValid = false
      errors = errors + 'please provide comment\n'
      $('#comment_error').text('Enter comment')
    }

    if(!isValid) {
      $('#saveObservationBtn').prop('disabled', false)
    } else {
        if (addObservation) {
          $.ajax({
            type: "POST",
            data: observation,
            url: "/add_observation",
            success: function (result) {
              $('#saveObservationBtn').prop('disabled', false)
              $('#observationList').append(result)
              $(observationModal).modal('hide')
            }
          })
        } else {
          observation.observation_id = editObservationId
          $.ajax({
            type: "PUT",
            data: observation,
            url: "/update_observation",
            success: function (result) {
              $('#saveObservationBtn').prop('disabled', false)
              if(result) {
                $(parentDiv).find('.comment').text(observation.comment)
                $(parentDiv).find('.observer').text(observation.observer)
                $(observationModal).modal('hide')
              } else {
                alert("FAILED")
              }
            }
          })
        }
      }
  })

  $('#addObservationBtn').click(function() {
    const fields = $(observationModal).find('input').val("")
    addObservation = true
    editObservationId = null
    parentDiv = null

    $(observationModal).find('.error_codes').text('')
    $(observationModal).modal('show')
  })

  $(document).on('click', '.editObservationBtn', function () {
    const comment = $(this).siblings('.card-title').find('.comment').text().trim()
    const observer = $(this).siblings('.row').find('.observer').text().trim()

    const observationFieldset = $('#observationFieldset')

    editObservationId = $(this).closest('.card').attr('data-observation')
    parentDiv = $(this).closest('div')
    addObservation = false

    $(observationFieldset).find('#comment').val(comment)
    $(observationFieldset).find('#commenter').val(observer)

    $(observationModal).find('.error_codes').text('')
    $(observationModal).modal('show')
  });

  $(document).on('click', '.delObservationBtn', function () {
    const data = {}
    $(this).prop('disabled', true)
    const parent = $(this).closest('.card')
    data.observation_id = $(this).closest('.card').attr('data-observation')
    $.ajax({
      type: "DELETE",
      data: data,
      url: "/delete_observation",
      success: function (result) {
        console.log(result)
        if (result) {
          parent.remove()
        } else {
          $(this).prop('disabled', false)
          alert("FAILED")
        }
      }
    })
  })

  $(document).on('click', '.editChurchBtn', function () {
    //alert($(this).siblings('h5').find('.church_name').text())

    const church_name = $(this).siblings('h5').find('.church_name').text().trim()
    const address_line = $(this).siblings('p').find('.church_address_line').text().trim()
    const address_line2 = $(this).siblings('p').find('.church_address_line2').text().trim()
    const city = $(this).siblings('p').find('.church_city').text().trim()
    const province = $(this).siblings('p').find('.church_province').text().trim()
    const country = $(this).siblings('p').find('.church_country').text().trim()
    const postal_code = $(this).siblings('p').find('.church_postal_code').text().trim()

    const churchFieldset = $('#churchFieldset')

    editChurchId = $(this).closest('.card').attr('data-church')
    editChurchAddressId = $(this).siblings('p').attr('data-address')
    parentDiv = $(this).closest('div')
    addChurch = false

    $(churchFieldset).find('#church_name').val(church_name)
    $(churchFieldset).find('#church_address_line').val(address_line)
    $(churchFieldset).find('#church_address_line2').val(address_line2)
    $(churchFieldset).find('#church_city').val(city)
    $(churchFieldset).find('#church_province').val(province)
    $(churchFieldset).find('#church_postal_code').val(postal_code)
    $(churchFieldset).find('#church_country').val(country)

    $(churchModal).find('.error_codes').text('')
    $(churchModal).modal('show')
  })

  $(document).on('click', '.delChurchBtn', function () {
    const data = {}
    const parent = $(this).closest('.card')
    data.church_id = $(this).closest('.card').attr('data-church')
    data.address_id = $(this).siblings('p').attr('data-address')
    $(this).prop('disabled', true)

    $.ajax({
      type: "DELETE",
      data: data,
      url: "/delete_church",
      success: function (result) {
        console.log(result)
        if (result) {
          parent.remove()
        } else {
          alert("FAILED")
          $(this).prop('disabled', false)
        }
      }
    })
  })
})