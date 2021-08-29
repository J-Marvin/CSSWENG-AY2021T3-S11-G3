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
})