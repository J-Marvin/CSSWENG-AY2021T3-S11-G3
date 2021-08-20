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

$(document).ready(function() {
    $('select').selectize()

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
})