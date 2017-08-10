const cron = require('cron');
const winston = require('winston');

const saveAllVideos = require('../bash/saveAllVideos');
const saveChannels = require('../bash/saveChannels');
const saveChannelStatistics = require('../bash/saveChannelStatistics');
const saveChannelPageInfos = require('../bash/saveChannelPageInfos');
const saveAllCategories = require('../bash/saveAllCategories');
const determineChannelCategories = require('../bash/determineChannelCategories');
const scrapeFacebook = require('../bash/scrapeFacebook');

const config = require('../config.js');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'cronjobs.log' })
  ]
});

const mainJob = async function () {
  try {
    console.log('save Channels from youtube');
    await saveChannels();
  } catch (e) {
    console.error(e);
    logger.error(e);
  }

  try {
    console.log('save channel statistics');
    await saveChannelStatistics();
  } catch (e) {
    console.error(e);
    logger.error(e);
  }
  
  try {
    console.log('save Channel Page Infos daily');
    await saveChannelPageInfos();
  } catch (e) {
    console.error(e);
    logger.error(e);
  }
  
  try {
    console.log('save new Videos');
    await saveAllVideos(false, false, 'date');
  } catch (e) {
    console.error(e);
    logger.error(e);
  }
  
  try {
    console.log('save popular Videos');
    await saveAllVideos(false, false, 'viewCount');
  } catch (e) {
    console.error(e);
    logger.error(e);
  }
  
  try {
    console.log('determine all channel categories');
    await determineChannelCategories();
  } catch (e) {
    console.error(e);
    logger.error(e);
  }

  try {
    console.log('save all categories');
    await saveAllCategories();
  } catch (e) {
    console.error(e);
    logger.error(e);
  }
}


const mainJobCron = new cron.CronJob({
  cronTime: config.mainJobSchedule,
  onTick: mainJob,
  start: false,
  timeZone: 'Asia/Taipei'
});

mainJobCron.start();


/* Hey, scrape facebook */
async function scrapeFacebookJob() {
  try {
    scrapeFacebook();
  } catch (e) {
    console.error(e);
    logger.error(e);
  }
};

const scrapeFacebookCron = new cron.CronJob({
  cronTime: '0,10,20,30,40,50 * * * * *',
  onTick: function() {
    scrapeFacebookJob();
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

scrapeFacebookCron.start();
