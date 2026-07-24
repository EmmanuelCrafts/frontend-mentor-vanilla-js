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

equal.addEventListener('click', () => {
    const result = calculate();
    display.textContent = result.toFixed(2);
});
reset.addEventListener('click', () => display.textContent = "");
// check
del.addEventListener('click', () => display.textContent = display.textContent.slice(0, -1));


function appendToDisplay(value) {
    if(display.textContent.length < 10) {
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
        return Number(values[0]) / Number(values[1]);
    }
}

