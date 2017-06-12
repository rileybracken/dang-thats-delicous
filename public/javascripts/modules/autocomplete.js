export default (input, latInput, lngInput) => {
  if(!input) return; // skip this from running if there is not input on the page
  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  })

  // if someone hits enter on the address field, don't submit the form
  input.on('key', (e) => {
    if (e.keyCode === 13) e.preventDefault();
  });
};
