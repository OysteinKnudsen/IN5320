window.onload = initWindow;

var countries = [];

/**
 * Appends a country to the list of countries
 * @param {*} country Country to be added.
 * @param {*} store Optional boolean to decide if the country should be stored in local memory
 */

async function appendToCountryList(country, store) {
  var countryEntry = country;
  var countryPopulation;

  addCountry(country);

  if (!endsWithNumbers(country)) {
    try {
      countryPopulation = await getPopulation(country);
    } catch (e) {
      alert("Cannot find country");
      return;
    }
    countryEntry = `${country} - ${countryPopulation}`;
  }

  // Create the list item
  let list = document.getElementById("countryList");
  let newListItem = document.createElement("li");

  // Add the country name and delete button
  newListItem.appendChild(document.createTextNode(countryEntry));

  //Create deletebutton with onlick function
  let delBtn = document.createElement("button");
  delBtn.innerHTML = "X";
  delBtn.setAttribute("onclick", "deleteCountryFromList(this)");

  newListItem.appendChild(delBtn);
  list.appendChild(newListItem);

  if (store) {
    appendToLocalStorage(countryEntry);
  }

  //Clear the input field and give focus
  let countryInputField = document.getElementById("countryInputField");
  countryInputField.value = "";
  countryInputField.focus();
}

/**
 * Appends a country to the local storage.
 */
function appendToLocalStorage(newCountry) {
  let existingCountries = localStorage.getItem("countries");

  if (!existingCountries) {
    existingCountries = [];
  } else {
    existingCountries = JSON.parse(existingCountries);
  }

  existingCountries.push(newCountry);
  localStorage.setItem("countries", JSON.stringify(existingCountries));
}

/**
 * Populates the list of countries with values from the local storage.
 */
function populateCountryList() {
  let existingCountries = localStorage.getItem("countries");

  if (!existingCountries) existingCountries = [];

  existingCountries = JSON.parse(existingCountries);

  for (let i = 0; i < existingCountries.length; i++) {
    let country = existingCountries[i];
    appendToCountryList(country, false);
  }
}

/**
 * Deletes a country from the list of countries and also deletes from local storage
 */
function deleteCountryFromList(element) {
  // Get the name of the country which is to be deleted
  let countryEntry = element.parentElement.firstChild.nodeValue;

  element.parentElement.remove();

  //Delete the country from the local storage
  let allCountries = JSON.parse(localStorage.getItem("countries"));

  let countriesAfterDelete = allCountries.filter(ele => ele != countryEntry);

  localStorage.setItem("countries", JSON.stringify(countriesAfterDelete));
}

function startsWith(element, searchWord) {
  return element.startsWith(searchWord);
}

function searchBarFunction() {
  let allCountries = JSON.parse(localStorage.getItem("countries"));
  let searchWord = document.getElementById("searchBar").value;

  let resultList = search(allCountries, searchWord);

  createList(resultList);
}

function search(list, searchWord) {
  let resultList = [];

  list.forEach(element => {
    if (
      startsWith(element.toLowerCase(), searchWord.toLowerCase()) &&
      searchWord.length <= element.length
    ) {
      resultList.push(element);
    }
  });

  return resultList;
}

function clearCountryList() {
  const countryList = document.getElementById("countryList");
  countryList.innerHTML = "";
}

function createList(countries) {
  clearCountryList();
  countries.forEach(element => {
    appendToCountryList(element, false);
  });

  document.getElementById("searchBar").focus();
}

/**
 * Calls population API to get the population of a country today.
 */
async function getPopulation(country) {
  //Get current date
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  // build URL for api call
  let url = `http://54.72.28.201/1.0/population/${country}/${date}`;

  //Call API to get population
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error();
  }
  let json = await response.json();

  return json.total_population.population;
}

function endsWithNumbers(string) {
  var regex = /([a-zA-Z]*[0-9])$/;
  return string.match(regex);
}

async function calculatePopulationIncreaseRate(country) {
  //build url
  let url = `http://54.72.28.201/1.0/population/${country}/today-and-tomorrow`;

  //Call API to get population
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error();
  }
  let json = await response.json();

  let todaysPopulation = json.total_population[0].population;
  let tomorrowsPopulation = json.total_population[1].population;

  let updateRate = (tomorrowsPopulation - todaysPopulation) / 86400;

  return updateRate;
}

async function updatePopulationCount() {
  let countryList = document.getElementById("countryList");
  let countryListItems = countryList.getElementsByTagName("li");

  for (let i = 0; i < countryListItems.length; i++) {
    let text = countryListItems[i].innerText;
    let number = extractNumber(text);
    let country = text.slice(0, text.indexOf("-") - 1);

    let populationRate = await calculatePopulationIncreaseRate(country);

    let newText = Number(number) + Number(populationRate);

    countryListItems[i].innerText = country + " - " + newText;
  }
}

function extractNumber(str) {
  return Number(str.replace(/[^0-9\.]+/g, ""));
}

function initWindow() {
  populateCountryList();
  setInterval(updatePopulationCount, 1000);
}

async function addCountry(nameOfCountry) {
  let pop = await getPopulation(nameOfCountry);
  let popGrowthRate = await calculatePopulationIncreaseRate(nameOfCountry);

  let country = {
    name: nameOfCountry,
    population: pop,
    populationGrowthRate: popGrowthRate
  };

  countries.push(country);
}
