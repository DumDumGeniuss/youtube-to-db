const mongoHelper = require('../libs/mongoHelper');
const tinyHelper = require('../libs/tinyHelper');

async function deleteSingleChannel(channelId) {
  let mongoConnection;
  try {
    if (!channelId) {
      throw 'please input channel Id';
    }
    /* Wait for mongodb connection */
    mongoConnection = await mongoHelper.getConnection();

    await mongoHelper.deleteChannel(channelId);
    await mongoHelper.deleteChannelStatistics(channelId);
    await mongoHelper.deleteChannelVideos(channelId);
    await mongoHelper.deleteCandidateChannel(channelId);

    /* Job finish */
    mongoConnection.close();
    console.log('finish delete single channel');
    return 'ok';
  } catch (e) {
    if (mongoConnection) {
      mongoConnection.close();
    }
    throw e;
  }
}

module.exports = deleteSingleChannel;
