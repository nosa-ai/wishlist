// Replace with your published Google Sheet URL in CSV format
const tableBody = document.getElementById('wishlist-table');
const wishlistForm = document.getElementById('wishlist-form');

// Google Apps Script URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbwtxNnQ9FrvMPQ7nhM-EUZ8y5NK-JK0zmrKrFb5MHdcZOYWp1w5_A8PwLh-_VQRvvq9FA/exec';

// Google Sheet CSV URL
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/1nYKTQrvj_kwuiPkzAaj3Pm-c9wsN09eQDCa0iDXfbcI/pub?output=csv';

// Fetch and display wishlist data from Google Sheets
const fetchWishlistData = () => {
  fetch(sheetURL)
    .then(response => response.text())
    .then(data => {
      const rows = data.split('\n').slice(1); // Skip header row
      const wishlist = rows.map(row => {
        const [timestamp, name, gift, priority] = row.split(',');
        return { timestamp, name, gift, priority };
      });
      populateTable(wishlist);
    })
    .catch(error => console.error('Error fetching wishlist:', error));
};

// Populate the table with wishlist data
const populateTable = (data) => {
  tableBody.innerHTML = ''; // Clear table
  data.forEach(entry => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.timestamp}</td>
      <td>${entry.name}</td>
      <td>${entry.gift}</td>
      <td>${entry.priority.charAt(0).toUpperCase() + entry.priority.slice(1)}</td>
    `;
    tableBody.appendChild(tr);
  });
};

// Submit new wishlist entry
wishlistForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get form values
  const name = document.getElementById('name').value;
  const gift = document.getElementById('gift').value;
  const priority = document.getElementById('priority').value;

  // Send data to Google Apps Script
  fetch(scriptURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `name=${encodeURIComponent(name)}&gift=${encodeURIComponent(gift)}&priority=${encodeURIComponent(priority)}`,
  })
    .then(response => response.text())
    .then(data => {
      console.log('Success:', data);
      fetchWishlistData(); // Refresh the table
    })
    .catch(error => console.error('Error submitting data:', error));

  // Reset the form
  wishlistForm.reset();
});

// Initial fetch
fetchWishlistData();
