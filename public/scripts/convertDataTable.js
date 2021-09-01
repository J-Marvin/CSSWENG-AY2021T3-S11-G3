$(document).ready(function() {
  $.fn.dataTable.moment('MM/DD/YYYY')

  var table = $('#dataTable').DataTable({
    dom: 'Blfrtip',
    columnDefs: [
      {
        "targets": '_all',
        "createdCell": function (td, cellData, rowData, row, col) {
          $(td).css('padding', '14px')
        }
      }
    ],
    buttons: [
      'copy', 'excel', 'csv', 'pdf', 'colvis'
    ],
    "lengthMenu": [10, 15, 25]
  })

  $('th').css('border-bottom', '3px black double')
  $('#dataTable').on('click', 'tbody tr', function() {
    if ($(this).data('href') !== undefined)
      window.location.href = $(this).data('href')
  })
})

