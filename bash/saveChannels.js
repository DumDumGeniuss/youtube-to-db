const youtubeApi = require('./youtubeApi');
const firebaseTool = require('./firebaseTool');

const database = firebaseTool.getDatabaseConnection();

/* Split big array to lots of arrays */
function splitArray(array, count) {
  const final = [];
  const arraySize = array.length;
  let newArray = [];
  for (let i = 0; i < arraySize; i++) {
    if (i % count === 0 && i !== 0) {
      final.push(newArray);
      newArray = [];
    }
    newArray.push(array[i]);
  }
  final.push(newArray);
  return final;
}

function encryptChannelInfo(item) {
  return {
    etag: item.etag,
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    defaultThumbnails: item.snippet.thumbnails.default.url,
    mediumThumbnails: item.snippet.thumbnails.medium.url,
    highThumbnails: item.snippet.thumbnails.high.url,
    viewCount: item.statistics.viewCount,
    commentCount: item.statistics.commentCount,
    subscriberCount: item.statistics.subscriberCount,
    videoCount: item.statistics.videoCount,
  }
}

async function saveChannelsInfo(database) {
  /* Get all youtube channels' id */
  const youtubers = await firebaseTool.getAllYoutubers(database);

  /* We can query limited number of channels, so you cut it it pieces */
  /* e.x:  [1,2,3,4,5] => [[1,2],[3,4],[5]] */
  const splittedYoutubers = splitArray(youtubers, 5);

  const getChannelsPromises = [];
  splittedYoutubers.forEach((item) => {
    getChannelsPromises.push(youtubeApi.getChannels(['statistics', 'snippet'], item));
  });

  /* Each result even contains lots of results, so we do loop twice */
  const resFromChannelPromises = await Promise.all(getChannelsPromises);
  const channels = [];
  resFromChannelPromises.forEach((channelItems) => {
    channelItems.forEach((channelItem) => {
      channels.push(encryptChannelInfo(channelItem));
    });
  });

  firebaseTool.savingAllChannels(database, channels);

  firebaseTool.closeConnectionAfterSecs(database, 10);
}

saveChannelsInfo(database);
