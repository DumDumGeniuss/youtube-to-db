const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
// const moment = require('moment-timezone');

async function saveAllCategories(timeZone) {
  let mongoConnection;
  try {
    /* Wait for mongodb connection */
    mongoConnection = await mongoHelper.getConnection();

    /* Get all video categories and save it to Category document */
    const videoCategories = await mongoHelper.getVideoCategories();
    const newVideoCategory = {
      _id: 'videoCategory',
      categories: videoCategories,
    }
    await mongoHelper.saveCategories(newVideoCategory);

    /* Get all channel categories and save it to Category document */
    const channelCategories = await mongoHelper.getChannelCategories();
    const newChannelCategory = {
      _id: 'channelCategory',
      categories: channelCategories,
    }
    await mongoHelper.saveCategories(newChannelCategory);

    /* Get all countries and save it to Category document */
    const channelCountries = await mongoHelper.getChannelCountries();
    const newCountryCategory = {
      _id: 'countryCategory',
      categories: channelCountries,
    }
    await mongoHelper.saveCategories(newCountryCategory);

    /* Job finish */
    mongoConnection.close();
    console.log('finish saving all categories');
    return 'ok';

  } catch (e) {
    if (mongoConnection) {
      mongoConnection.close();
    }
    throw e;
  }
}

module.exports = saveAllCategories;
