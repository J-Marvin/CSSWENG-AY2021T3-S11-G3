$(document).ready(function () {
  $('.btn-primary').click(function () {
    // if disabled, it is checked
    if ($('.container').is(':disabled')) {
      $('#form_id').attr('action', '/createPrenup')
    } else { // else prenup will be made to a member
      $('.container').attr('action', '/createMemberPrenup')
    }
  })
})
