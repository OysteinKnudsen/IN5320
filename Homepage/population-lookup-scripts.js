window.onload = populateCountryList;

function appendToCountryList(name) {
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

  appendToLocalStorage(name);

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

//TODO: MAKE SURE THIS IS NOT CASE-SENSITIVE
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
