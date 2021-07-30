$(document).ready(function () {
  $('.btn-primary').click(function () {
    // if disabled, it is checked
    if ($('.container').is(':disabled')) {
      $('#form_id').attr('action', '/create_prenup')
    } else { // else prenup will be made to a member
      $('.container').attr('action', '/create_prenup_member')
    }
  })
})
