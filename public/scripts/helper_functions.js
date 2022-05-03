/**
 * this functions for update student template page
 * in order to highlight the selected value of 'Toar'
 * on page load
 */
function selectedOption() {
    let toar = document.getElementById("toar");
    for (let i = 1; i < toar.length; i++) {
        if (toar.options[i].value == toar.options[0].value) {
            toar.options[i].selected = true;
        }
    }
}



