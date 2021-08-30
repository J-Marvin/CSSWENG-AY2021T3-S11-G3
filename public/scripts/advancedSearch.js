$(document).ready(function () {
    $('#record-type').change(function() {
        var selectedValue = $(this).val()
        if(selectedValue === 'member-option') {
            $("#search_form").attr('action', '/search_member')
            $('#member-record').show()
            $('#prenup-record').hide()
            $('#wedding-record').hide()
            $('#baptismal-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'prenup-option') {
            $("#search_form").attr('action', '/search_prenup')
            $('#prenup-record').show()
            $('#member-record').hide()
            $('#wedding-record').hide()
            $('#baptismal-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'wedding-option') {
            $("#search_form").attr('action', '/search_wedding')
            $('#wedding-record').show()
            $('#prenup-record').hide()
            $('#member-record').hide()
            $('#baptismal-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'baptismal-option') {
            $("#search_form").attr('action', '/search_baptismal')
            $('#baptismal-record').show()
            $('#prenup-record').hide()
            $('#wedding-record').hide()
            $('#member-record').hide()
            $('#dedication-record').hide()
        } else if(selectedValue === 'dedication-option') {
            $("#search_form").attr('action', '/search_dedication')
            $('#dedication-record').show()
            $('#prenup-record').hide()
            $('#wedding-record').hide()
            $('#baptismal-record').hide()
            $('#member-record').hide()
        }
    })

    /*
      This function validates the member search fields
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
    }
    /*
      This function validates the prenup search fields
    */
    function searchPrenup () {
        // place validation
    }
    /*
      This function validates the wedding search fields
    */
    function searchWedding () {
        // place validation
    }
    /*
      This function validates the baptismal search fields
    */
    function searchBaptismal () {
        // place validation
    }
    /*
      This function validates the dedication search fields
    */
    function searchDedication () {
        // place validation
    }
    
    /* 
      Whenever the search button is clicked, checks the selected search option value
      calls the corresponding function for that search option type
    */
    $('#advanced-search-submit').click(function () {
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