const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
const moment = require('moment-timezone');
const youtubeApi = require('../libs/youtubeApi');

async function saveChannelPageInfos() {
  try {
    /* Wait for mongodb connection */
    const mongoConnection = await mongoHelper.getConnection();
  
    /* Get all channels' id */
    const channelIds = await mongoHelper.getChannelIds();
    const channelIdsSize = channelIds.length;

    let checkSaveEndIndex = 0;

    /* Save all information from channel's About Page */
    channelIds.forEach(async function (channelId) {
      const info = await youtubeApi.getInfoFromChannelAboutPage(channelId);
      if (info) {
        const channel = {
          _id: channelId,
          country: info.country,
          socialInfos: info.socialInfos,
        }
        await mongoHelper.saveChannel(channel);
      }
      checkSaveEndIndex += 1;
      if (checkSaveEndIndex === channelIdsSize) {
        mongoConnection.close();
      }
    });

  } catch (e) {
    mongoConnection.close();
    console.log(e);
  }
}

module.exports = saveChannelPageInfos;
