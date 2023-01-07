var listData = `
lists {
    name
    isCustomList
    isSplitCompletedList
    status
    name
    entries {
      id
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
    progressBarStatuses = ["READING"];
    dateStatuses = ["READING", "COMPLETED"];

    constructor(data, status) {
        this.data = data
        this.status = status
        this.setName()
        this.setProgressAndMaximum()
        this.setColor()
        this.setCoverImage()
    }

    generateNotesHtml() {
        var notes = this.data['notes'];
        var notesStr = '';
        if (notes === null) {
            notesStr = '';
        } else {
            notesStr = `data-bs-toggle="tooltip" data-bs-title='${this.stripSafe(notes)}'`;
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

    setCoverImage() {
        this.coverImage = this.data['media']['coverImage']['medium']
    }

    generateDate(year, month, day) {
        var date = new Date(year, month - 1, day);
        return date.toLocaleDateString();
    }
    
    stripSafe(value) {
        return value.replaceAll('<', '').replaceAll('>', '').replaceAll("'", '&#39;').replaceAll('"', '&#34;');
    }

    buildProgessBar() {
        var val = this.progress;
        var max = this.max;
        if (max === 0) {
            max = 1;
            val = 1
        }

        var percentage = (val / max) * 100;

        return `
    <div class="progress" style="height: 5px;">
        <div class="progress-bar" role="progressbar" style="width: ${percentage}%; background-color: ${this.color};" aria-valuenow="${this.progress}" aria-valuemin="0" aria-valuemax="${this.max}"></div>
    </div>
        `;
    }
    
    toHtml() {
        // Build Progress Bar
        var progressBarHtml = "";
        if (this.progressBarStatuses.includes(this.status.toUpperCase())) {
            progressBarHtml = this.buildProgessBar();
        }
    
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
        
        return `
        <div class="entry" style="border-color: ${this.color};" ${this.generateNotesHtml()}>
            <div class="flex">
                <div class="entry-img" style="background-image: url('${this.coverImage}');">
                </div>
                <div class="entry-content">
                    <div class="entry-name">
                        <h5>${this.name}</h5>
                    </div>
                    <div>
                        ${dateHtml}
                        ${fractionHtml}
                        ${progressBarHtml}
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
    
    var planning = data["data"]["main"]["lists"].find(obj => {
        return obj.name === "Planning"
    })["entries"];

    var collecting = data["data"]["main"]["lists"].find(obj => {
        return obj.name === "Collecting"
    })["entries"];
    var collecting_completed = data["data"]["completed"]["lists"].find(obj => {
        return obj.name === "Collecting"
    })["entries"];
    collecting = collecting.concat(collecting_completed);

    console.log(collecting)

    var read = 0;
    var left = 0;

    var readingEl = document.getElementById('reading');
    var completedEl = document.getElementById('completed');
    var plannedEl = document.getElementById('planned');
    var collectingEl = document.getElementById('collecting');
    var chaptersReadEl = document.getElementById('chapters_read');
    var chaptersLeftEl = document.getElementById('chapters_left');
    var totalEl = document.getElementById('total');
    var avatarEl = document.getElementById('avatar');
    var readingCountEl = document.getElementById('reading_count');
    var completedCountEl = document.getElementById('completed_count');
    var plannedCountEl = document.getElementById('planned_count');
    var collectingCountEl = document.getElementById('collecting_count');

    avatarEl.setAttribute('src', data["data"]["main"]['user']['avatar']['medium']);

    readingCountEl.innerText = reading.length;
    completedCountEl.innerText = completed.length;
    plannedCountEl.innerText = planning.length;
    collectingCountEl.innerText = collecting.length;
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

    collecting.map((e) => {
        var manga = new Manga(e, "COLLECTING");

        left += manga.max;

        var html = manga.toHtml();

        collectingEl.innerHTML += html;
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
