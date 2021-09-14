$(document).ready(function() {

  $('#delete-baptismal').click(function () {
    $('#delConfirmModal').modal('show')
  })

  $('#confirm_delete').click(function () {
    $('#confirm_delete').prop('disabled', true)
    $.ajax({
      type: 'DELETE',
      url: '/delete_baptismal',
      data: {
        recordId: $('#baptismal_info').data('baptismal')
      },
      success: function (result) {
        if (result) {
          location.href = '/forms_main_page'
        } else {
          $('#modal_error').text('Error Deleting Record')
          $('#confirm_delete').prop('disabled', false)
        }
      }
    })
  })
})