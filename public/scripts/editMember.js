$(document).ready(function () {
  $('#submitbtn').click(function() {
    const data = {
      member_id: $('#member_id').text(),
      first_name: $('#first_name').val(),
      middle_name: $('#middle_name').val(),
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
      educ_attainment: $('#educ_attainment').val(),
      alma_mater: $('#alma_mater').val(),
      family_members: $('#family_members').val(),
      churches: $('#churches').val(),
      
    }
  })
})