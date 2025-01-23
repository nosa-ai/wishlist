// Replace with your published Google Sheet URL in CSV format
const sheetURL = 'https://docs.google.com/spreadsheets/d/1nYKTQrvj_kwuiPkzAaj3Pm-c9wsN09eQDCa0iDXfbcI/pub?output=csv';

// DOM Elements
const tableBody = document.getElementById('wishlist-table');
const filterDropdown = document.getElementById('friend-filter');
const loadingMessage = document.getElementById('loading');
const errorMessage = document.getElementById('error');

// Show loading spinner
loadingMessage.style.display = 'block';

// Fetch data from Google Sheet
fetch(sheetURL)
  .then(response => response.text())
  .then(data => {
    loadingMessage.style.display = 'none'; // Hide loading spinner
    const rows = data.split('\n').slice(1); // Skip header row
    const wishlistData = rows.map(row => {
      const [name, gift, priority ] = row.split(',');
      return { name, gift, priority: priority.trim() };
    });

    populateTable(wishlistData);
    populateFilter(wishlistData);
    enableFiltering(wishlistData);
  })
  .catch(err => {
    loadingMessage.style.display = 'none'; // Hide loading spinner
    errorMessage.style.display = 'block'; // Show error message
    console.error('Error fetching Google Sheet data:', err);
  });

// Populate the table with data
function populateTable(data) {
  tableBody.innerHTML = ''; // Clear the table
  data.forEach(entry => {
    const tr = document.createElement('tr');

    // Create table cells
    const friendCell = createCell(entry.name);
    const itemCell = createCell(entry.gift);
    const priorityCell = createPriorityCell(entry.priority);

    // Append cells to the row
    tr.appendChild(friendCell);
    tr.appendChild(itemCell);
    tr.appendChild(priorityCell);

    // Add the row to the table
    tableBody.appendChild(tr);
  });
}

// Populate the filter dropdown with unique friend names
function populateFilter(data) {
  const uniqueFriends = Array.from(new Set(data.map(entry => entry.name))).sort();
  uniqueFriends.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    filterDropdown.appendChild(option);
  });
}

// Enable filtering by friend
function enableFiltering(data) {
  filterDropdown.addEventListener('change', () => {
    const selectedFriend = filterDropdown.value;
    const filteredData = selectedFriend === 'all'
      ? data
      : data.filter(entry => entry.name === selectedFriend);
    populateTable(filteredData);
  });
}

// Create a simple cell
function createCell(content) {
  const td = document.createElement('td');
  td.textContent = content || '—'; // Show a dash if the content is empty
  return td;
}

// Create a priority cell with styled classes
function createPriorityCell(priority) {
  const td = document.createElement('td');
  td.textContent = priority || '—'; // Show a dash if no priority is provided
  if (priority.toLowerCase() === 'low') td.classList.add('priority-low');
  if (priority.toLowerCase() === 'medium') td.classList.add('priority-medium');
  if (priority.toLowerCase() === 'high') td.classList.add('priority-high');
  return td;
}


  return td;
}
