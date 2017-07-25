const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
const ChannelStatisticModel = require('../models/ChannelStatistic');
const moment = require('moment-timezone');

async function saveChannelStatistics(timeZone) {
  let mongoConnection;
  try {

    const dateNow = new Date();

    /* Generate date format */
    const dateString = moment(dateNow).tz(timeZone || 'Asia/Taipei').format('YYYY-MM-DD');
    console.log(dateString);

    /* Wait for mongodb connection */
    mongoConnection = await mongoHelper.getConnection();
  
    /* Get all channels' statistics */
    const channelStatistics = await mongoHelper.getStatisticsFromChannel();

    console.log('channel statistics number: ' + channelStatistics.length);
  
    const saveChannelStatisticPromises = [];

    /* Save all new statistics */
    channelStatistics.forEach((channelStatistic) => {
      /* Immediately run the async function, it's important */
      saveChannelStatisticPromises.push(async function() {
        const newStatistic = {
          channelId: channelStatistic._id,
          date: dateString,
          createdAt: dateNow,
          viewCount: channelStatistic.viewCount,
          commentCount: channelStatistic.commentCount,
          subscriberCount: channelStatistic.subscriberCount,
          videoCount: channelStatistic.videoCount,
        };
        const oldStatistics = await mongoHelper.getChannelStatistics(newStatistic.channelId, newStatistic.date);
        if (oldStatistics.length === 0) {
          await mongoHelper.saveChannelStatistic(newStatistic);
        }
      }());
    });

    await Promise.all(saveChannelStatisticPromises);

    mongoConnection.close();
    console.log('Finish saving channel statistics');
    return 'ok';
  } catch (e) {
    if (mongoConnection) {
      mongoConnection.close();
    }
    throw e;
  }
}

module.exports = saveChannelStatistics;
