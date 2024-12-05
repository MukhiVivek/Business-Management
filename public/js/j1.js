// Get references to the buttons and sidebar
const openSidebar = document.getElementById('openSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');

// Open the sidebar
openSidebar.addEventListener('click', () => {
  sidebar.style.width = '150px'; // Adjust the width as needed
  container.style.right = '200px'; 
});

// Close the sidebar
closeSidebar.addEventListener('click', () => {
  sidebar.style.width = '0'; // Reset the width to hide the sidebar
});

// Item data array (you can add more items as needed)
let itemsData = [];

async function fetchItemsData() {
  try {
    const response = await fetch('http://192.168.29.191:8000/item/api/items'); // Adjust URL if hosted elsewhere
    itemsData = await response.json(); // Update the itemsData array with the fetched data
    console.log('Items data loaded:', itemsData);
  } catch (error) {
    console.error('Error fetching items data:', error);
  }
}

// Call the function to fetch data when the page loads
fetchItemsData();




// Function to set selling price based on item name
document.querySelector('.item-name').addEventListener('input', function() {
  const enteredName = this.value.trim(); // Get the input value
  
  // Find item in the array
  const foundItem = itemsData.find(item => item.item_name.toLowerCase() === enteredName.toLowerCase());
  
  // Set the selling price if item is found
  if (foundItem) {
    document.getElementById('itemSellingPriceInput').value = foundItem.item_sellingprice;
  } else {
    document.getElementById('itemSellingPriceInput').value = ''; // Clear if not found
  }
});



$(document).ready(function () {
  $('.btn-add-item').click(function () {
      const rowNumber = $('#item-rows tr').length + 1;
      const newRow = `
      <tr class="item-row">
          <td>${rowNumber}</td>
          <td><input type="text" id="itemNameInput" name="data[item_name]" class="form-control item-name" placeholder="Item Name" required>                        </td>
          <td><input type="number" name="data[qty]"  class="form-control qty" placeholder="Qty" required></td>
          <td><input type="number" name="data[item_price]" id="itemSellingPriceInput" class="form-control price item-price" placeholder="Selling Price" required ></td>
          <td><input type="number" name="data[amount]" class="form-control amount" placeholder="Amount" readonly required></td>
          <td><i class="fas fa-trash text-danger delete-row" style="cursor: pointer;"></i></td>
      </tr>`;
      document.getElementById('item-rows').insertAdjacentHTML('beforeend', newRow);
      
  });

  $(document).on('click', '.delete-row', function () {
      $(this).closest('tr').remove();
  });
});



// Event delegation for dynamically added rows
document.getElementById('item-rows').addEventListener('input', function(event) {
  if (event.target.classList.contains('item-name')) {  // Check if the input is for item name
    const enteredName = event.target.value.trim().toLowerCase();

    // Find item in the array
    const foundItem = itemsData.find(item => item.item_name.toLowerCase() === enteredName);

    // Find the closest row and set the price
    const row = event.target.closest('.item-row'); // Get the current row
    const priceInput = row.querySelector('.item-price'); // Target price input in the current row

    if (foundItem) {
      priceInput.value = foundItem.item_sellingprice;
    } else {
      priceInput.value = ''; // Clear if not found
    }
  }
});

 // Function to calculate the row amount and update totals
 $('#item-rows').on('input', '.qty, .price', function () {
  const row = $(this).closest('tr');
  const qty = parseFloat(row.find('.qty').val()) || 0;
  const price = parseFloat(row.find('.price').val()) || 0;

  // Calculate the amount for the current row
  const amount = (qty * price) ;
  row.find('.amount').val(amount.toFixed(2));

  updateTotals(); // Update totals after recalculating
});

// Update the subtotal, taxable amount, and total
function updateTotals() {
  let subtotal = 0;

  $('#item-rows tr').each(function () {
      const row = $(this);
      const amount = parseFloat(row.find('.amount').val()) || 0;

      subtotal += amount;
  });

  $('.subtotal').val(subtotal.toFixed(2));

}

// Delete row functionality
document.getElementById('item-rows').addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-row')) {
    event.target.closest('.item-row').remove();
  }
});




// const num1 = document.getElementById('num1');
// const num2 = document.getElementById('num2');
// const result = document.getElementById('result');

// // Add event listeners to both input fields to update the result
// function calculateMulti() {
//   const value1 = parseFloat(num1.value) || 0; // Default to 0 if empty
//   const value2 = parseFloat(num2.value) || 0; // Default to 0 if empty
//   result.value = value1 * value2; // Calculate and update the result
// }


// function calculateSum() {
//   const value1 = parseFloat(result.value) || 0; // Default to 0 if empty
//   result.value = value1 * value2; // Calculate and update the result
// }



// num1.addEventListener('input', calculateMulti);
// num2.addEventListener('input', calculateMulti);