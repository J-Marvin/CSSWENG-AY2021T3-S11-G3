function getDetails(memberBox, noneBox, selectField, firstNameField, midNameField, lastNameField) {
  if (noneBox !== null && $(noneBox).is(':checked')) {
    return null
  } else {
    const person = {}

    person.isMember = $(memberBox).is(':checked')

    if (person.isMember) {
      const info = $(selectField).find(':selected').val().split(', ')
      person.person_id = info[1]
      person.member_id = info[0]
    } else {
      person.first_name = toTitleCase($(firstNameField).val())
      person.mid_name = $(midNameField).val().toUpperCase()
      person.last_name = toTitleCase($(lastNameField).val())
    }
    return person
  }

  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}