let isShowingResult = false;  // global variable to indicate whether the result is currently displayed
let isDarkMode = false;  // global variable to indicate whether dark mode is enabled
let currentLanguage = 'en';  // global variable to store the current language

// language configuration
const translations = {
    en: {
        options: '☰ Options',
        derivative: 'Derivative',
        integral: 'Integral',
        enterExpression: 'Enter expression',
        calculate: '=',
        darkMode: '☼'
    },
    cn: {
        options: '☰ 选项',
        derivative: '导数',
        integral: '积分',
        enterExpression: '输入表达式',
        calculate: '=',
        darkMode: '☼'
    }
};

// button click event
function handleButtonClick(value) {
    const inputElement = document.getElementById('input'); // Get the input element
    
    if (isShowingResult) {
        inputElement.value = value; // If the result is currently displayed, replace the input value
        isShowingResult = false; // Reset the flag
    } else {
        const cursorPos = inputElement.selectionStart; // Get the cursor position
        const currentValue = inputElement.value; // Get the current input value
        inputElement.value = currentValue.slice(0, cursorPos) + value + currentValue.slice(cursorPos); // Insert the value at the cursor position
        inputElement.setSelectionRange(cursorPos + value.length, cursorPos + value.length); // Move the cursor to the end of the inserted value
    }
    
    inputElement.focus(); // Focus on the input element
    updateDisplay(); // Update the LaTeX display
}

// clear button click event
function handleClear() {
    const inputElement = document.getElementById('input');  // Get the input element
    inputElement.value = '';  // Clear the input value
    document.getElementById('latex-display').innerHTML = '';  // Clear the LaTeX display
    isShowingResult = false;  // Reset the flag
}

// backspace button click event
function handleBackspace() {
    const inputElement = document.getElementById('input');  // Get the input element
    if (isShowingResult) {
        handleClear();  // If the result is currently displayed, clear the input
        return;
    }

    const cursorPos = inputElement.selectionStart; // Get the cursor position
    const currentValue = inputElement.value; // Get the current input value

    if (cursorPos > 0) {
        inputElement.value = currentValue.slice(0, cursorPos - 1) + currentValue.slice(cursorPos);  // Remove the character before the cursor
        inputElement.setSelectionRange(cursorPos - 1, cursorPos - 1);  // Move the cursor back by one position
    }

    inputElement.focus(); // Focus on the input element
    updateDisplay(); // Update the LaTeX display
}

// delete button click event
function updateDisplay(result = null) {
    const inputElement = document.getElementById('input'); // Get the input element
    try {
        let latexInput = result !== null ? result : inputElement.value; // Get the input value
        const renderedLatex = katex.renderToString(latexInput, { throwOnError: false }); // Render the LaTeX
        document.getElementById('latex-display').innerHTML = renderedLatex; // Update the LaTeX display
    } catch (error) {
        console.error('LaTeX rendering error:', error); // Log any errors to the console
    }
}

// expression check
function evaluateExpression(expression) {
    try {
        expression = expression.replace(/π/g, 'pi');
        expression = expression.replace(/ln\(/g, 'log(');
        const result = math.evaluate(expression);
        return math.format(result, {precision: 8});
    } catch (error) {
        console.error('Evaluation error:', error);
        return 'Error';
    }
}

// calculate button click event
async function handleCalculate() {
    const inputElement = document.getElementById('input'); // Get the input element
    const expression = inputElement.value.trim(); // Get the input value

    let result; 
    let operation = 'basic';
    if (expression.toLowerCase().includes('d/dx')) { // Check if the expression contains 'd/dx'
        operation = 'derivative'; 
    } else if (expression.includes('∫')) {  // Check if the expression contains '∫'
        operation = 'integral';
    }

    if (operation !== 'basic') { // If the operation is calculus, send a request to the server
        try {
            const response = await fetch('http://localhost:8001/calculate', { // Send a POST request to the server
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expression, operation }), // Send the expression and operation type in the request body
            });
            if (response.ok) {
                const data = await response.json(); // Parse the JSON response
                result = data.result; // Get the result from the response
            } else {
                throw new Error('Server response was not ok.');
            }
        } catch (error) {
            console.error('Calculation error:', error);
            result = 'Error';
        }
    } else {
        result = evaluateExpression(expression); // Evaluate the expression locally if it is a basic operation
    }

    isShowingResult = true; // Set the flag to indicate that the result is currently displayed
    updateDisplay(result.toString()); // Update the LaTeX display with the result
}

// input change event
function handleInputChange(event) {
    if (isShowingResult) { // If the result is currently displayed
        isShowingResult = false; // Reset the flag
    }
    updateDisplay(); // Update the LaTeX display
}

// dropdown toggle
function toggleDropdown(event, dropdownId) {
    event.preventDefault(); // Prevent the default event
    event.stopPropagation(); // Stop the event from bubbling up the DOM tree
    
    var dropdowns = document.querySelectorAll('.calculus-content, .language-content'); // Get all dropdowns
    
    dropdowns.forEach(function(dropdown) { // Loop through each dropdown
        if (dropdown.id !== dropdownId) { // If the dropdown is not the one being toggled
            dropdown.classList.remove("show", "swing-in-top-bck"); // Hide the dropdown
        }
    });
    // Toggle the dropdown
    var content = document.getElementById(dropdownId);
    content.classList.toggle("show"); // Show or hide the dropdown
    content.classList.toggle("swing-in-top-bck"); // Add animation
}

// dark mode toggle
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    const darkModeOverlay = document.getElementById('dark-mode-overlay');
    const logo = document.querySelector('.logo1 img');
    
    if (isDarkMode) {
        darkModeOverlay.style.clipPath = 'circle(150% at top right)';
        logo.src = 'logo_darkmode.png'; // Change to dark mode logo
    } else {
        darkModeOverlay.style.clipPath = 'circle(0% at top right)';
        logo.src = 'logo.png'; // Change back to light mode logo
    }
}

// language toggle
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'cn' : 'en'; 
    updateLanguage();
    
    document.querySelector('.language-toggle').textContent = currentLanguage.toUpperCase(); // Update the language toggle button
    
    document.querySelector('.language-item').textContent = currentLanguage === 'en' ? 'CN' : 'EN'; // Update the language dropdown item
}

// update language
function updateLanguage() {
    const elements = { // Get all elements that need to be updated
        optionsToggle: document.querySelector('.options-toggle'),
        derivativeLink: document.querySelector('.derivative'), 
        integralLink: document.querySelector('.integral'),
        input: document.getElementById('input'),
        calculateButton: document.querySelector('button.special:last-child'),
        languageToggle: document.querySelector('.language-toggle'),
        darkModeToggle: document.querySelector('.color a')
    };
    // Update the text content of each element
    elements.optionsToggle.textContent = translations[currentLanguage].options;
    elements.derivativeLink.textContent = translations[currentLanguage].derivative;
    elements.integralLink.textContent = translations[currentLanguage].integral;
    elements.input.placeholder = translations[currentLanguage].enterExpression;
    elements.calculateButton.textContent = translations[currentLanguage].calculate;
    elements.languageToggle.textContent = currentLanguage.toUpperCase();
    elements.darkModeToggle.textContent = translations[currentLanguage].darkMode;
}

// document ready
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.options-toggle, .language-toggle').forEach(function(element) { // Add click event listeners to all dropdown toggles
        element.addEventListener('click', function(event) {
            const dropdownId = this.nextElementSibling.id; // Get the ID of the dropdown
            toggleDropdown(event, dropdownId); // Toggle the dropdown
        });
    });
    document.querySelector('.language-item').addEventListener('click', function(event) {  // Add click event listeners to all calculator buttons
        event.preventDefault();  // Prevent the default event
        toggleLanguage(); // Toggle the language
        document.getElementById('language-dropdown').classList.remove('show', 'swing-in-top-bck'); // Hide the language dropdown
    });

    const inputElement = document.getElementById('input'); // Get the input element
    inputElement.addEventListener('input', handleInputChange); // Add an input event listener to the input element
    inputElement.addEventListener('keydown', function(event) { // Add a keydown event listener to the input element
        if (event.key === 'Enter') {
            handleCalculate();  // If the Enter key is pressed, calculate the result
        }
    });

    // Add click event listeners to all calculator buttons
    document.querySelector('.color a').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default event
        toggleDarkMode();
    });

    // Add click event listeners to all calculator buttons
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.options-toggle') && !event.target.matches('.language-toggle')) {
            var dropdowns = document.querySelectorAll('.calculus-content, .language-content'); // Get all dropdowns
            dropdowns.forEach(function(dropdown) { // Loop through each dropdown
                dropdown.classList.remove('show', 'swing-in-top-bck'); // Hide the dropdown
            });
        }
    });

    updateLanguage(); // Update the language
    updateDisplay(); // Update the LaTeX display
});