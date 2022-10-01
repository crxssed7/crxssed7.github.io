var query = `
{
    MediaListCollection(userName: "crxssed", type: MANGA, sort: UPDATED_TIME_DESC) {
      user {
        id
        name
      }
      lists {
        name
        isCustomList
        isSplitCompletedList
        status
        name
        entries {
          id
          progress
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
    }
  }
`;

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
    var completed = data["data"]["MediaListCollection"]["lists"].find(obj => {
        return obj.name === "Completed"
    })["entries"];
    var reading = data["data"]["MediaListCollection"]["lists"].find(obj => {
        return obj.name === "Reading"
    })["entries"];
    var planning = data["data"]["MediaListCollection"]["lists"].find(obj => {
        return obj.name === "Planning"
    })["entries"];

    var readingEl = document.getElementById('reading');
    var completedEl = document.getElementById('completed');
    var plannedEl = document.getElementById('planned');

    reading.map((e) => {
        var startedAt = e['startedAt'];
        var startedAtString = '';
        if (startedAt['year']) {
            var d = generateDate(Number(startedAt['year']), Number(startedAt['month']), Number(startedAt['day']));
            startedAtString = `Started: ${d}`
        }

        var progress = e['progress'];
        var chapters = e['media']['chapters'];
        var max = 0;
        if (chapters == null || chapters == undefined) {
            chapters = '?';
            max = progress;
        } else {
            max = Number(chapters);
        }

        var percentage = (progress / max) * 100;

        var color = e['media']['coverImage']['color'];
        if (color == null || color == undefined) {
            color = 'grey';
        }

        var chapterName = e['media']['title']['english']
        if (chapterName == null || chapterName == undefined) {
            chapterName = e['media']['title']['romaji'];
        }

        var html = `
        <div class="entry" style="border-color: ${color};">
            <div class="flex">
                <div class="entry-img" style="background-image: url('${e['media']['coverImage']['medium']}');">
                </div>
                <div class="entry-content">
                    <div class="entry-name">
                        <h5>${chapterName}</h5>
                    </div>
                    <div>
                        <p style="margin-bottom: 0px;"><small>${startedAtString}</small></p>
                        <p style="margin-bottom: 0px;"><small>${progress} / ${chapters}</small></p>
                        <div class="progress" style="height: 5px;">
                            <div class="progress-bar" role="progressbar" style="width: ${percentage}%; background-color: ${color};" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="${max}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        readingEl.innerHTML += html;
    })

    completed.map((e) => {
        var completedAt = e['completedAt'];
        var completedAtString = '';
        if (completedAt['year']) {
            var d = generateDate(Number(completedAt['year']), Number(completedAt['month']), Number(completedAt['day']));
            completedAtString = `Completed: ${d}`
        }

        var chapters = e['media']['chapters'];
        if (chapters == null || chapters == undefined) {
            chapters = '?';
        }

        var color = e['media']['coverImage']['color'];
        if (color == null || color == undefined) {
            color = 'whitesmoke';
        }

        var chapterName = e['media']['title']['english']
        if (chapterName == null || chapterName == undefined) {
            chapterName = e['media']['title']['romaji'];
        }

        var html = `
        <div class="entry" style="border-color: ${color};">
            <div class="flex">
                <div class="entry-img"
                    style="background-image: url('${e['media']['coverImage']['medium']}');">
                </div>
                <div class="entry-content">
                    <div class="entry-name">
                        <h5>${chapterName}</h5>
                    </div>
                    <p style="margin-bottom: 0px;"><small>${completedAtString}</small></p>
                    <p style="margin-bottom: 0px;"><small>${e['progress']} / ${chapters}</small></p>
                </div>
            </div>
        </div>`;

        completedEl.innerHTML += html;
    })

    planning.map((e) => {
        var chapters = e['media']['chapters'];
        if (chapters == null || chapters == undefined) {
            chapters = '?';
        }

        var color = e['media']['coverImage']['color'];
        if (color == null || color == undefined) {
            color = 'whitesmoke';
        }

        var chapterName = e['media']['title']['english']
        if (chapterName == null || chapterName == undefined) {
            chapterName = e['media']['title']['romaji'];
        }

        var html = `
        <div class="entry" style="border-color: ${color};">
            <div class="flex">
                <div class="entry-img"
                    style="background-image: url('${e['media']['coverImage']['medium']}');">
                </div>
                <div class="entry-content">
                    <div class="entry-name">
                        <h5>${chapterName}</h5>
                    </div>
                    <p style="margin-bottom: 0px;"><small>${e['progress']} / ${chapters}</small></p>
                </div>
            </div>
        </div>`;

        plannedEl.innerHTML += html;
    })
}

function handleError(error) {
    // alert('Error, check console');
    console.error(error);
}

function generateDate(year, month, day) {
    var date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
}
