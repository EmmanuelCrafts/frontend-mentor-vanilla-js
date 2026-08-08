const one = document.querySelector('.one');
const two = document.querySelector('.two');
const three = document.querySelector('.three');
const four = document.querySelector('.four');
const five = document.querySelector('.five');
const six = document.querySelector('.six');
const seven = document.querySelector('.seven');
const eight = document.querySelector('.eight');
const nine = document.querySelector('.nine');
const zero = document.querySelector('.zero');
const dot = document.querySelector('.dot');
const plus = document.querySelector('.plus');
const minus = document.querySelector('.minus');
const multiply = document.querySelector('.multiply');
const divide = document.querySelector('.divide');
const equal = document.querySelector('.equal');
const reset = document.querySelector('.reset');
const del = document.querySelector('.DEL');
const display = document.querySelector('.display-value');

// number buttons
one.addEventListener('click', () => appendToDisplay("1"));
two.addEventListener('click', () => appendToDisplay("2"));
three.addEventListener('click', () => appendToDisplay("3"));
four.addEventListener('click', () => appendToDisplay("4"));
five.addEventListener('click', () => appendToDisplay("5"));
six.addEventListener('click', () => appendToDisplay ("6"));
seven.addEventListener('click', () => appendToDisplay ("7"));
eight.addEventListener('click', () => appendToDisplay ("8"));
nine.addEventListener('click', () => appendToDisplay ("9"));
zero.addEventListener('click', () => appendToDisplay ("0"));
dot.addEventListener('click', () => appendToDisplay ("."));


// operator buttons
plus.addEventListener('click', () => appendToDisplay ("+"));
minus.addEventListener('click', () => appendToDisplay ("-"));
multiply.addEventListener('click', () => appendToDisplay ("*"));
divide.addEventListener('click', () => appendToDisplay ("/"));
reset.addEventListener('click', () => display.textContent = "");
del.addEventListener('click', () => display.textContent = display.textContent.slice(0, -1));


equal.addEventListener('click', () => {
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
});


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




