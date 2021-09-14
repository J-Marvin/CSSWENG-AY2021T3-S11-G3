$(document).ready(function(){

  $('#delete_wedding').click(function () {
    $('#delConfirmModal').modal('show')
  })

  $('#confirm_delete').click(function () {
    // $(this).prop('disabled', true)

    const nonMembers = []
    const couples = [
      $('#wedding_info').data('couple-id'),
      $('#wedding_info').data('bride-parents'),
      $('#wedding_info').data('groom-parents')
    ]
    const witnesses = []

    // Get All Non Members
    $('.person_info').each(function () {
      if (!($(this).data('member')) && $(this).data('person')) {
        nonMembers.push($(this).data('person'))
      }
    })

    $('.witness').each(function () {
      witnesses.push($(this).data('record'))
    })

    const data = {
      nonMembers: JSON.stringify(nonMembers),
      couples: JSON.stringify(couples),
      witnesses: JSON.stringify(witnesses),
      recordId: $('#wedding_info').data('wedding-id')
    }

    $.ajax({
      type: 'DELETE',
      url: '/delete_wedding',
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