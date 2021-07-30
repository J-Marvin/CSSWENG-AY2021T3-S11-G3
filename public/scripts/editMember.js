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
      churches: $('#churches').val(),
      skills: $('#skills').val(),
      member_id: $('#member_info').attr('data-member'),
      address_id: $('#member_info').attr('data-address'),
      person_id: $('#member_info').attr('data-person')
    }

    const arr = $('.observation-field').toArray()
    data.observations = []
    for(const commentField of arr) {
      const comment = $(commentField).find('#comment').val()
      const commenter = $(commentField).find('#commenter').val()
      if(!validator.isEmpty(comment))
        data.observations.push({comment: comment, observer: commenter, observee_id: data.member_id})
    }
    data.observations = JSON.stringify(data.observations)

    $.ajax({
      type: "POST",
      data: data,
      url: "/update_member",
      success: function(result) {
        alert(result)
      }
    })
    
  })
})