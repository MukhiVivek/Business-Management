console.log("hello");

function filterTodayPurchases(purchaseData) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    // Filter purchases where the date matches today
    const today_purchase_data = purchaseData.filter(purchase => {
        const purchaseDate = new Date(purchase.date).toISOString().split('T')[0]; // Convert purchase date to 'YYYY-MM-DD'
        return purchaseDate === today; // Compare with today's date
    });

    return today_purchase_data; // Return filtered data
}

// Example usage:
const purchaseData = [
    {
        "_id": "674dc5d6ee437c74d3b82b2d",
        "party_name": "Shaktiman Khajur (Rajkot)",
        "item": "Erani ",
        "box": 10,
        "box_weight": 18,
        "rate": 85,
        "date": "2024-12-02T00:00:00.000Z"
    },
    {
        "_id": "674f186b2eb2d4a3fc9036a1",
        "party_name": "Shaktiman Khajur (Rajkot)",
        "item": "Erani ",
        "box": 20,
        "box_weight": 18,
        "rate": 85,
        "date": "2024-12-04T00:00:00.000Z"
    },
    {
        "_id": "674f1a5a2eb2d4a3fc9036b0",
        "party_name": "Shree Hari Gruh Udhyog (Gondal)",
        "item": "Rai Kuria",
        "box": 20,
        "box_weight": 20,
        "rate": 97,
        "date": "2024-12-04T00:00:00.000Z"
    },
    {
        "_id": "674f1b1cc5ac7c9f6c1ec6fe",
        "party_name": "Ganesh Khajur (Kalupur)",
        "item": "Royal Crown ",
        "box": 15,
        "box_weight": 10,
        "rate": 100,
        "date": "2024-12-03T00:00:00.000Z"
    },
    {
        "_id": "674f1bb9c5ac7c9f6c1ec713",
        "party_name": "Jalaram Khajur (kalupur)",
        "item": "Kimia",
        "box": 1,
        "box_weight": 35,
        "rate": 185,
        "date": "2024-12-03T00:00:00.000Z"
    }
];

// Call the function and print results
const today_purchase_data = filterTodayPurchases(purchaseData);
console.log(today_purchase_data);
