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
one.addEventListener('click', () => display.textContent += "1");
two.addEventListener('click', () => display.textContent += "2");
three.addEventListener('click', () => display.textContent += "3");
four.addEventListener('click', () => display.textContent += "4");
five.addEventListener('click', () => display.textContent += "5");
six.addEventListener('click', () => display.textContent += "6");
seven.addEventListener('click', () => display.textContent += "7");
eight.addEventListener('click', () => display.textContent += "8");
nine.addEventListener('click', () => display.textContent += "9");
zero.addEventListener('click', () => display.textContent += "0");
dot.addEventListener('click', () => display.textContent += ".");
multiply.addEventListener('click', () => display.textContent += "*");
divide.addEventListener('click', () => display.textContent += "/");
plus.addEventListener('click', () => display.textContent += "+");
minus.addEventListener('click', () => display.textContent += "-");
// check
equal.addEventListener('click', calculate);
// chek
reset.addEventListener('click', () => display.textContent = "");
// check
del.addEventListener('click', () => display.textContent = display.textContent.slice(0, -1));



function calculate() {
    const input = display.textContent;
    if(input.includes("+")) {
        const values = input.split("+");
        return Number(values[0]) + Number(values[1]);
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