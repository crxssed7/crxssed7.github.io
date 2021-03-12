function changeColor() {
    // Get the random values
    let r = Math.floor((Math.random() * 255) + 1);
    let g = Math.floor((Math.random() * 255) + 1);
    let b = Math.floor((Math.random() * 255) + 1);
    console.log(r + ", " + g + ", " + b)
    // Get the element to recolor
    document.body.style = "background-color: rgb(" + r + ", " + g + ", " + b + ");"
    document.getElementById("values").innerHTML = "rgb(" + r + ", " + g + ", " + b + ");"
}