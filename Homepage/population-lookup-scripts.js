window.onload = init;
var countries = [];

/**
 * Appends a country to the list of countries
 * @param {*} country Country to be added.
 */

async function getCode(country) {
  let url = "https://restcountries.eu/rest/v2/name/" + country;

  let response = await fetch(url);
  if (!response.ok) {
    throw new Error();
  }
  let json = await response.json();

  return json[0].alpha2Code;
}

async function appendToCountryList(country) {
  let countryName = country.name;
  let countryPopulation = country.population;

  // Create the list item
  let list = document.getElementById("countryList");
  let newListItem = document.createElement("li");

  //Create spans to be placed inside the list item with country information
  let countryFlagSpan = document.createElement("span");
  countryFlagSpan.setAttribute(
    "style",
    "padding-right:3px; padding-top: 3px; display:inline-block;"
  );

  let countryFlagImage = document.createElement("img");

  let imageUrl = `https://www.countryflags.io/${country.countryCode}/flat/16.png`;
  countryFlagImage.setAttribute("src", imageUrl);

  let countryCodeSpan = document.createElement("span");
  let nameSpan = document.createElement("span");
  nameSpan.setAttribute("id", "countryName");
  let populationSpan = document.createElement("span");

  nameSpan.innerHTML = " - " + countryName + " - ";
  populationSpan.innerHTML = Math.trunc(countryPopulation);
  countryCodeSpan.innerHTML = "[" + country.countryCode + "] - ";
  countryCodeSpan.appendChild(countryFlagImage);
  //Add the spans to the list item
  newListItem.appendChild(countryCodeSpan);

  newListItem.appendChild(nameSpan);
  newListItem.appendChild(populationSpan);

  //Create deletebutton with onlick function
  let delBtn = document.createElement("button");
  delBtn.innerHTML = "X";
  delBtn.setAttribute("onclick", "deleteCountryFromList(this)");

  newListItem.appendChild(delBtn);
  list.appendChild(newListItem);
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

function loadFromLocalStorage() {
  let existingCountries = localStorage.getItem("countries");

  if (!existingCountries) existingCountries = [];

  existingCountries = JSON.parse(existingCountries);

  countries = existingCountries;
}

/**
 * Deletes a country from the list of countries and also deletes from local storage
 */
function deleteCountryFromList(element) {
  // Get the name of the country which is to be deleted
  let countryName = element.parentElement.childNodes[1].innerHTML
    .replace(/-/g, "")
    .trim();

  // Delete the country from the array of countries
  countries = countries.filter(ele => ele.name != countryName);

  //Save data to local storage to reflect changes.
  saveDataToLocalStorage();

  // Delete the parent element (list item)
  element.parentElement.remove();
}

function startsWith(element, searchWord) {
  return element.startsWith(searchWord);
}

function searchBarFunction() {
  let allCountries = countries;
  let searchBar = document.getElementById("searchBar");
  let searchWord = searchBar.value;
  let resultList = search(allCountries, searchWord);
  clearCountryList();
  createList(resultList);
}

function search(list, searchWord) {
  let resultList = [];

  list.forEach(country => {
    if (
      startsWith(country.name.toLowerCase(), searchWord.toLowerCase()) &&
      searchWord.length <= country.name.length
    ) {
      resultList.push(country);
    }
  });

  return resultList;
}

function clearCountryList() {
  const countryList = document.getElementById("countryList");
  countryList.innerHTML = "";
}

function createList(list) {
  for (let i = 0; i < list.length; i++) {
    appendToCountryList(list[i]);
  }
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

function updatePopCount() {
  for (let i = 0; i < countries.length; i++) {
    countries[i].population += countries[i].populationGrowthRate;
  }
}

function refreshCountryList() {
  clearCountryList();
  initList();
}

async function addCountry(nameOfCountry) {
  if (alreadyAdded(nameOfCountry)) {
    alert("Already exists");
    return;
  }

  try {
    let pop = await getPopulation(nameOfCountry);
    let popGrowthRate = await calculatePopulationIncreaseRate(nameOfCountry);
    let alpha2Code = await getCode(nameOfCountry);

    let country = {
      name: nameOfCountry,
      population: pop,
      populationGrowthRate: popGrowthRate,
      countryCode: alpha2Code
    };

    countries.push(country);
    appendToCountryList(country);
    appendToLocalStorage(country);
    document.getElementById("countryInputField").value = "";
    document.getElementById("countryInputField").focus();
  } catch (e) {
    alert("Invalid country name");
  }
}

function init() {
  loadFromLocalStorage();
  initList();
  setInterval(populationGrowthIntervalFunction, 1000);
  setInterval(saveDataToLocalStorage, 5000);
}

function initList() {
  for (let i = 0; i < countries.length; i++) {
    appendToCountryList(countries[i]);
  }
}

function populationGrowthIntervalFunction() {
  if (document.activeElement === document.getElementById("searchBar")) {
    updatePopCount();
    return;
  }

  updatePopCount();
  clearCountryList();
  createList(countries);
  countries.sort(function(a, b) {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
  });
}

function saveDataToLocalStorage() {
  localStorage.setItem("countries", JSON.stringify(countries));
}

function alreadyAdded(countryName) {
  let exists = false;

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].name == countryName) {
      exists = true;
      break;
    }
  }

  return exists;
}

function clearData() {
  countries = [];
  localStorage.setItem("countries", "");
  clearCountryList();
}
