// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  
  
// Example data (simulating data from a database)
const partyData = [
  {
      _id: '6726a8e17d9c313697f68e55',
      party_name: 'Milan Bhai',
      phone_number: 9909222286,
      payment: 2200000
  },
  {
      _id: '673ca8c54b1acc08dc8662d4',
      party_name: 'Shree Ram Food',
      phone_number: 9824041144,
      payment: 0
  }
];

const searchBar = document.getElementById('searchBar');
const suggestionsBox = document.getElementById('suggestions');

searchBar.addEventListener('input', function() {
  const query = searchBar.value.trim().toLowerCase();
  suggestionsBox.innerHTML = '';  // Clear previous suggestions

  if (query.length === 0) return;  // Don't show suggestions if input is empty

  // Filter items based on the query
  const filteredParties = partyData.filter(party =>
      party.party_name.toLowerCase().includes(query)
  );

  // Display suggestions
  filteredParties.forEach(party => {
      const suggestion = document.createElement('div');
      suggestion.textContent = party.party_name;
      suggestion.addEventListener('click', () => {
          searchBar.value = party.party_name;  // Set clicked suggestion to input
          suggestionsBox.innerHTML = '';  // Clear suggestions
          // Optional: you can show more details or trigger other functions here
      });
      suggestionsBox.appendChild(suggestion);
  });

  if (filteredParties.length === 0) {
      suggestionsBox.innerHTML = '<div>No results found</div>';
  }
});


const party_name_buttom = document.getElementById('party_name_buttom');

const partyDisplay = document.getElementById('partyDisplay');

let selectedParty = '';  // Store the selected party name

// Display selected party name in the H1 tag when button is clicked
party_name_buttom.addEventListener('click', function() {
  if (selectedParty) {
      partyDisplay.textContent = selectedParty;
  } else {
      partyDisplay.textContent = 'No party selected!';
  }
});