const buttons = document.querySelector('.buttons');
const display = document.querySelector('.display-value');
const themeSpans = document.querySelectorAll('.number-toggles span');
const themeToggle = document.querySelector('.number-toggles');
const toggleCircle = document.querySelector('.toggle-circle');

function Calculator(display) {
    this.display = display;
    this.actionValues = {
        add : "+",
        subtract : "-",
        multiply : "*",
        divide : "/",
        decimal : "."
    }
}

const calculator = new Calculator(display);
Calculator.prototype.calculate  = function () {
    const input = this.display.textContent;

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

Calculator.prototype.appendToDisplay = function(value) {

    if(this.display.textContent.length < 15) {
        const operators = "+-*/";
        const lastchar = this.display.textContent[this.display.textContent.length - 1]
        const numbers = this.display.textContent.split(/[+\-*/]/)
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
        if(this.display.textContent === '' && value === ".") {
            this.display.textContent ='0.'
            return;
        }

        // check for multiple decimals
        if (CurrentNumber.includes('.') && value === '.' ){
            return
        }

        // check for 0 at the start
        if (this.display.textContent === '0' && value !== '.') {
            this.display.textContent = value;
            return;
        }
         this.display.textContent += value;
    }
}

Calculator.prototype.handleEquals = function () {

    const operators = "+-*/";
    const hasOperators = /[+\-*/]/.test(this.display.textContent);
    const lastchar = this.display.textContent[this.display.textContent.length - 1]
    
    if (this.display.textContent === "" || operators.includes(lastchar) ||
         !hasOperators) {
        return;
    }
    const result = this.calculate();

    if (result === "Error") {
        this.display.textContent = result;
        return;
    }

    const formattedResult = Number(result.toFixed(10));

    if (String(formattedResult).length > 10) {
        this.display.textContent = formattedResult.toExponential(4);
        return;
    }

    this.display.textContent = formattedResult;
}

Calculator.prototype.handleKeyPress = function(e) {
    const btn = e.target.closest('button');
    if(!btn) return;

    const {number, action} = btn.dataset

    if(number !== undefined) {
        this.appendToDisplay(number);
        return
    }

    if(action in this.actionValues) {
        this.appendToDisplay(this.actionValues[action]);
        return
    }

    if (action === "delete") this.display.textContent = this.display.textContent.slice(0, -1);
    if (action === "reset") this.display.textContent = "";
    if (action === "equals") this.handleEquals();

}


// event listeners
buttons.addEventListener('click', calculator.handleKeyPress.bind(calculator));
themeToggle.addEventListener('click', handleThemeChange);


function handleThemeChange(e) {
    const activeSpan = e.target.closest('span');
    if(!activeSpan) return;

   const theme = activeSpan.dataset.theme;

   document.body.setAttribute('data-theme', theme);
   toggleCircle.className = `toggle-circle pos-${theme}`;

    themeSpans.forEach(s => s.classList.remove('active'));
    activeSpan.classList.add('active');
}




