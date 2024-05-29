document.addEventListener('DOMContentLoaded', () => {
    fetch('data/clothing.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const cardContainer = document.getElementById('card');
            renderItems(data, cardContainer);
            setupFilterButtons();
        })
        .catch(err => {
            console.error(err);
        });
});

function renderItems(items, container) {
    items.forEach(item => {
        const itemElement = createItemElement(item);
        container.appendChild(itemElement);

        const minusButton = itemElement.querySelector('.minus');
        const plusButton = itemElement.querySelector('.plus');
        const amountElement = itemElement.querySelector('.amount');

        let amount = parseInt(localStorage.getItem(item.name)) || item.amount;
        amountElement.textContent = amount;

        minusButton.addEventListener('click', () => updateAmount(item.name, amountElement, -1));
        plusButton.addEventListener('click', () => updateAmount(item.name, amountElement, 1));
    });
}
function createItemElement(item) {
    const element = document.createElement('div');
    element.className = 'info';
    element.style.width = '250px'; // Set fixed width
    element.style.height = '200px'; // Set fixed height
    element.style.margin = '10px'; // Add spacing between grid items
    element.innerHTML = `
    <div class="card mb-3" style="height: 100%; border: 1px solid #ccc;"> <!-- Apply border directly -->
        <div class="card-body" style="height: 100%;">
            <h2 class="card-title name">${item.name}</h2>
            <p class="card-text size">${item.size}</p>
            <p class="card-text amount">Amount: ${item.amount}</p>
            <button class="btn btn-danger minus">-</button>
            <button class="btn btn-success plus">+</button>
        </div>
    </div>
`;

    return element;
}
function updateAmount(name, amountElement, change) {
    let amount = parseInt(amountElement.textContent);
    amount += change;

    if (amount >= 0) {
        amountElement.textContent = amount;
        localStorage.setItem(name, amount);
        sendUpdateToServer(name, amount);
    }

    if (amount === 0) {
        const element = amountElement.closest('.info');
        element.remove();
        localStorage.removeItem(name);
        sendUpdateToServer(name, amount);
    }
}

function sendUpdateToServer(name, amount) {
    fetch('/update-amount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, amount: amount })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server update response:', data);
    })
    .catch(err => {
        console.error('Error updating server:', err);
    });
}

function setupFilterButtons() {
    console.log("Setting up filter buttons");
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => filterItems(button.dataset.size));
    });
}

function filterItems(size) {
    const cardElement = document.getElementById('card');
    const items = cardElement.querySelectorAll('.info');
    items.forEach((item) => {
        const itemSize = item.querySelector('.size').textContent;
        const itemAmount = parseInt(item.querySelector('.amount').textContent); // Extract the amount and convert it to an integer
        item.style.display = (size === 'All' || (itemSize === size && itemAmount > 0)) ? 'block' : 'none';
    });
}
