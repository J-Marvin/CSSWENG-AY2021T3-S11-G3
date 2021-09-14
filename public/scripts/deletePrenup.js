$(document).ready(function () {
    $('#delete_prenup').click(function () {
      $('#delConfirmModal').modal('show')
    })
  
    $('#confirm_delete').click(function () {
      // $(this).prop('disabled', true)
  
      const nonMembers = []
      const couples = [
        $('#prenup_info').data('couple')
      ]
  
      // Get All Non Members
      $('.person_info').each(function () {
        if (!($(this).data('member')) && $(this).data('person')) {
          nonMembers.push($(this).data('person'))
        }
      })
  
      const data = {
        nonMembers: JSON.stringify(nonMembers),
        couples: JSON.stringify(couples),
        recordId: $('#prenup_info').data('prenup')
      }
  
      console.log(data)
      $.ajax({
        type: 'DELETE',
        url: '/delete_prenup',
        data: data,
        success: function (result) {
          if (result) {
            location.href = "/forms_main_page"
          } else {
            alert("SOMETHING WENT WRONG")
          }
        }
      })
    })
  })