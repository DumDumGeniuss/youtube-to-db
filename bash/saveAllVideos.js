const youtubeApi = require('../libs/youtubeApi');
const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
const moment = require('moment');

/* get all videos from a channel, but it may contains lots of videos, so we may query lots of times */
async function getAllChannelVideos(channelId, date) {
	let videos = [];
	let nextToken;
	const result = await youtubeApi.getChannelVideos(channelId, '', date);
	nextToken = result.nextPageToken;
	videos = videos.concat(result.items);
	while (nextToken) {
		let nextResult = await youtubeApi.getChannelVideos(channelId, nextToken, date);
		nextToken = nextResult.nextPageToken;
		videos = videos.concat(nextResult.items);
	}
	return videos;
}

/* Enter an array of video ids, and get all of then from youtube  */
async function getAllVideos(ids) {
	const splittedIds = tinyHelper.splitArray(ids, 50);
	let videos = [];
	for (let i = 0; i < splittedIds.length; i++) {
		const nextVideos = await youtubeApi.getVideos(splittedIds[i]);
		videos = videos.concat(nextVideos);	
	}
	return videos;
}

async function saveAllVideosInfo(targetId, onlyToday) {
  /* Wait for mongodb connection */
  const mongoConnection = await mongoHelper.getConnection();

  let channelIds;

  if (targetId) {
    channelIds = [targetId];
  } else {
    channelIds = await mongoHelper.getChannelIds();
  }

  /* Find all videos after a date */
  const startDate = onlyToday? moment(new Date()).utc().add(-1, 'days').format() : null;

  /* Because each channel has lots of videos, so we separate it */
	channelIds.forEach(async function (channelId) {
		const channelVideos = await getAllChannelVideos(channelId, startDate);
		const videoIds = [];
		const channelVideosMap = {};
		channelVideos.forEach((item) => {
			videoIds.push(item.id.videoId);
		});

		/* We get all videos from channel, but still want their statistics */
		const videos = await getAllVideos(videoIds);
		const finalVideos = [];
		videos.forEach((video) => {
      if (video) {
        finalVideos.push(tinyHelper.encryptVideoInfo(video));
      }
		});

    console.log(finalVideos.length);

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
	});
}

module.exports = saveAllVideosInfo;

// saveAllVideosInfo(argv.channelId, argv.onlyToday);
