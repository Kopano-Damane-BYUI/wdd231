// URL to the JSON data
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Select the div with id="cards"
const cards = document.querySelector('#cards');

// Fetch data from the JSON file
async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();
  // console.table(data.prophets); // Uncomment for debugging
  displayProphets(data.prophets); // Call the function with the prophets array
}

// Call the async function to start the process
getProphetData();

// Function to create and display the prophet cards
const displayProphets = (prophets) => {
  prophets.forEach((prophet) => {
    // Create HTML elements for the card
    let card = document.createElement('section');
    let fullName = document.createElement('h2');
    let birthDate = document.createElement('p');
    let birthPlace = document.createElement('p');
    let portrait = document.createElement('img');

    // Set the text content using correct JSON keys
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;
    birthDate.textContent = `Birthdate: ${prophet.birthdate}`;
    birthPlace.textContent = `Birthplace: ${prophet.birthplace}`;

    // Set image attributes
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '340');
    portrait.setAttribute('height', '440');

    // Add all elements to the card
    card.appendChild(fullName);
    card.appendChild(birthDate);
    card.appendChild(birthPlace);
    card.appendChild(portrait);

    // Add the card to the cards container
    cards.appendChild(card);
  });
};