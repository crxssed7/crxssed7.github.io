var rawFile = new XMLHttpRequest();
let text = "";
rawFile.open("GET", "QUOTES.txt", false);
rawFile.onreadystatechange = function ()
{
    if(rawFile.readyState === 4)
    {
        if(rawFile.status === 200 || rawFile.status == 0)
        {
            text = rawFile.responseText;
        }
    }
}
rawFile.send(null);
let array = text.split('\n');

function generate() {
    let rand = Math.floor((Math.random() * array.length) + 0);
    document.getElementById("quote").innerHTML = array[rand];
}