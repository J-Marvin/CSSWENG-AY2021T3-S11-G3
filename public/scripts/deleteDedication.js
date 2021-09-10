$(document).ready(function () {
  $('#delete').click(function () {
    $('#delConfirmModal').modal('show')
  })

  $('#confirm_delete').click(function () {
    // $(this).prop('disabled', true)

    const nonMembers = []
    const couples = [
      $('#dedication_info').data('couple')
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
      recordId: $('#dedication_info').data('dedication')
    }

    console.log(data)
    $.ajax({
      type: 'DELETE',
      url: '/delete_dedication',
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