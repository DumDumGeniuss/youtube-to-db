const mongoHelper = require('../libs/mongoHelper');
const tinyHelper = require('../libs/tinyHelper');

async function determineChannelCategories() {
  try {
    /* Wait for mongodb connection */
    const mongoConnection = await mongoHelper.getConnection();

    const channelIds = await mongoHelper.getChannelIds();

    let checkEndIndex = 0;
    const channelIdsSize = channelIds.length;
    channelIds.forEach(async function (channelId) {
      try {
        const videos = await mongoHelper.getVideos(channelId, 'date', 50, 'desc');
        const category = tinyHelper.getMostFrequentParams(videos, 'category');
        const channelToUpdate = {
          _id: channelId,
          category: category,
        }
        await mongoHelper.saveChannel(channelToUpdate);
        checkEndIndex += 1;
        if (checkEndIndex === channelIdsSize) {
          mongoConnection.close();
        }
      } catch (e) {
        console.log(e);
      }
    });
    // await Promise.all(determineChannelTypePromises);
  } catch (e) {
    console.log(e);
  }
}

module.exports = determineChannelCategories;
