const youtubeApi = require('../libs/youtubeApi');
const config = require('../config');
const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');


async function saveChannelsInfo() {
  let mongoConnection;
  try {
    /* Wait for mongodb connection */
    mongoConnection = await mongoHelper.getConnection();
  
    /* Get all channels' Id */
    const channelIds = await mongoHelper.getChannelIds();
  
    console.log('Channel Number: ' + channelIds.length);

    /*  Split an array to pieces and push then to an array */
    const splittedYoutubers = tinyHelper.splitArray(channelIds, 50);
  
    /* get lots of channels' info, but youtuber Api has limits, so we may need to query more than one time */
    const getChannelsPromises = [];
    splittedYoutubers.forEach((item) => {
      getChannelsPromises.push(youtubeApi.getChannels(item));
    });
  
    /* Each result even contains lots of results, so we do double loop */
    const resFromChannelPromises = await Promise.all(getChannelsPromises);
    const channels = [];
    resFromChannelPromises.forEach((channelItems) => {
      channelItems.forEach((channelItem) => {
        channels.push(tinyHelper.encryptChannelInfo(channelItem));
      });
    });
  
    /* Use this index to check if all the promises done */
    const saveChannelPromises = [];
    channels.forEach(function (channel) {
      saveChannelPromises.push(mongoHelper.saveChannel(channel));
    });
    await Promise.all(saveChannelPromises);

    /* Job finish */
    mongoConnection.close();
    console.log('finish saving channels');
    return 'ok';
  } catch (e) {
    if (mongoConnection) {
      mongoConnection.close();
    }
    throw e;
  }
}

module.exports = saveChannelsInfo;
