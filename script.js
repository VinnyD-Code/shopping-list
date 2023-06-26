const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formButton = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();

        isEditMode = false;
    }
    else {
        if (checkIfItemExists(newItem)) {
            alert('That item already exists');
            return;
        }
    }

    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
}

function addItemToDOM(item) {
    // Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    //Add li to the DOM
    itemList.appendChild(li);
}


function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    // Add new item to array
    itemsFromStorage.push(item);

    //convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function getItemsFromStorage() {
    let itemsFromStorage;

    // check if there are no items in the storage
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    }
    else {
        // parse string into array, put item into variable
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formButton.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
    formButton.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if (confirm('Are you sure?')) {
        // Remove item from DOM
        item.remove();

        // Remove item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out item to be remove
    itemsFromStorage = itemsFromStorage.filter((i) => i != item);

    // Re-set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItem(e) {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // Clear from localStorage
    localStorage.removeItem('items');

    checkUI();
}

//filter function
function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
        }
    });

}

//Hides the Filter Item and Clear All button if there is no list items
function checkUI() {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearButton.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else {
        clearButton.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formButton.style.backgroundColor = '#333';

    isEditMode = false;
}

// Initialize app
function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItem);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
}

init();


checkUI();