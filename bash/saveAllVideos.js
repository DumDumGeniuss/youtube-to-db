const youtubeApi = require('../libs/youtubeApi');
const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
const moment = require('moment');

async function saveAllVideosInfo(targetId, onlyThisMonth, sort) {

  try {
    /* Wait for mongodb connection */
    const mongoConnection = await mongoHelper.getConnection();

    /* Get video categories from youtube */
    const videoCategories = await youtubeApi.getVideoCategories();
    const videoCategoriesMap = {};
    videoCategories.forEach((videoCategorie) => {
      videoCategoriesMap[videoCategorie.id] = videoCategorie.snippet.title;
    });
  
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
      getAllVideosPromises.push(youtubeApi.getAllChannelVideos(channelId, startDate, sort));
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
    const videos = await youtubeApi.getAllVideos(videoIds);
    const finalVideos = [];
    videos.forEach((video) => {
      if (video) {
        const newVideo = tinyHelper.encryptVideoInfo(video);
        newVideo.category = videoCategoriesMap[newVideo.categoryId];
        finalVideos.push(newVideo);
      }
    });
    // console.log(videoIds);
  
    // console.log(finalVideos.length);
    // console.log(finalVideos);
  
    /* Use this index to check if all the promises done */
    let checkSaveEndIndex = 0;
    const saveFinalVideoPromises = [];
    finalVideos.forEach((finalVideo) => {
      saveFinalVideoPromises.push(mongoHelper.saveVideo(finalVideo));
    });
    await Promise.all(saveFinalVideoPromises);
    mongoConnection.close();
    
    return 'ok';

  } catch (e) {
    console.log(e);
  }
}

module.exports = saveAllVideosInfo;

// saveAllVideosInfo(argv.channelId, argv.onlyToday);
