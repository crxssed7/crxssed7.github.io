const listData = `
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
      score
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

const query = `
{
    main: MediaListCollection(userName: "crxssed", type: MANGA, status_not: COMPLETED, sort: UPDATED_TIME_DESC) {
      ${listData}
    }
    completed: MediaListCollection(userName: "crxssed", type: MANGA, status: COMPLETED, sort: FINISHED_ON_DESC) {
      ${listData}
    }
    User(name: "crxssed") {
        id
        name
        avatar {
          large
          medium
        }
        favourites {
          manga {
            nodes {
              id
            }
          }
        }
      }
  }
`;

export const url = 'https://graphql.anilist.co';

export const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    body: JSON.stringify({
        query: query
    })
};
