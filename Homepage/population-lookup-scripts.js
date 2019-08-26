

function appendToCountryList(name){
var list = document.getElementById("countryList");
var newListItem = document.createElement("li");
newListItem.appendChild(document.createTextNode(name));
list.appendChild(newListItem);
}

