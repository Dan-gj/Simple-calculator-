// Calculator State
let currentInput = '0';
let previousInput = '';
let operator = null;
let expression = '';
let memory = 0;
let currentMode = 'deg';
let resetInput = false;

// DOM Elements
const displayElement = document.getElementById('display');
const expressionElement = document.getElementById('expression');
const memoryLed = document.getElementById('memoryLed');
const memoryValue = document.getElementById('memoryValue');
const degMode = document.getElementById('degMode');
const radMode = document.getElementById('radMode');

// Initialize
function init() {
    updateDisplay();
    
    // Mode toggle listeners
    degMode.addEventListener('click', () => {
        degMode.classList.add('active');
        radMode.classList.remove('active');
        currentMode = 'deg';
    });
    
    radMode.addEventListener('click', () => {
        radMode.classList.add('active');
        degMode.classList.remove('active');
        currentMode = 'rad';
    });
}

// Update display
function updateDisplay() {
    displayElement.textContent = currentInput;
    expressionElement.textContent = expression;
    memoryValue.textContent = memory;
    memoryLed.style.opacity = memory !== 0 ? '1' : '0';
    
    // Remove error class if present
    displayElement.classList.remove('error');
}

// Append number
function appendNumber(num) {
    if (currentInput === '0' || resetInput) {
        currentInput = num;
        resetInput = false;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

// Append decimal
function appendDecimal() {
    if (resetInput) {
        currentInput = '0.';
        resetInput = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Clear all
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    expression = '';
    resetInput = false;
    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Toggle sign
function toggleSign() {
    if (currentInput !== '0' && currentInput !== 'Error') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
    }
    updateDisplay();
}

// Insert operator
function insertOperator(op) {
    if (operator !== null) {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    expression = previousInput + ' ' + getOperatorSymbol(op);
    currentInput = '0';
    updateDisplay();
}

// Get operator symbol for display
function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '^': '^'
    };
    return symbols[op] || op;
}

// Insert trig function
function insertTrig(func) {
    if (currentInput !== '0') {
        calculate();
    }
    
    let value = parseFloat(currentInput);
    let result;
    
    if (currentMode === 'deg') {
        // Convert degrees to radians
        value = value * (Math.PI / 180);
    }
    
    switch(func) {
        case 'sin':
            result = Math.sin(value);
            expression = func + '(' + currentInput + '°)';
            break;
        case 'cos':
            result = Math.cos(value);
            expression = func + '(' + currentInput + '°)';
            break;
        case 'tan':
            result = Math.tan(value);
            expression = func + '(' + currentInput + '°)';
            break;
    }
    
    if (currentMode === 'rad') {
        expression = func + '(' + currentInput + ' rad)';
    }
    
    currentInput = result.toString();
    resetInput = true;
    updateDisplay();
}

// Insert function (log, ln)
function insertFunction(func) {
    if (currentInput !== '0') {
        calculate();
    }
    
    let value = parseFloat(currentInput);
    let result;
    
    switch(func) {
        case 'log':
            result = Math.log10(value);
            expression = 'log(' + currentInput + ')';
            break;
        case 'ln':
            result = Math.log(value);
            expression = 'ln(' + currentInput + ')';
            break;
    }
    
    currentInput = result.toString();
    resetInput = true;
    updateDisplay();
}

// Insert constant
function insertConstant(constant) {
    if (resetInput) {
        currentInput = '';
    }
    
    if (constant === 'pi') {
        currentInput = Math.PI.toString();
        expression = 'π';
    } else if (constant === 'e') {
        currentInput = Math.E.toString();
        expression = 'e';
    }
    
    resetInput = true;
    updateDisplay();
}

// Insert parenthesis
function insertParenthesis(paren) {
    if (currentInput === '0' || resetInput) {
        currentInput = paren;
        resetInput = false;
    } else {
        currentInput += paren;
    }
    updateDisplay();
}

// Calculate square root
function calculateSquareRoot() {
    let value = parseFloat(currentInput);
    
    if (value < 0) {
        currentInput = 'Error';
        displayElement.classList.add('error');
    } else {
        let result = Math.sqrt(value);
        expression = '√(' + currentInput + ')';
        currentInput = result.toString();
        resetInput = true;
    }
    updateDisplay();
}

// Calculate percentage
function calculatePercentage() {
    let value = parseFloat(currentInput);
    
    if (operator && previousInput) {
        // Calculate percentage of previous number
        let prev = parseFloat(previousInput);
        let percentage = (prev * value) / 100;
        currentInput = percentage.toString();
        expression = previousInput + ' ' + getOperatorSymbol(operator) + ' ' + value + '%';
    } else {
        // Just convert to percentage
        currentInput = (value / 100).toString();
        expression = value + '%';
    }
    
    resetInput = true;
    updateDisplay();
}

// Calculate factorial
function calculateFactorial() {
    let value = parseFloat(currentInput);
    
    if (value < 0 || !Number.isInteger(value)) {
        currentInput = 'Error';
        displayElement.classList.add('error');
    } else {
        let result = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        expression = value + '!';
        currentInput = result.toString();
        resetInput = true;
    }
    updateDisplay();
}

// Memory functions
function memoryStore() {
    let value = parseFloat(currentInput);
    if (!isNaN(value)) {
        memory = value;
        updateDisplay();
    }
}

function memoryRecall() {
    if (currentInput === '0' || resetInput) {
        currentInput = memory.toString();
        resetInput = false;
    } else {
        currentInput += memory.toString();
    }
    updateDisplay();
}

function memoryClear() {
    memory = 0;
    updateDisplay();
}

function memoryAdd() {
    let value = parseFloat(currentInput);
    if (!isNaN(value)) {
        memory += value;
        updateDisplay();
    }
}

// Main calculate function
function calculate() {
    if (operator === null || resetInput) {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch(operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                displayElement.classList.add('error');
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        case '^':
            result = Math.pow(prev, current);
            break;
        default:
            return;
    }
    
    // Handle precision issues
    result = Math.round(result * 1e12) / 1e12;
    
    expression = previousInput + ' ' + getOperatorSymbol(operator) + ' ' + currentInput + ' =';
    currentInput = result.toString();
    operator = null;
    previousInput = '';
    resetInput = true;
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    // Numbers
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    }
    
    // Operators
    if (e.key === '+') insertOperator('+');
    if (e.key === '-') insertOperator('-');
    if (e.key === '*') insertOperator('*');
    if (e.key === '/') insertOperator('/');
    if (e.key === '^') insertOperator('^');
    
    // Special keys
    if (e.key === '.') appendDecimal();
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Escape') clearAll();
    if (e.key === 'Backspace') deleteLast();
    
    // Functions
    if (e.key === 's') insertTrig('sin');
    if (e.key === 'c') insertTrig('cos');
    if (e.key === 't') insertTrig('tan');
    if (e.key === 'l') insertFunction('log');
    if (e.key === 'n') insertFunction('ln');
    if (e.key === 'p') insertConstant('pi');
    if (e.key === 'e') insertConstant('e');
    
    // Prevent default for calculator keys
    if (['+', '-', '*', '/', '^', '.', 'Enter', '=', 'Escape', 'Backspace', 's', 'c', 't', 'l', 'n', 'p', 'e'].includes(e.key)) {
        e.preventDefault();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
