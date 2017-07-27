const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
const moment = require('moment-timezone');
const youtubeApi = require('../libs/youtubeApi');
const socialBladeApi = require('../libs/socialBladeApi');

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
          let country = info.country;
          let socialInfos = info.socialInfos;
          if (!country) {
            country = await socialBladeApi.getCountryFromSocialBlade(channelId);
          }
          const channel = {
            _id: channelId,
            country,
            socialInfos,
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
