const webhookUrl = getUrlParameter('webhook'); // Get webhook URL from query parameter
var optionCount = 2; // initialize number of options

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
} // Get parameters from URL

// Check that the webhook parameter has been included
function checkWebhook(){
    if (!webhookUrl) {
        console.error("Webhook URL is missing.");
        return;
    } // Error if no webhook was included in the URL
}

// Send JSON data to bot
function sendData(jsonData){
    fetch(webhookUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(jsonData),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error)); // Error handling for the fetch request
}

// Function to remove an extra option that has been added
function removeOption(optionNumber){
    // select the specified option container
    var optionContainerToRemove = document.getElementById("optionContainer" + optionNumber);

    // remove the container
    if (optionContainerToRemove) {
        optionContainerToRemove.parentNode.removeChild(optionContainerToRemove);
        
        // Update optionCount
        optionCount--;
        
        // re-enable the addOption button if it was disabled
        if (addOptionBtn.disabled && optionCount < 9) {
            addOptionBtn.disabled = false;
            addOptionBtn.style.backgroundColor = ""; // Reset background color
            addOptionBtn.style.cursor = ""; // Reset cursor
        }

        // Update IDs and data-option attributes of remaining options
        for (var i = optionNumber + 1; i <= optionCount + 1; i++) {
            var optionContainer = document.getElementById("optionContainer" + i);
            if (optionContainer) {
                optionContainer.setAttribute("id", "optionContainer" + (i - 1));

                var input = optionContainer.querySelector("input[type='text']");
                if (input) {
                    input.setAttribute("id", "Option" + (i - 1));
                    input.setAttribute("name", "Option" + (i - 1));
                }

                var removeButton = optionContainer.querySelector("button");
                if (removeButton) {
                    removeButton.setAttribute("data-option", (i - 1));
                }
            }
        }
    }
}

// Function to add more option fields dynamically
function addOption() {
    var extraOptionsDiv = document.getElementById("extraOptions");

    if (optionCount < 9) { // Maximum 10 options
        let optionNumber = optionCount + 1; // Calculate the next option number

        // create a container div for the new option
        var optionContainer = document.createElement("div");
        optionContainer.setAttribute("id", "optionContainer" + optionNumber);
        
        // create the label html object for the new option
        var newLabel = document.createElement("label");
        newLabel.setAttribute("for", "Option" + optionNumber);
        newLabel.textContent = "Option";

        // create the input box for the new option
        var newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("id", "Option" + optionNumber);
        newInput.setAttribute("name", "Option" + optionNumber);

        // create the remove button for the new option
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = function() { removeOption(optionNumber); };

        // append the new label, input box and remove button to the option container
        optionContainer.appendChild(newLabel);
        optionContainer.appendChild(newInput);
        optionContainer.appendChild(removeButton);

        // append the container div to the extraOptionsDiv
        extraOptionsDiv.appendChild(optionContainer);

        // Disable the addOption button when max number of options is reached
        if (optionCount === 8) {
            addOptionBtn.disabled = true;
            addOptionBtn.style.backgroundColor = "gray"; // gray out the button
            addOptionBtn.style.cursor = "not-allowed"; // remove pointer cursor
        }

    } else {
        // Show an alert saying the maximum options has been reached
        // This should never show because the button should be disabled
        alert("You can add a maximum of 10 options.");
    }

    // update option count
    optionCount++;
}

// Clears HTML form
function clearForm(){
    document.getElementById("pollForm").reset();
}

// Begins a new poll
function startPoll(){
    checkWebhook();

    // Access the form element
    var form = document.getElementById("pollForm");

    // Get poll options from form
    var title = form.elements["Title"].value;
    var options = [];

    // Push non-empty options into the options array
    for (var i = 1; i <= 9; i++) {
        var option = form.elements["Option" + i] ? form.elements["Option" + i].value.trim() : "";
        if (option !== "") {
            options.push(option);
        }
    }

    // Check if required fields are filled
    if (title === "" || options.length < 2) {
        // Display error message
        var errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
        return; // Stop function execution if required fields are not filled
    } else {
        var errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "none";
    }

    // Format poll options as JSON
    var jsonData = {
        title: title || '',
        numPollOptions: options.length,
        option1: options[0] || '',
        option2: options[1] || '',
        option3: options[2] || null, // Include null if option is empty
        option4: options[3] || null,
        option5: options[4] || null,
        option6: options[5] || null,
        option7: options[6] || null,
        option8: options[7] || null,
        option9: options[8] || null,
    };

    // Send data to bot
    sendData(jsonData);
}

function endPoll(){
     checkWebhook();

    var jsonData = { endPoll: true, };

    // Send data to bot
    sendData(jsonData);
}

function hideOverlay(){
    checkWebhook();

    var jsonData = { hidePoll: true, };

    // Send data to bot
    sendData(jsonData);
}
