// script.js - Scientific Calculator Logic
let display = document.getElementById('display');
let history = document.getElementById('history');
let lastResult = 0;

// Add number/operator to display
function addToDisplay(value) {
    display.value += value;
}

// Add scientific function with parentheses
function addFunction(func) {
    switch(func) {
        case 'π':
            display.value += Math.PI.toFixed(8);
            break;
        case 'e':
            display.value += Math.E.toFixed(8);
            break;
        case '^2':
            display.value = evaluateExpression(display.value + '^2');
            break;
        case '^(1/2)':
            display.value = '√(' + display.value + ')';
            break;
        default:
            display.value += func;
    }
}

// Clear everything
function clearAll() {
    display.value = '';
    history.value = '';
    lastResult = 0;
}

// Clear last entry
function clearEntry() {
    display.value = display.value.slice(0, -1);
}

// Calculate result
function calculate() {
    try {
        let expression = display.value;
        
        // Replace symbols for evaluation
        expression = expression.replace(/×/g, '*')
                               .replace(/÷/g, '/')
                               .replace(/−/g, '-')
                               .replace(/\^/g, '**')
                               .replace(/mod/g, '%')
                               .replace(/√\(/g, 'Math.sqrt(')
                               .replace(/sin\(/g, 'Math.sin(')
                               .replace(/cos\(/g, 'Math.cos(')
                               .replace(/tan\(/g, 'Math.tan(')
                               .replace(/log\(/g, 'Math.log10(')
                               .replace(/ln\(/g, 'Math.log(')
                               .replace(/exp\(/g, 'Math.exp(')
                               .replace(/abs\(/g, 'Math.abs(')
                               .replace(/floor\(/g, 'Math.floor(');
        
        // Handle factorial
        if (expression.includes('!')) {
            let parts = expression.split('!');
            let num = parseFloat(parts[0]);
            let fact = 1;
            for(let i = 1; i <= num; i++) fact *= i;
            expression = fact + parts.slice(1).join('');
        }
        
        // Handle power function (x^y)
        if (expression.includes('^')) {
            expression = expression.replace(/\^/g, '**');
        }
        
        // Safe evaluation using Function constructor
        let result = new Function('return ' + expression)();
        
        // Format result
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        // Store history
        history.value = display.value + ' =';
        
        // Format result (limit decimals)
        if (Number.isInteger(result)) {
            display.value = result;
        } else {
            display.value = result.toFixed(8).replace(/\.?0+$/, '');
        }
        
        lastResult = result;
        
    } catch (error) {
        display.value = 'Error';
        console.error('Calculation error:', error);
    }
}

// Evaluate expression safely (helper for power functions)
function evaluateExpression(expr) {
    try {
        expr = expr.replace(/×/g, '*')
                   .replace(/÷/g, '/')
                   .replace(/−/g, '-');
        let result = new Function('return ' + expr)();
        return result;
    } catch {
        return expr;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers
    if (/[0-9]/.test(key)) {
        addToDisplay(key);
    }
    
    // Operators
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        let op = key;
        if (key === '*') op = '×';
        if (key === '/') op = '÷';
        addToDisplay(op);
    }
    
    // Enter key for calculate
    if (key === 'Enter') {
        event.preventDefault();
        calculate();
    }
    
    // Backspace for clear entry
    if (key === 'Backspace') {
        clearEntry();
    }
    
    // Escape for clear all
    if (key === 'Escape') {
        clearAll();
    }
    
    // Decimal point
    if (key === '.') {
        addToDisplay('.');
    }
    
    // Parentheses
    if (key === '(' || key === ')') {
        addToDisplay(key);
    }
});

// Initialize display
clearAll();
