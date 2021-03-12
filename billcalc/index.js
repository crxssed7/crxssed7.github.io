function calculate() {
    // Calculate the values inputted
    if (document.getElementById("moneySpent").value && document.getElementById("sharedBy").value && document.getElementById("tip").value) {
        let moneySpent = parseInt(document.getElementById("moneySpent").value)
        let sharedBy = parseInt(document.getElementById("sharedBy").value)
        let tip = parseInt(document.getElementById("tip").value)

        if (sharedBy > 0) {
            let amountForEachPerson = (moneySpent + tip) / sharedBy

            document.getElementById("answer").innerHTML = "The amount each person has to pay is £" + amountForEachPerson
        }
        else {
            document.getElementById("answer").innerHTML = "Amount of people must be greater than one."
        }
    }
    else {
        document.getElementById("answer").innerHTML = "You must specify an amount for all values (use 0 for none)"
    }
}