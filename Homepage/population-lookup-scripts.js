window.onload = populateCountryList;

async function appendToCountryList(name) {
  let population = await getPopulation(name);

  console.log("tråd fortsetter");

  // Create the list item
  let list = document.getElementById("countryList");
  var newListItem = document.createElement("li");

  // Add the country name and delete button
  let countryEntry = `${name} - ${population}`;
  newListItem.appendChild(document.createTextNode(countryEntry));

  var delBtn = document.createElement("button");
  delBtn.innerHTML = "X";
  delBtn.setAttribute("onclick", "deleteCountryFromList(this)");

  newListItem.appendChild(delBtn);
  list.appendChild(newListItem);

  appendToLocalStorage(countryEntry);

  //Clear the input field and give focus
  var countryInputField = document.getElementById("countryInputField");
  countryInputField.value = "";
  countryInputField.focus();
}

function appendToLocalStorage(newCountry) {
  var existingCountries = JSON.parse(localStorage.getItem("countries"));
  if (existingCountries == null) existingCountries = [];
  existingCountries.push(newCountry);
  localStorage.setItem("countries", JSON.stringify(existingCountries));
}

//This is a duplicate function almost, should refactor to remove redundant code.
function appendToCountryListNoStorage(name) {
  // Create the list item
  let list = document.getElementById("countryList");
  var newListItem = document.createElement("li");

  // Add the country name and delete button
  newListItem.appendChild(document.createTextNode(name));

  var delBtn = document.createElement("button");
  delBtn.innerHTML = "X";
  delBtn.setAttribute("onclick", "deleteCountryFromList(this)");

  newListItem.appendChild(delBtn);
  list.appendChild(newListItem);

  //Clear the input field and give focus
  var countryInputField = document.getElementById("countryInputField");
  countryInputField.value = "";
  countryInputField.focus();
}

function populateCountryList() {
  var existingCountries = JSON.parse(localStorage.getItem("countries"));

  if (existingCountries == null) existingCountries = [];

  for (let i = 0; i < existingCountries.length; i++) {
    let country = existingCountries[i];
    appendToCountryListNoStorage(country);
  }
}

function deleteCountryFromList(element) {
  // Get the name of the country which is to be deleted
  var countryName = element.parentElement.firstChild.nodeValue;

  element.parentElement.remove();

  //Delete the country from the local storage
  var allCountries = JSON.parse(localStorage.getItem("countries"));

  var countriesAfterDelete = allCountries.filter(ele => ele != countryName);

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
    if (startsWith(element.toLowerCase(), searchWord.toLowerCase())) {
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
    appendToCountryListNoStorage(element);
  });

  document.getElementById("searchBar").focus();
}

async function getPopulation(country) {
  let url = `http://54.72.28.201/1.0/population/${country}/2019-08-26`;
  let response = await fetch(url);
  console.log("henterdata");
  let json = await response.json();

  console.log("json", json.total_population.population);
  return json.total_population.population;
}
