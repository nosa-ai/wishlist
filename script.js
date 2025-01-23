// Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCnifO0HruDgFMqApZttNsVDZDx4enzqNw",
    authDomain: "wishlist-app-nosa.firebaseapp.com",
    projectId: "wishlist-app-nosa",
    storageBucket: "wishlist-app-nosa.firebasestorage.app",
    messagingSenderId: "488633479117",
    appId: "1:488633479117:web:e2bc653d75a80b4d441e84",
    measurementId: "G-353JZ5TGB4"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Function to Show a Friend's Wishlist
function showWishlist(friend) {
  // Update the title dynamically
  document.getElementById("friend-name").innerText = `${friend}'s Wishlist`;

  // Get reference to the friend's wishlist in Firebase
  const wishlistRef = db.ref(`wishlists/${friend}`);

  // Fetch and render the wishlist items
  wishlistRef.on("value", snapshot => {
    const wishlist = snapshot.val() || [];
    const wishlistItems = document.getElementById("wishlist-items");
    wishlistItems.innerHTML = ""; // Clear the current list

    if (wishlist.length === 0) {
      wishlistItems.innerHTML = "<p>No items in this wishlist yet.</p>";
    } else {
      wishlist.forEach(item => {
        wishlistItems.innerHTML += `
          <li>
            ${item}
            <button onclick="removeItem('${friend}', '${item}')">Remove</button>
          </li>
        `;
      });
    }
  });
}

// Function to Add a New Item
function addItem() {
  const friend = document.getElementById("friend-name").innerText.split("'s")[0];
  const newItemInput = document.getElementById("new-item");
  const newItem = newItemInput.value.trim();

  // Validate the input
  if (newItem === "") {
    alert("Please enter a gift idea!");
    return;
  }

  // Get reference to the friend's wishlist in Firebase
  const wishlistRef = db.ref(`wishlists/${friend}`);

  // Add the new item to the wishlist
  wishlistRef.once("value").then(snapshot => {
    const wishlist = snapshot.val() || [];
    if (!wishlist.includes(newItem)) { // Prevent duplicates
      wishlist.push(newItem); // Add new item to the wishlist
      wishlistRef.set(wishlist) // Save the updated wishlist to Firebase
        .then(() => {
          newItemInput.value = ""; // Clear the input field
          alert(`"${newItem}" has been added to ${friend}'s wishlist!`);
        })
        .catch(error => {
          console.error("Error adding item:", error);
          alert("Failed to add item. Please try again.");
        });
    } else {
      alert(`"${newItem}" is already in ${friend}'s wishlist!`);
    }
  });
}

// Function to Remove an Item
function removeItem(friend, item) {
  const wishlistRef = db.ref(`wishlists/${friend}`);

  // Remove the item from the wishlist
  wishlistRef.once("value").then(snapshot => {
    const wishlist = snapshot.val() || [];
    const updatedWishlist = wishlist.filter(i => i !== item); // Filter out the item

    wishlistRef.set(updatedWishlist) // Save the updated wishlist to Firebase
      .then(() => {
        alert(`"${item}" has been removed from ${friend}'s wishlist.`);
      })
      .catch(error => {
        console.error("Error removing item:", error);
        alert("Failed to remove item. Please try again.");
      });
  });
}

// Initialize Default View
window.onload = function () {
  // Load the first friend's wishlist by default
  showWishlist("Jood");
};
