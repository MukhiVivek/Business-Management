// home pag (today total purchase Data show )

let purchaseData = [];  // Array to store fetched data
let todayPurchaseTotal = 0;  // Variable to store today's total expense

// Function to fetch purchase data from the server
async function fetchPurchaseData() {
    try {
        const response = await fetch('http://192.168.29.191:8000/parties/api/purchases');  // Adjust URL as needed
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and store the data
        purchaseData = await response.json();
        
        // Calculate and display today's total purchase expense
        calculateTodayExpense(purchaseData);
        updateTotalOnPurchasePage(todayPurchaseTotal);  // Update HTML element with formatted total
    } catch (error) {
        console.error('Error fetching purchase data:', error.message);
    }
}

// Function to calculate today's total expense
function calculateTodayExpense(purchaseData) { 
    const today = new Date().toISOString().split('T')[0];  // Get today's date in 'YYYY-MM-DD' format
    todayPurchaseTotal = 0;  // Reset total before calculation
    
    purchaseData.forEach(purchase => {
        if (!purchase.date) return;  // Skip items without a date
        
        const purchaseDate = new Date(purchase.date).toISOString().split('T')[0];
        
        if (purchaseDate === today) {
            const { box, box_weight, rate } = purchase;
            todayPurchaseTotal += box * box_weight * rate;  // Calculate total for each item
        }
        
        
    });
}

// Function to update the total expense on the webpage in Indian currency format
function updateTotalOnPurchasePage(total) {
    
    const todayPurchaseElement = document.getElementById('today_purchase');  // Get the HTML element
    
    if (todayPurchaseElement) {
        const formattedTotal = new Intl.NumberFormat('en-IN').format(total);  // Format in Indian currency
        todayPurchaseElement.textContent = `${formattedTotal} /-`;  // Update the content
    }
}

// Call the fetch function to get and process data
fetchPurchaseData();


// today total sales 

let salesData = [];  // Array to store fetched sales data

// Function to fetch sales data from the server
async function fetchSalesData() {
    try {
        const response = await fetch('http://192.168.29.191:8000/invoice/api/inoice');  // Adjust URL as needed
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        salesData = await response.json();  // Store the fetched data
        const todaySales = getTodaySales(salesData);  // Filter today's sales

        const totalTodaySales = calculateTotalSales(todaySales);  // Calculate total sales for today
        updateTotalOnPage(totalTodaySales);  // Update the total on the webpage
    } catch (error) {
        console.error('Error fetching sales data:', error.message);
    }
}

// Function to filter sales made today
function getTodaySales(salesData) {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in 'YYYY-MM-DD' format

    return salesData.filter(sale => {
        if (!sale.date) return false;  // Skip if there's no date
        
        const saleDate = new Date(sale.date).toISOString().split('T')[0];
        return saleDate === today;
    });
}

// Function to calculate total sales for today
function calculateTotalSales(todaySales) {
    return todaySales.reduce((total, sale) => {
        return total + sale.subtotal;  // Add each sale's subtotal to the total
    }, 0);  // Initial total is 0
}

// Function to update the total sales on the webpage in Indian currency format
function updateTotalOnPage(total) {
    const todaySalesElement = document.getElementById('todaySales');  // Get the HTML element
    if (todaySalesElement) {
        const formattedTotal = new Intl.NumberFormat('en-IN').format(total);  // Format total
        todaySalesElement.textContent = `${formattedTotal} /-`;  // Update the content
    }
}

// Call the fetch function to get and process data
fetchSalesData();
