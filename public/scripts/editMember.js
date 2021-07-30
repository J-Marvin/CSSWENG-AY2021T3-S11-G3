$(document).ready(function () {
  
  $('#submitbtn').click(function() {
    
    const data = {
      member_id: $('#member_id').text(),
      first_name: $('#first_name').val(),
      middle_name: $('#mid_name').val(),
      last_name: $('#last_name').val(),
      age: $('#age').val(),
      birthday: $('#birthday').val(),
      occupation: $('#occupation').val(),
      membership_status: $('#membership_status').val(),
      civil_status: $('#civil_status').val(),
      sex: $('#sex').val(),
      address_line: $('#address_line').val(),
      barangay: $('#barangay').val(),
      city: $('#city').val(),
      province: $('#province').val(),
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
      person_id: $('#member_info').attr('data-person')
    }

    const observations = $('.observation-field').toArray()
    data.observations = []
    for (const commentField of observations) {
      const comment_id = $(commentField).attr('data-comment').val()
      const comment = $(commentField).find('#comment').val()
      const commenter = $(commentField).find('#commenter').val()
      if(!validator.isEmpty(comment))
        data.observations.push({
          comment: comment, 
          observer: commenter, 
          observee_id: data.member_id,
          comment_id: comment_id
        })
    }
    data.observations = JSON.stringify(data.observations)

    data.churches = []

    const churches = $('.church-fieldset').toArray()
    data.churches = []

    for(const churchFieldset of churches) {
      const church = {}
      church.address = {}
      church.church_name = $(churchFieldset).find('#church_name').val()
      church.address.address_line = $(churchFieldset).find('#church_address_line').val()
      church.address.address_line2 = $(churchFieldset).find('#church_address_line2').val()
      church.address.city = $(churchFieldset).find('#church_city').val()
      church.address.province = $(churchFieldset).find('#church_province').val()
      church.address.postal_code = $(churchFieldset).find('#church_postal_code').val()
      church.address.country = $(churchFieldset).find('#church_country').val()
      church.church_id = $(churchFieldset).attr('data-church')
      church.address_id = $(churchFieldset).attr('data-address')
      
      data.churches.push(church)
    }

    data.churches = JSON.stringify(data.churches)

    $.ajax({
      type: "POST",
      data: data,
      url: "/update_member",
      success: function(result) {
        alert(result)
      }
    })
    
  })

  $('#addChurchBtn').click(function() {
    const fields = $('#addChurchModal').find('input').val("")

    $('#addChurchModal').modal('show')
  })

  $('#saveChurchBtn').click(function() {
    const churchFieldset = $('#churchFieldSet')
    const church = {}
    church.church_name = $(churchFieldset).find('#church_name').val()
    church.address_line = $(churchFieldset).find('#church_address_line').val()
    church.address_line2 = $(churchFieldset).find('#church_address_line2').val()
    church.city = $(churchFieldset).find('#church_city').val()
    church.province = $(churchFieldset).find('#church_province').val()
    church.postal_code = $(churchFieldset).find('#church_postal_code').val()
    church.country = $(churchFieldset).find('#church_country').val()
    church.member_id = $('#member_info').attr('data-member')

    $.ajax({
      type: "POST",
      data: church,
      url: "/add_church",
      success: function (result) {
        $('#churchList').append(result)
        $('#addChurchModal').modal('hide')
      }
    })
  })

  $('#saveObservationBtn').click(function() {
    alert("TEST")
    const observationFieldset = $('#observationFieldset')
    const observation = {}

    observation.observer = $(observationFieldset).find('#commenter').val()
    observation.comment = $(observationFieldset).find('#comment').val()
    observation.observee = $('#member_info').attr('data-member')

    $.ajax({
      type: "POST",
      data: observation,
      url: "/add_observation",
      success: function (result) {
        $('#observationList').append(result)
        $('#addObservationModal').modal('hide')
      }
    })
  })

  $('#addObservationBtn').click(function() {
    const fields = $('#addObservationModal').find('input')

    // clear all fields of modal
    for (field of fields) {
      $(field).val("")
    }

    $('#addObservationModal').modal('show')
  })
})