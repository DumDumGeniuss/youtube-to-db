const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
const ChannelStatisticModel = require('../models/ChannelStatistic');
const moment = require('moment');

async function saveChannelStatistics() {
  try {

    const dateNow = new Date();

    /* Generate date format */
    const dateString = moment(dateNow).format('YYYY-MM-DD');
    console.log(dateString);

    /* Wait for mongodb connection */
    const mongoConnection = await mongoHelper.getConnection();
  
    /* Get all channels' statistics */
    const channelStatistics = await mongoHelper.getChannelStatistics();
  
    let checkSaveEndIndex = 0;

    /* Save all new statistics */
    channelStatistics.forEach(async function (item) {
      const newStatistic = {
        channelId: item.id,
        date: dateString,
        createdAt: dateNow,
        viewCount: item.viewCount,
        commentCount: item.commentCount,
        subscriberCount: item.subscriberCount,
        videoCount: item.videoCount,
      };
      /* If today's data already exists, skip it */
      const oldStatistic = await ChannelStatisticModel.find({ channelId: newStatistic.channelId, date: newStatistic.date });
      if (oldStatistic.length === 0) {
        await mongoHelper.saveChannelStatistic(newStatistic);
      }
      checkSaveEndIndex += 1;
      if (checkSaveEndIndex === channelStatistics.length) {
        mongoConnection.close();
      }
    });

    // mongoConnection.close();
  } catch (e) {
    console.log(e);
  }
}

module.exports = saveChannelStatistics;
