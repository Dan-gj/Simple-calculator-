// script.js – high‑level calculator with extended operations

(function() {
    'use strict';

    // --- DOM elements ---
    const num1 = document.getElementById('num1');
    const num2 = document.getElementById('num2');
    const resultDisplay = document.getElementById('resultDisplay');

    // operation buttons (6 basic + 2 extra)
    const btnAdd = document.getElementById('opAdd');
    const btnSub = document.getElementById('opSub');
    const btnMul = document.getElementById('opMul');
    const btnDiv = document.getElementById('opDiv');
    const btnPow = document.getElementById('opPow');
    const btnMod = document.getElementById('opMod');
    const btnSqrt = document.getElementById('opSqrt');      // √A   (ignores B)
    const btnPercent = document.getElementById('opPercent'); // A% of B

    // utility buttons
    const calculateBtn = document.getElementById('calculateBtn');
    const clearInputsBtn = document.getElementById('clearInputs');
    const exampleBtn = document.getElementById('recallExample');
    const swapBtn = document.getElementById('swapNumbers');
    const resetResultBtn = document.getElementById('resetResult');

    // --- current operation (default = '+') ---
    let currentOp = '+';

    // --- operation registry: symbol -> function (returns number or NaN for invalid) ---
    const operations = {
        '+': (a, b) => a + b,
        '−': (a, b) => a - b,
        '×': (a, b) => a * b,
        '÷': (a, b) => (b === 0) ? NaN : a / b,
        'xʸ': (a, b) => Math.pow(a, b),
        'mod': (a, b) => (b === 0) ? NaN : a % b,
        '√A': (a) => {                // ignores second number, only uses a
            if (a < 0) return NaN;     // real result only for non‑negative
            return Math.sqrt(a);
        },
        '%': (a, b) => (a / 100) * b   // percent: a% of b
    };

    // --- set active operation (highlight) ---
    function setActiveOperation(opSymbol) {
        const allOpBtns = [btnAdd, btnSub, btnMul, btnDiv, btnPow, btnMod, btnSqrt, btnPercent];
        allOpBtns.forEach(btn => {
            btn.style.background = '';
            btn.style.boxShadow = '';
            btn.style.color = '';
        });

        let target = null;
        switch (opSymbol) {
            case '+': target = btnAdd; break;
            case '−': target = btnSub; break;
            case '×': target = btnMul; break;
            case '÷': target = btnDiv; break;
            case 'xʸ': target = btnPow; break;
            case 'mod': target = btnMod; break;
            case '√A': target = btnSqrt; break;
            case '%': target = btnPercent; break;
            default: return;
        }
        if (target) {
            target.style.background = '#dbe3f7';
            target.style.boxShadow = 'inset 5px 5px 12px #b1bbd4, inset -5px -5px 10px #ffffff';
            target.style.color = '#091831';
        }
    }

    // --- change current operation ---
    function setOperation(opSymbol) {
        currentOp = opSymbol;
        setActiveOperation(opSymbol);
    }

    // --- core calculation & display ---
    function computeResult() {
        const a = parseFloat(num1.value);
        const b = parseFloat(num2.value);

        // validation: at least a must be valid for all ops (sqrt needs a, others need both)
        if (isNaN(a)) {
            resultDisplay.value = 'ERR: missing A';
            return;
        }

        // special case: sqrt uses only a, but we still allow b to be anything (ignored)
        if (currentOp === '√A') {
            const raw = operations['√A'](a);
            if (isNaN(raw)) {
                resultDisplay.value = 'NaN (negative sqrt?)';
                return;
            }
            resultDisplay.value = formatNumber(raw);
            return;
        }

        // for all other ops, we need a valid b
        if (isNaN(b)) {
            resultDisplay.value = 'ERR: missing B';
            return;
        }

        const opFunc = operations[currentOp];
        if (!opFunc) {
            resultDisplay.value = 'ERR: no operation';
            return;
        }

        let raw;
        try {
            // pass a and b (functions expect two args, even for '%' which is fine)
            raw = opFunc(a, b);
        } catch (e) {
            resultDisplay.value = 'ERR: calculation failed';
            return;
        }

        if (typeof raw === 'number' && isNaN(raw)) {
            resultDisplay.value = 'NaN (div by zero?)';
            return;
        }

        resultDisplay.value = formatNumber(raw);
    }

    // --- helper: format number without excessive decimals ---
    function formatNumber(value) {
        if (!isFinite(value)) return '∞';
        if (Math.abs(value - Math.round(value)) < 1e-12) return value.toFixed(0);
        // limit to 10 decimal places, then trim trailing zeros
        let str = value.toFixed(12).replace(/\.?0+$/, '');
        if (str.endsWith('.')) str = str.slice(0, -1);
        return str;
    }

    // --- event listeners for operation buttons ---
    btnAdd.addEventListener('click', () => setOperation('+'));
    btnSub.addEventListener('click', () => setOperation('−'));
    btnMul.addEventListener('click', () => setOperation('×'));
    btnDiv.addEventListener('click', () => setOperation('÷'));
    btnPow.addEventListener('click', () => setOperation('xʸ'));
    btnMod.addEventListener('click', () => setOperation('mod'));
    btnSqrt.addEventListener('click', () => setOperation('√A'));
    btnPercent.addEventListener('click', () => setOperation('%'));

    // --- calculate button ---
    calculateBtn.addEventListener('click', computeResult);

    // --- Enter key triggers calculation ---
    function handleEnter(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            computeResult();
        }
    }
    num1.addEventListener('keydown', handleEnter);
    num2.addEventListener('keydown', handleEnter);

    // --- utility: clear inputs ---
    clearInputsBtn.addEventListener('click', () => {
        num1.value = '';
        num2.value = '';
        resultDisplay.value = '';
        num1.focus();
    });

    // --- example: 144 ÷ 12  (and set operation to ÷) ---
    exampleBtn.addEventListener('click', () => {
        num1.value = '144';
        num2.value = '12';
        setOperation('÷');
        computeResult();
    });

    // --- swap A and B ---
    swapBtn.addEventListener('click', () => {
        const temp = num1.value;
        num1.value = num2.value;
        num2.value = temp;
        // keep current operation, but recalc optionally? better recalc for convenience
        computeResult();
    });

    // --- reset result field only ---
    resetResultBtn.addEventListener('click', () => {
        resultDisplay.value = '';
    });

    // --- double‑click on result recalc (handy) ---
    resultDisplay.addEventListener('dblclick', computeResult);

    // --- set default active operation (+) and run initial calculation (12 + 5 = 17) ---
    setOperation('+');
    computeResult();

    // --- prevent context menu on buttons for cleaner look ---
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
    });
})();
