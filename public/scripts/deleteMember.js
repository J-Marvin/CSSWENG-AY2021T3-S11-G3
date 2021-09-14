$(document).ready(function() {
  $('#del_member').click(function() {
    $('#delConfirmModal').modal('show')
  })

  $('#confirm_delete').click(function() {
    const addresses = [
      $('#member_info').data('address')
    ]
    const recordId = $('#member_info').data('member')
    const bapRegId = $('#member_info').data('baptismal')

    $('.church_address').each(function() {
      addresses.push($(this).data('address'))
    })

    const data = { 
      addresses: JSON.stringify(addresses),
      bapRecordId: bapRegId,
      recordId: recordId
    }

    $.ajax({
      type: 'DELETE',
      url: '/delete_member',
      data: data,
      success: function (result) {
        if (result) {
          location.href = '/member_main_page'
        } else {
          alert("SOMETHING WENT WRONG")
        }
      }
    })
  })
})