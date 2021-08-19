$(document).ready(function() {

  alert("TESET")
  $.fn.dataTable.moment('MM/DD/YYYY')

  var table = $('#dataTable').DataTable({
    dom: 'Bfrtip',
    columnDefs: [
      {
        "targets": '_all',
        "createdCell": function (td, cellData, rowData, row, col) {
          $(td).css('padding', '14px')
        }
      }
    ],
    buttons: [
      'copy', 'excel', 'csv', 'print', 'pdf', 'colvis'
    ]
  })

  $('th').css('border-bottom', '3px black double')
  $('#dataTable').on('click', 'tbody tr', function() {
    window.location.href = $(this).data('href')
  })
})

