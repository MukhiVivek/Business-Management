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
let customerData = [];

async function fetchcustomerData() {
  try {
    const response = await fetch('http://192.168.29.191:8000/customer/api/customers'); // Adjust URL if hosted elsewhere
    customerData = await response.json(); // Update the customerData array with the fetched data
    console.log('Items data loaded:', customerData);
  } catch (error) {
    console.error('Error fetching items data:', error);
  }
}

// Call the function to fetch data when the page loads
fetchcustomerData();


const searchBar = document.getElementById('searchBar');
const suggestionsBox = document.getElementById('suggestions');
const customer_id_input = document.getElementById('customer_id_input');

// JavaScript to handle modal behavior
const modal = document.getElementById('myModal');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementsByClassName('close')[0];
const customer_phone_number = document.getElementById('customer_phone_number');
const customer_phone_number2 = document.getElementById('customer_phone_number2');

// Open the modal when the button is clicked
openBtn.onclick = function() {
    modal.style.display = 'block';
}

// Close the modal when the 'X' is clicked
closeBtn.onclick = function () {
    modal.style.display = 'none';
}

// Close the modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}




searchBar.addEventListener('input', function() {
  const query = searchBar.value.trim().toLowerCase();
  suggestionsBox.innerHTML = '';  // Clear previous suggestions

  if (query.length === 0) return;  // Don't show suggestions if input is empty

  // Filter items based on the query
  const filteredParties = customerData.filter(customer =>
      customer.customer_name.toLowerCase().includes(query)
  );

  // Display suggestions
  filteredParties.forEach(customer => {
      const suggestion = document.createElement('div');
      suggestion.textContent = customer.customer_name;
      suggestion.addEventListener('click', () => {
          searchBar.value = customer.customer_name;  // Set clicked suggestion to input
          selectedcustomer = customer.customer_name; 
          customer_id_input.value = customer._id;
          customer_phone_number.textContent = `Phone Number: ${customer.customer_phone_number}`;
          customer_phone_number2.textContent = `Phone Number: ${customer.customer_phone_number}`;
          suggestionsBox.innerHTML = '';  // Clear suggestions
          // Optional: you can show more details or trigger other functions here
      });
      suggestionsBox.appendChild(suggestion);
  });

  if (filteredParties.length === 0) {
      suggestionsBox.innerHTML = '<div>No results found</div>';
  }
});


const customer_name_buttom = document.getElementById('customer_name_buttom');
const customerDisplay = document.getElementById('customerDisplay');
const customerDisplay2 = document.getElementById('customerDisplay2');

const suggestions = document.getElementById('suggestions');


let selectedcustomer = '';  // Store the selected customer name

// Display selected customer name in the H1 tag when button is clicked
suggestions.addEventListener('click', function() {
  if (selectedcustomer) {
      customerDisplay.textContent = selectedcustomer;
      customerDisplay2.textContent = selectedcustomer;
      modal.style.display = 'none';
  } else {
      customerDisplay.textContent = 'No customer selected!';
  }
});