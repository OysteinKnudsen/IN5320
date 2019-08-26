

function appendToCountryList(name){
    // Create the list item
var list = document.getElementById("countryList");
var newListItem = document.createElement("li");

// Add the country name and delete button 
newListItem.appendChild(document.createTextNode(name));
var delBtn = document.createElement("button");
delBtn.innerHTML = "X";
delBtn.onclick = function() {
    delBtn.parentElement.remove();
};

newListItem.appendChild(delBtn);
list.appendChild(newListItem);


//Clear the input field and give focus
var countryInputField = document.getElementById('countryInputField');
countryInputField.value = '';
countryInputField.focus();
}


