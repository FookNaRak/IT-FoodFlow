// Function to fetch menus from the server
function fetchMenus() {
    fetch('/api/menu')
        .then(response => response.json())
        .then(data => {
            const menuList = document.getElementById('menuList');
            menuList.innerHTML = ''; // Clear the list
            data.forEach(menu => {
                const li = document.createElement('li');
                li.textContent = `ID: ${menu.menuID}, Name: ${menu.menuName}, Price: $${menu.menuPrice}`;
                
                // Create an Edit button
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Edit';
                updateButton.onclick = () => updateMenu(menu.menuID);

                // Create a Delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteMenu(menu.menuID);

                // Append the buttons to the list item
                li.appendChild(updateButton);
                li.appendChild(deleteButton);
                menuList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching menus:', error));
}

// Function to add a new menu item
function addMenu() {
    const shopID = document.getElementById('shopID').value;
    const menuName = document.getElementById('menuName').value;
    const menuPrice = document.getElementById('menuPrice').value;

    fetch('/api/menu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shopID, menuName, menuPrice })
    })
    .then(response => response.json())
    .then(() => {
        fetchMenus(); // Refresh the menu list
        document.getElementById('addMenuForm').reset(); // Reset the form
    })
    .catch(error => console.error('Error adding menu:', error));
}

// Function for updating a menu item
function updateMenu(menuID) {
    const newName = prompt("Enter new menu name:");
    const newPrice = prompt("Enter new menu price:");

    if (newName && newPrice) {
        fetch(`/api/menu/${menuID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ menuName: newName, menuPrice: newPrice })
        })
        .then(response => response.json())
        .then(() => fetchMenus()) // Refresh the menu list after the update
        .catch(error => console.error('Error updating menu:', error));
    }
}

// Function for deleting a menu item
function deleteMenu(menuID) {
    fetch(`/api/menu/${menuID}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(() => fetchMenus()) // Refresh the menu list after deletion
        .catch(error => console.error('Error deleting menu:', error));
}

// Fetch the menus when the page loads
window.onload = fetchMenus;
