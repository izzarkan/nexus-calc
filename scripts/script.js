const display = document.getElementById("display");
const buttons = document.querySelectorAll(".button button");

const operators = ['+', '-', '*', '/', '%', '÷', '×'];

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.textContent;
        const current = display.value;
        const lastChar = current.slice(-1);

        if (value === "C") {
            display.value = "";
        } else if (value === "←") {
            display.value = current.slice(0, -1);
        } else if (value === "=") {
            try {
                let expression = current
                    .replace(/÷/g, '/')
                    .replace(/×/g, '*');
                display.value = eval(expression);
            } catch {
                display.value = "Error";
            }
        } else if (operators.includes(value)) {
            if (current === "" && value !== "-") return;
            if (operators.includes(lastChar)) return;
            display.value += value;
        } else if (value === ".") {
            const lastNumber = current.split(/[\+\-\*\/÷×%]/).pop();

            // Automatically add 0 before the decimal if needed
            if (current === "" || operators.includes(lastChar)) {
                display.value += "0"; // Add 0 before decimal
            }

            // Prevent multiple decimals in the same number
            if (lastNumber.includes(".")) return;

            display.value += value;
        } else {
            display.value += value;
        }
    });
});
document.addEventListener("keydown", (e) => {
    const key = e.key;

    // Prevent default action for specific keys (like arrow keys, F1-F12, etc.)
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].includes(key)) {
        e.preventDefault();
    }

    // Map keys to calculator functions
    if (key >= 0 && key <= 9) {
        display.value += key; // Numbers 0-9
    } else if (key === "+" || key === "-" || key === "*" || key === "/" || key === "÷" || key === "×") {
        const current = display.value;
        const lastChar = current.slice(-1);
        
        // Prevent entering two operators in a row
        if (current === "" && key !== "-") return;
        if (operators.includes(lastChar)) return;
        
        display.value += key;
    } else if (key === ".") {
        const current = display.value;
        const lastNumber = current.split(/[\+\-\*\/÷×%]/).pop();

        // Automatically add 0 before the decimal if needed
        if (current === "" || operators.includes(current.slice(-1))) {
            display.value += "0"; // Add 0 before decimal
        }

        // Prevent multiple decimals in the same number
        if (lastNumber.includes(".")) return;

        display.value += key;
    } else if (key === "Enter") {
        // Handle calculation logic for "Enter" key (equals)
        try {
            let expression = display.value
                .replace(/÷/g, '/')
                .replace(/×/g, '*');
            display.value = eval(expression);
        } catch {
            display.value = "Error";
        }
    } else if (key === "Escape") {
        // Clear the display with "Esc" key
        display.value = ""; // Clear
    } else if (key === "Backspace" || key === "←") {
        // Backspace behavior
        display.value = display.value.slice(0, -1); // Backspace
    }
});

// Time conversion function
function convertTime(value, fromUnit, toUnit) {
    const timeUnitsInSeconds = {
        seconds: 1,
        minutes: 60,
        hours: 3600,
        days: 86400,
        months: 2628000,
        years: 31556952
    };

    // Convert the input value to seconds
    let valueInSeconds = value * timeUnitsInSeconds[fromUnit];

    // Convert from seconds to the target unit
    return valueInSeconds / timeUnitsInSeconds[toUnit];
}

function convertLength(value, fromUnit, toUnit) {
    const lengthUnitsInMeters = {
        millimeters: 0.001,
        centimeters: 0.01,
        meters: 1,
        kilometers: 1000,
        inches: 0.0254,
        feet: 0.3048,
        yards: 0.9144,
        miles: 1609.34
    };

    // Convert the input value to meters
    let valueInMeters = value * lengthUnitsInMeters[fromUnit];

    // Convert from meters to the target unit
    return valueInMeters / lengthUnitsInMeters[toUnit];
}

// Modal open/close functionality
const modal = document.getElementById("conversion-modal");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModal = document.getElementById("close-modal");

// Open the modal
openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex"; // Show the modal
});

// Close the modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none"; // Hide the modal
});

// Close the modal when clicking outside of it
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Conversion functionality
const conversionTypeSelect = document.getElementById('conversion-type');
const unitFromSelect = document.getElementById('unit-from');
const unitToSelect = document.getElementById('unit-to');

// Unit lists
const unitOptions = {
    time: ["seconds", "minutes", "hours", "days", "months", "years"],
    length: [
        "millimeters", "centimeters", "meters", "kilometers",
        "inches", "feet", "yards", "miles"
    ]
};

// Function to populate units dynamically
function populateUnits(type) {
    unitFromSelect.innerHTML = '';
    unitToSelect.innerHTML = '';

    if (type === 'length') {
        const metricUnits = ["millimeters", "centimeters", "meters", "kilometers"];
        const imperialUnits = ["inches", "feet", "yards", "miles"];

        const metricGroupFrom = document.createElement('optgroup');
        metricGroupFrom.label = "Metric";
        const imperialGroupFrom = document.createElement('optgroup');
        imperialGroupFrom.label = "Imperial";

        const metricGroupTo = document.createElement('optgroup');
        metricGroupTo.label = "Metric";
        const imperialGroupTo = document.createElement('optgroup');
        imperialGroupTo.label = "Imperial";

        metricUnits.forEach(unit => {
            const opt1 = document.createElement('option');
            const opt2 = document.createElement('option');
            opt1.value = opt2.value = unit;
            opt1.textContent = opt2.textContent = unit;
            metricGroupFrom.appendChild(opt1);
            metricGroupTo.appendChild(opt2);
        });

        imperialUnits.forEach(unit => {
            const opt1 = document.createElement('option');
            const opt2 = document.createElement('option');
            opt1.value = opt2.value = unit;
            opt1.textContent = opt2.textContent = unit;
            imperialGroupFrom.appendChild(opt1);
            imperialGroupTo.appendChild(opt2);
        });

        unitFromSelect.appendChild(metricGroupFrom);
        unitFromSelect.appendChild(imperialGroupFrom);
        unitToSelect.appendChild(metricGroupTo);
        unitToSelect.appendChild(imperialGroupTo);
    } else {
        unitOptions[type].forEach(unit => {
            const opt1 = document.createElement('option');
            const opt2 = document.createElement('option');
            opt1.value = opt2.value = unit;
            opt1.textContent = opt2.textContent = unit;
            unitFromSelect.appendChild(opt1);
            unitToSelect.appendChild(opt2);
        });
    }
}


// Populate units on page load
populateUnits(conversionTypeSelect.value);

// When conversion type changes (time ↔ length)
conversionTypeSelect.addEventListener('change', () => {
    populateUnits(conversionTypeSelect.value);
});

// Conversion button
document.getElementById('convert-btn').addEventListener('click', () => {
    const type = conversionTypeSelect.value;
    const value = parseFloat(document.getElementById('convert-value').value);
    const fromUnit = unitFromSelect.value;
    const toUnit = unitToSelect.value;

    if (isNaN(value)) {
        document.getElementById('conversion-result').value = "Invalid input";
        return;
    }

    let result;
    if (type === 'time') {
        result = convertTime(value, fromUnit, toUnit);
    } else if (type === 'length') {
        result = convertLength(value, fromUnit, toUnit);
    }

    document.getElementById('conversion-result').value = result.toFixed(4);
});
