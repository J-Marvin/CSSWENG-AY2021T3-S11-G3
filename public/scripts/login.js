$(document).ready(function() {
  $('#login_form').submit(function (e) {
    e.preventDefault();

    const password = $('#password').val()

    $.ajax({
      type: "POST",
      data: {password: password},
      url: "/checkCredentials",
      success: function (result) {
        if (result)
          $('#login_form').unbind().submit()
        else {
          $('#errorModal').modal('show')
        }
      }
    })
  })
})