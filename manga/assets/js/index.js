import { Manga } from "./manga.js";
import { url, options } from "./helpers/anilist.js";

fetch(url, options)
    .then(handleResponse)
    .then(handleData)
    .catch(handleError);

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    var completed = data["data"]["completed"]["lists"].find(obj => {
        return obj.name === "Completed"
    })["entries"];

    var reading = data["data"]["main"]["lists"].find(obj => {
        return obj.name === "Reading"
    })["entries"];

    var paused = data["data"]["main"]["lists"].find(obj => {
        return obj.name === "Paused"
    })["entries"];

    var planning = data["data"]["main"]["lists"].find(obj => {
        return obj.name === "Planning"
    })["entries"];
    planning.sort(function(a, b) {
        return a.priority - b.priority
    });
    planning = planning.reverse();

    var read = 0;
    var left = 0;

    const readingEl = document.getElementById('reading');
    const completedEl = document.getElementById('completed');
    const plannedEl = document.getElementById('planned');
    const pausedEl = document.getElementById('paused');

    const chaptersReadEl = document.getElementById('chapters_read');
    const chaptersLeftEl = document.getElementById('chapters_left');
    const totalEl = document.getElementById('total');
    const avatarEl = document.getElementById('avatar');

    const readingCountEl = document.getElementById('reading_count');
    const completedCountEl = document.getElementById('completed_count');
    const plannedCountEl = document.getElementById('planned_count');
    const pausedCountEl = document.getElementById('paused_count');

    const user = data["data"]["User"]
    avatarEl.setAttribute('src', user['avatar']['large']);
    const favourites = user["favourites"]["manga"]["nodes"].map(f => f["id"]);

    readingCountEl.innerText = reading.length;
    completedCountEl.innerText = completed.length;
    plannedCountEl.innerText = planning.length;
    pausedCountEl.innerText = paused.length;
    totalEl.innerText = reading.length + completed.length + planning.length;

    reading.forEach((e) => {
        var manga = new Manga(e, "READING", favourites.includes(e["media"]["id"]));

        if (manga.max > 0) {
            left += manga.max - manga.progress;
        }
        read += manga.progress;

        readingEl.appendChild(manga.toHtml());
    })

    completed.forEach((e) => {
        var manga = new Manga(e, "COMPLETED", favourites.includes(e["media"]["id"]));

        read += manga.progress;

        completedEl.appendChild(manga.toHtml());
    })

    planning.forEach((e) => {
        var manga = new Manga(e, "PLANNED", favourites.includes(e["media"]["id"]));

        left += manga.max;

        plannedEl.appendChild(manga.toHtml());
    })

    paused.forEach((e) => {
        var manga = new Manga(e, "PAUSED", favourites.includes(e["media"]["id"]));

        read += manga.progress;

        pausedEl.appendChild(manga.toHtml());
    })

    chaptersReadEl.innerText = read;
    chaptersLeftEl.innerText = left;
}

function handleError(error) {
    console.error(error);
}

const toTop = document.getElementById('link-to-top');
toTop.hidden = true;

document.addEventListener("scroll", (event) => {
    let lastKnownScrollPosition = window.scrollY;
    const threshold = 100;

    if (lastKnownScrollPosition > threshold) {
        toTop.hidden = false;
    } else if (lastKnownScrollPosition < threshold) {
        toTop.hidden = true;
    }
})
