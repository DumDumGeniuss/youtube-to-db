const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
const moment = require('moment-timezone');
const youtubeApi = require('../libs/youtubeApi');

async function saveChannelPageInfos() {
  let mongoConnection;
  try {
    /* Wait for mongodb connection */
    mongoConnection = await mongoHelper.getConnection();
  
    /* Get all channels' id */
    const channelIds = await mongoHelper.getChannelIds();
    const channelIdsSize = channelIds.length;

    const saveChannelPageInfoPromises = [];

    /* Save all information from channel's About Page */
    channelIds.forEach((channelId) => {
      saveChannelPageInfoPromises.push(async function() {
        const info = await youtubeApi.getInfoFromChannelAboutPage(channelId);
        if (info) {
          const channel = {
            _id: channelId,
            country: info.country,
            socialInfos: info.socialInfos,
          }
          await mongoHelper.saveChannel(channel);
          return 'finish ' + channelId;
        }
      }());
    });

    await Promise.all(saveChannelPageInfoPromises);

    /* Job finish */
    mongoConnection.close();
    console.log('finish saving channel page infos');
    return 'ok';

  } catch (e) {
    if (mongoConnection) {
      mongoConnection.close();
    }
    throw e;
  }
}

module.exports = saveChannelPageInfos;
