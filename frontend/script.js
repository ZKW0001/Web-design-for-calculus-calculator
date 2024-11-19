let isShowingResult = false;
let isDarkMode = false;
let currentLanguage = 'en';

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

function handleButtonClick(value) {
    const inputElement = document.getElementById('input');
    
    if (isShowingResult) {
        inputElement.value = value;
        isShowingResult = false;
    } else {
        const cursorPos = inputElement.selectionStart;
        const currentValue = inputElement.value;
        inputElement.value = currentValue.slice(0, cursorPos) + value + currentValue.slice(cursorPos);
        inputElement.setSelectionRange(cursorPos + value.length, cursorPos + value.length);
    }
    
    inputElement.focus();
    updateDisplay();
}

function handleClear() {
    const inputElement = document.getElementById('input');
    inputElement.value = '';
    document.getElementById('latex-display').innerHTML = '';
    isShowingResult = false;
}

function handleBackspace() {
    const inputElement = document.getElementById('input');
    if (isShowingResult) {
        handleClear();
        return;
    }

    const cursorPos = inputElement.selectionStart;
    const currentValue = inputElement.value;

    if (cursorPos > 0) {
        inputElement.value = currentValue.slice(0, cursorPos - 1) + currentValue.slice(cursorPos);
        inputElement.setSelectionRange(cursorPos - 1, cursorPos - 1);
    }

    inputElement.focus();
    updateDisplay();
}

function updateDisplay(result = null) {
    const inputElement = document.getElementById('input');
    try {
        let latexInput = result !== null ? result : inputElement.value;
        const renderedLatex = katex.renderToString(latexInput, { throwOnError: false });
        document.getElementById('latex-display').innerHTML = renderedLatex;
    } catch (error) {
        console.error('LaTeX rendering error:', error);
    }
}

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
async function handleCalculate() {
    const inputElement = document.getElementById('input');
    const expression = inputElement.value.trim();

    let result;
    let operation = 'basic';
    if (expression.toLowerCase().includes('d/dx')) {
        operation = 'derivative';
    } else if (expression.includes('∫')) {
        operation = 'integral';
    }

    if (operation !== 'basic') {
        try {
            const response = await fetch('http://localhost:8001/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expression, operation }),
            });
            if (response.ok) {
                const data = await response.json();
                result = data.result;
            } else {
                throw new Error('Server response was not ok.');
            }
        } catch (error) {
            console.error('Calculation error:', error);
            result = 'Error';
        }
    } else {
        result = evaluateExpression(expression);
    }

    isShowingResult = true;
    updateDisplay(result.toString());
}

function handleInputChange(event) {
    if (isShowingResult) {
        isShowingResult = false;
    }
    updateDisplay();
}

function toggleDropdown(event, dropdownId) {
    event.preventDefault();
    event.stopPropagation();
    
    var dropdowns = document.querySelectorAll('.calculus-content, .language-content');
    
    dropdowns.forEach(function(dropdown) {
        if (dropdown.id !== dropdownId) {
            dropdown.classList.remove("show", "swing-in-top-bck");
        }
    });
    
    var content = document.getElementById(dropdownId);
    content.classList.toggle("show");
    content.classList.toggle("swing-in-top-bck");
}

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

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'cn' : 'en';
    updateLanguage();
    
    document.querySelector('.language-toggle').textContent = currentLanguage.toUpperCase();
    
    document.querySelector('.language-item').textContent = currentLanguage === 'en' ? 'CN' : 'EN';
}

function updateLanguage() {
    const elements = {
        optionsToggle: document.querySelector('.options-toggle'),
        derivativeLink: document.querySelector('.derivative'),
        integralLink: document.querySelector('.integral'),
        input: document.getElementById('input'),
        calculateButton: document.querySelector('button.special:last-child'),
        languageToggle: document.querySelector('.language-toggle'),
        darkModeToggle: document.querySelector('.color a')
    };

    elements.optionsToggle.textContent = translations[currentLanguage].options;
    elements.derivativeLink.textContent = translations[currentLanguage].derivative;
    elements.integralLink.textContent = translations[currentLanguage].integral;
    elements.input.placeholder = translations[currentLanguage].enterExpression;
    elements.calculateButton.textContent = translations[currentLanguage].calculate;
    elements.languageToggle.textContent = currentLanguage.toUpperCase();
    elements.darkModeToggle.textContent = translations[currentLanguage].darkMode;
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.options-toggle, .language-toggle').forEach(function(element) {
        element.addEventListener('click', function(event) {
            const dropdownId = this.nextElementSibling.id;
            toggleDropdown(event, dropdownId);
        });
    });

    document.querySelector('.language-item').addEventListener('click', function(event) {
        event.preventDefault();
        toggleLanguage();
        document.getElementById('language-dropdown').classList.remove('show', 'swing-in-top-bck');
    });

    const inputElement = document.getElementById('input');
    inputElement.addEventListener('input', handleInputChange);
    inputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            handleCalculate();
        }
    });

    document.querySelector('.color a').addEventListener('click', function(event) {
        event.preventDefault();
        toggleDarkMode();
    });

    document.addEventListener('click', function(event) {
        if (!event.target.matches('.options-toggle') && !event.target.matches('.language-toggle')) {
            var dropdowns = document.querySelectorAll('.calculus-content, .language-content');
            dropdowns.forEach(function(dropdown) {
                dropdown.classList.remove('show', 'swing-in-top-bck');
            });
        }
    });

    updateLanguage();
    updateDisplay();
});