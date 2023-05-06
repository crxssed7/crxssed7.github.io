var listData = `
lists {
    name
    isCustomList
    isSplitCompletedList
    status
    name
    entries {
      id
      priority
      customLists
      progress
      updatedAt
      completedAt {
        year
        month
        day
      }
      startedAt {
        year
        month
        day
      }
      notes
      media {
        id
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        bannerImage
        chapters
      }
    }
  }
`

var query = `
{
    main: MediaListCollection(userName: "crxssed", type: MANGA, status_not: COMPLETED, sort: UPDATED_TIME_DESC) {
      user {
        id
        name
        avatar {
          large
          medium
        }
      }
      ${listData}
    }
    completed: MediaListCollection(userName: "crxssed", type: MANGA, status: COMPLETED, sort: FINISHED_ON_DESC) {
      ${listData}
    }
  }
  
`;

class Manga {
    dateStatuses = ["READING", "COMPLETED", "PAUSED"];

    constructor(data, status) {
        this.data = data
        this.status = status
        this.setName()
        this.setProgressAndMaximum()
        this.setColor()
        this.setImages()
    }

    isCollecting() {
        return this.data['customLists']['Collecting']
    }

    generateNotesHtml() {
        var notes = this.data['notes'];
        var notesStr = '';
        if (notes === null) {
            notesStr = '';
        } else {
            notesStr = `data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title='${this.stripSafe(notes)}'`;
        }
        return notesStr
    }

    generateDateHtml() {
        var output = "";
        switch (this.status) {
            case "READING":
                var startedAt = this.data['startedAt'];
                var startedAtString = "";
                if (startedAt['year']) {
                    var d = this.generateDate(Number(startedAt['year']), Number(startedAt['month']), Number(startedAt['day']));
                    startedAtString = `Started: ${d}`
                }
                output = startedAtString
            break;
            
            case "PAUSED":
                var startedAt = this.data['startedAt'];
                var startedAtString = "";
                if (startedAt['year']) {
                    var d = this.generateDate(Number(startedAt['year']), Number(startedAt['month']), Number(startedAt['day']));
                    startedAtString = `Started: ${d}`
                }
                output = startedAtString
            break;

            case "COMPLETED":
                var completedAt = this.data['completedAt'];
                var completedAtString = "";
                if (completedAt['year']) {
                    var d = this.generateDate(Number(completedAt['year']), Number(completedAt['month']), Number(completedAt['day']));
                    completedAtString = `Completed: ${d}`
                }
                output = completedAtString;
            break;
        }
        return `<p style="margin-bottom: 0px;"><small>${output}</small></p>`
    }

    setProgressAndMaximum() {
        this.progress = Number(this.data['progress']);
        var chapters = this.data['media']['chapters'];
        this.max = Number(chapters);
    }

    setColor() {
        var color = this.data['media']['coverImage']['color'];
        if (color === null || color === undefined) {
            color = '#a0a0a0';
        }
        this.color = color;
    }

    setName() {
        var mangaName = this.data['media']['title']['english']
        if (mangaName === null || mangaName === undefined) {
            mangaName = this.data['media']['title']['romaji'];
        }
        this.name = mangaName;
    }

    setImages() {
        this.coverImage = this.data['media']['coverImage']['medium']
        this.bannerImage = this.data['media']['bannerImage']
    }

    generateDate(year, month, day) {
        var date = new Date(year, month - 1, day);
        return date.toLocaleDateString();
    }
    
    stripSafe(value) {
        return value.replaceAll('<', '').replaceAll('>', '').replaceAll("'", '&#39;').replaceAll('"', '&#34;');
    }
    
    toHtml() {
        // Build Date String
        var dateHtml = ""
        if (this.dateStatuses.includes(this.status.toUpperCase())) {
            dateHtml = this.generateDateHtml()
        }
    
        // Build Fraction String
        var fractionHtml = `<p style="margin-bottom: 0px;"><small>${this.progress} / ${this.max}</small></p>`
        if (this.max === 0) {
            fractionHtml = `<p style="margin-bottom: 0px;"><small>${this.progress} / ?</small></p>`
        }

        // Is this being collected?
        var coll = ""
        if (this.isCollecting() === true) {
            coll = `<i class="bi bi-bookmark-check-fill" title="Collecting"></i>`
        }
        
        return `
        <div class="entry" style="border-color: ${this.color}; background-image: url(${this.bannerImage}); background-color: ${this.color};" ${this.generateNotesHtml()}>
            <div class="flex entry-bg-img">
                <div class="entry-img" style="background-image: url('${this.coverImage}');">
                </div>
                <div class="entry-content">
                    <h5 class="entry-name">${this.name}</h5>
                    <div>
                        ${dateHtml}
                        <div class="d-flex justify-content-between">
                            ${fractionHtml}
                            ${coll}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
}

// Define the config we'll need for our Api request
var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query
        })
    };

// Make the HTTP Api request
fetch(url, options).then(handleResponse)
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

    var readingEl = document.getElementById('reading');
    var completedEl = document.getElementById('completed');
    var plannedEl = document.getElementById('planned');
    var pausedEl = document.getElementById('paused');

    var chaptersReadEl = document.getElementById('chapters_read');
    var chaptersLeftEl = document.getElementById('chapters_left');
    var totalEl = document.getElementById('total');
    var avatarEl = document.getElementById('avatar');

    var readingCountEl = document.getElementById('reading_count');
    var completedCountEl = document.getElementById('completed_count');
    var plannedCountEl = document.getElementById('planned_count');
    var pausedCountEl = document.getElementById('paused_count');

    avatarEl.setAttribute('src', data["data"]["main"]['user']['avatar']['large']);

    readingCountEl.innerText = reading.length;
    completedCountEl.innerText = completed.length;
    plannedCountEl.innerText = planning.length;
    pausedCountEl.innerText = paused.length;
    totalEl.innerText = reading.length + completed.length + planning.length;

    reading.map((e) => {
        var manga = new Manga(e, "READING")

        if (manga.max > 0) {
            left += manga.max - manga.progress;
        }
        read += manga.progress;

        var html = manga.toHtml();

        readingEl.innerHTML += html;
    })

    completed.map((e) => {
        var manga = new Manga(e, "COMPLETED");

        read += manga.progress;

        var html = manga.toHtml();

        completedEl.innerHTML += html;
    })

    planning.map((e) => {
        var manga = new Manga(e, "PLANNED");

        left += manga.max;

        var html = manga.toHtml();

        plannedEl.innerHTML += html;
    })

    paused.map((e) => {
        var manga = new Manga(e, "PAUSED");

        var html = manga.toHtml();
        
        read += manga.progress;

        pausedEl.innerHTML += html;
    })

    chaptersReadEl.innerText = read;
    chaptersLeftEl.innerText = left;

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function handleError(error) {
    // alert('Error, check console');
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
