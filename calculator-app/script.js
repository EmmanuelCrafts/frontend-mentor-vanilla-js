const buttons = document.querySelector('.buttons');
const actionValues = {
    add : "+",
    subtract : "-",
    multiply : "*",
    divide : "/",
    decimal : "."
}

const display = document.querySelector('.display-value');
const themeSpans = document.querySelectorAll('.number-toggles span');
const themeToggle = document.querySelector('.number-toggles');
const toggleCircle = document.querySelector('.toggle-circle');

// event listeners
buttons.addEventListener('click', handleKeyPress);
themeToggle.addEventListener('click', handleThemeChange);

function handleEquals() {
    const operators = "+-*/";
    const hasOperators = /[+\-*/]/.test(display.textContent);
    const lastchar = display.textContent[display.textContent.length - 1]
    
    if (display.textContent === "" || operators.includes(lastchar) ||
         !hasOperators) {
        return;
    }
    const result = calculate();

    if (result === "Error") {
        display.textContent = result;
        return;
    }

    const formattedResult = Number(result.toFixed(10));

    if (String(formattedResult).length > 10) {
        display.textContent = formattedResult.toExponential(4);
        return;
    }

    display.textContent = formattedResult;
}

function handleKeyPress(e) {
    const btn = e.target.closest('button');
    if(!btn) return;

    const {number, action} = btn.dataset

    if(number !== undefined) {
        appendToDisplay(number);
        return
    }

    if(action in actionValues) {
        appendToDisplay(actionValues[action]);
        return
    }

    if (action === "delete") display.textContent = display.textContent.slice(0, -1);
    if (action === "reset") display.textContent = "";
    if (action === "equals") handleEquals();
}


function handleThemeChange(e) {
    const activeSpan = e.target.closest('span');
    if(!activeSpan) return;

   const theme = activeSpan.dataset.theme;

   document.body.setAttribute('data-theme', theme);
   toggleCircle.className = `toggle-circle pos-${theme}`;

    themeSpans.forEach(s => s.classList.remove('active'));
    activeSpan.classList.add('active');
}
function appendToDisplay(value) {
    if(display.textContent.length < 15) {
        const operators = "+-*/";
        const lastchar = display.textContent[display.textContent.length - 1]
        const numbers = display.textContent.split(/[+\-*/]/)
        const CurrentNumber = numbers[numbers.length -1]

        // check for multiple operators
        if(operators.includes(lastchar) && operators.includes(value)) {
            return;
         }

        //  check for operator at the start
        if(lastchar === undefined && operators.includes(value)) {
            return;
         }

        // check for decimal at the start
        if(display.textContent === '' && value === ".") {
            display.textContent ='0.'
            return;
        }

        // check for multiple decimals
        if (CurrentNumber.includes('.') && value === '.' ){
            return
        }

        // check for 0 at the start
        if (display.textContent === '0' && value !== '.') {
            display.textContent = value;
            return;
        }
         display.textContent += value;
    }
}

function calculate() {
    const input = display.textContent;
    if(input.includes("+")) {
        const values = input.split("+");
        return  Number(values[0]) + Number(values[1]);
    }

    if(input.includes("-")) {
        const values = input.split("-");
        return Number(values[0]) - Number(values[1]);
    }

    if(input.includes("*")) {
        const values = input.split("*");
        return Number(values[0]) * Number(values[1]);
    }

    if(input.includes("/")) {
        const values = input.split("/");
        if (Number(values[1]) === 0) {
            return "Error";
        }
        return Number(values[0]) / Number(values[1]);
    }

}




