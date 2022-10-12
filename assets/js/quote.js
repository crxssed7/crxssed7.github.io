const quotes = [
    "Ooohhhhhhhhh!!!!!^- Regular Show",
    "I'm Pickle Rickkk!!!!^- Rick, Rick and Morty",
    "Bazinga!^- Sheldon Cooper, The Big Bang Theory",
    "I am the danger, I am the one who knocks.^- Walter White, Breaking Bad",
    "You shall not pass!^- The Lord of the Rings",
    "Wubalubadubdub!^- Rick, Rick and Morty",
    "D'oh!^- Homer Simpson, The Simpsons",
    "Cool cool cool cool cool cool cool cool.^- Jake Peralta, Brooklyn Nine-Nine",
    "We're all goofy goobers yeah!^- Spongebob, Spongebob Square Pants",
    "That's what she said.^- Michael Scott, The Office (US)",
    "Oh my God, they killed Kenny!^- South Park",
    "Oh my God, its happening. Everybody stay calm!^- Michael Scott, The Office (US)",
    "Oh hello, Jackie!^- Jim Bell, Friday Night Dinner",
    "I'm gonna wreck it!^- Ralph, Wreck-it Ralph",
    "Jolly good show!^- Pops, Regular Show",
    "Hamboninggggggg!^- Rigby, Regular Show",
    "You were the chosen one!^- Obi-Wan Kenobi, Star Wars",
    "ARE YOU WILLING TO FIGHT?!^- Parzival, Ready Player One",
    "Going outside is highly overrated^- Anorak, Ready Player One",
    "Dude, am I in the frame?^- Soos, Gravity Falls",
    "Bacon Pancakes, making Bacon Pancakes!^- Jake, Adventure Time",
    "This is the way.^- Din Djarin, The Mandalorian",
    "YUMYAN OWNS YOU ALL!^- Yumyan, Kipo and the age of Wonderbeasts",
    "Here's to another lousy millennium 🍻^- Phillip J Fry, Futurama",
    "You were my brother Anakin!^- Obi-Wan Kenobi, Star Wars",
    "It's over Anakin, I have the high ground!^- Obi-Wan Kenobi, Star Wars",
    "General Kenobi!!!!^- General Grievous, Star Wars",
    "Be careful what you wish for, Parker^- Dr. Strange, Spider-Man: No Way Home",
    "I am inevitable^- Thanos, Avengers: Endgame",
    "I, am Iron Man^- Tony Stark, Avengers: Endgame",
    "Things used to be awesome, but now they're kinda terrifying^- Wade Watts, Ready Player One"
];

const quoteEl = document.getElementById("quote");
const quoteAuthoEl = document.getElementById("quote-author");

var rnd = Math.floor(Math.random() * quotes.length);

quoteEl.innerText = quotes[rnd].split('^')[0];
quoteAuthoEl.innerText = quotes[rnd].split('^')[1];