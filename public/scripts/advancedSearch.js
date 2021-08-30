$(document).ready(function () {
    $('#record-type').change(function() {
        var selectedValue = $(this).val()
        if(selectedValue === 'member-option') {
            $('#member-record').show()
            $('#prenup-record').hide()
            $('#wedding-record').hide()
            $('#baptismal-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'prenup-option') {
            $('#prenup-record').show()
            $('#member-record').hide()
            $('#wedding-record').hide()
            $('#baptismal-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'wedding-option') {
            $('#wedding-record').show()
            $('#prenup-record').hide()
            $('#member-record').hide()
            $('#baptismal-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'baptismal-option') {
            $('#baptismal-record').show()
            $('#prenup-record').hide()
            $('#wedding-record').hide()
            $('#member-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'dedication-option') {
            $('#dedication-record').show()
            $('#prenup-record').hide()
            $('#wedding-record').hide()
            $('#baptismal-record').hide()
            $('#member-record').hide()
        }
    })

    /*
      This function validates the member search fields and sends the
      search POST request through ajax
    */
    function searchMember () {
        const data = {}
        // validation here

        data.first_name = $('#first_name').val()
        data.middle_name = $('#middle_name').val()
        data.last_name = $('#last_name').val()
        data.sex = $('#sex').val()
        data.birthday = $('#birthday').val()
        data.civil_status = $('#civil_status').val()
        data.educational_attainment = $('#educational_attainment').val()
        data.occupation = $('#occupation').val()
        data.membership_status = $('#membership_status').val()
        data.city = $('#city').val()
        
        $.ajax({
            type: 'POST',
            url: '/advanced_search',
            data: data,
            success: function (result) {
              if (result) {
                // alert(result)
                location.href = '/view_member/' + result
              } else {
                $('#advanced-search-submit').prop('disabled', false)
                $('#create_error').text('Error Adding Baptismal Record')
              }
            }
        })
    }
    /*
      This function validates the prenup search fields and sends the
      search POST request through ajax
    */
    function searchPrenup () {
        // place validation and ajax here
    }
    /*
      This function validates the wedding search fields and sends the
      search POST request through ajax
    */
    function searchWedding () {
        // place validation and ajax here
    }
    /*
      This function validates the baptismal search fields and sends the
      search POST request through ajax
    */
    function searchBaptismal () {
        // place validation and ajax here
    }
    /*
      This function validates the dedication search fields and sends the
      search POST request through ajax
    */
    function searchDedication () {
        // place validation and ajax here
    }
    
    /* 
      Whenever the search button is clicked, checks the selected search option value
      calls the corresponding function for that search option type
    */
    $('#advanced-search-submit').click(function () {
        $('#advanced-search-submit').prop('disabled', true)
        const selectedValue = $('#record-type').val()
        switch (selectedValue) {
            case 'member-option': searchMember(); break
            case 'prenup-option': searchPrenup(); break
            case 'wedding-option': searchWedding(); break
            case 'baptismal-option': searchBaptismal(); break
            case 'dedication-option': searchDedication(); break
        }
    })
})