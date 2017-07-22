const youtubeApi = require('../libs/youtubeApi');
const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
const moment = require('moment');

/* get all videos from a channel, but it may contains lots of videos, so we may query lots of times */
async function getAllChannelVideos(channelId, date, sort) {
	let videos = [];
	let nextToken;
	const result = await youtubeApi.getChannelVideos(channelId, '', date, sort);
	nextToken = result.nextPageToken;
	videos = videos.concat(result.items);
  /* We just get the firt 50 results */
	// while (nextToken) {
	// 	let nextResult = await youtubeApi.getChannelVideos(channelId, nextToken, date, sort);
	// 	nextToken = nextResult.nextPageToken;
	// 	videos = videos.concat(nextResult.items);
	// }
	return videos;
}

/* Enter an array of video ids, and get all of then from youtube  */
async function getAllVideos(videoIds) {
	const manyVideoIds = tinyHelper.splitArray(videoIds, 50);
	let resVideos = [];
  let getVideosPromises = [];
  manyVideoIds.forEach((ids) => {
    getVideosPromises.push(youtubeApi.getVideos(ids));
  });
  let resFromGetVideosPromises = await Promise.all(getVideosPromises);
  resFromGetVideosPromises.forEach((videos) => {
    resVideos = resVideos.concat(videos);
  });

  return resVideos;
}

async function saveAllVideosInfo(targetId, onlyThisMonth, sort) {

  try {
    /* Wait for mongodb connection */
    const mongoConnection = await mongoHelper.getConnection();
  
    let channelIds;
  
    if (targetId) {
      channelIds = [targetId];
    } else {
      channelIds = await mongoHelper.getChannelIds();
    }
  
    /* Find all videos after a date */
    const startDate = onlyThisMonth? moment(new Date()).utc().add(-1, 'months').format() : null;
  
    /* For test */
    // channelIds = ['UC9RyS1FHuKR5C1A0vC6F55w'];
  
    const getAllVideosPromises = [];
    const videoIds = [];
  
    /* Use all channelIds to get all videos of those channelIds */
    channelIds.forEach((channelId) => {
      getAllVideosPromises.push(getAllChannelVideos(channelId, startDate, sort));
    });

    const resFromGetAllVideosPromises = await Promise.all(getAllVideosPromises);

    resFromGetAllVideosPromises.forEach((channelVideos) => {
      channelVideos.forEach((item) => {
        if (item) {
          videoIds.push(item.id.videoId);
        }
      });
    });
  
    console.log('total videos:' + videoIds.length);
  
    /* We get all videos from channel, but still want their statistics */
    const videos = await getAllVideos(videoIds);
    const finalVideos = [];
    videos.forEach((video) => {
      if (video) {
        finalVideos.push(tinyHelper.encryptVideoInfo(video));
      }
    });
    // console.log(videoIds);
  
    // console.log(finalVideos.length);
    // console.log(finalVideos);
  
    /* Use this index to check if all the promises done */
    let checkSaveEndIndex = 0;
    const finalVideosSize = finalVideos.length;
    finalVideos.forEach(async function (video) {
      await mongoHelper.saveVideo(video);
      checkSaveEndIndex += 1;
      if (checkSaveEndIndex === finalVideosSize) {
        mongoConnection.close();
      }
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = saveAllVideosInfo;

// saveAllVideosInfo(argv.channelId, argv.onlyToday);
