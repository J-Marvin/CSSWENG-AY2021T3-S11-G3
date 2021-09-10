function getDetails(memberBox, noneBox, selectField, firstNameField, midNameField, lastNameField) {
  if (noneBox !== null && $(noneBox).is(':checked')) {
    return null
  } else {
    const person = {}

    person.isMember = $(memberBox).is(':checked')

    if (person.isMember) {
      const info = $(selectField).find(':selected').val().split(', ')
      person.personId = info[1]
      person.memberId = info[0]
    } else {
      person.firstName = toTitleCase($(firstNameField).val())
      person.midName = $(midNameField).val().toUpperCase()
      person.lastName = toTitleCase($(lastNameField).val())
    }
    return person
  }
}
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

function getValue(id) {
  return $('.option[data-value^="' + id + '"]').data('value')
}