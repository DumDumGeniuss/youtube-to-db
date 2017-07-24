const tinyHelper = require('../libs/tinyHelper');
const mongoHelper = require('../libs/mongoHelper');
// const moment = require('moment-timezone');

async function saveAllCategories(timeZone) {
  try {
    /* Wait for mongodb connection */
    const mongoConnection = await mongoHelper.getConnection();

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

    mongoConnection.close();
  } catch (e) {
    console.log(e);
  }
}

module.exports = saveAllCategories;
