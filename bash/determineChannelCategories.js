const mongoHelper = require('../libs/mongoHelper');
const tinyHelper = require('../libs/tinyHelper');

async function determineChannelCategories() {
  let mongoConnection;
  try {
    /* Wait for mongodb connection */
    mongoConnection = await mongoHelper.getConnection();

    const channelIds = await mongoHelper.getChannelIds();

    const determineChannelCategoryPromises = [];
    channelIds.forEach((channelId) => {
      determineChannelCategoryPromises.push(async function() {
        const videos = await mongoHelper.getVideos(channelId, 'date', 50, 'desc');
        const category = tinyHelper.getMostFrequentParams(videos, 'category');
        const channelToUpdate = {
          _id: channelId,
          category: category,
        }
        await mongoHelper.saveChannel(channelToUpdate);
        return 'finish ' + channelId;
      }());
    });
    await Promise.all(determineChannelCategoryPromises);

    /* Job finish */
    mongoConnection.close();
    console.log('finish determining channel category');
    return 'ok';
  } catch (e) {
    if (mongoConnection) {
      mongoConnection.close();
    }
    throw e;
  }
}

module.exports = determineChannelCategories;
