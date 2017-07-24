const cron = require('cron');
const saveAllVideos = require('../bash/saveAllVideos');
const saveChannels = require('../bash/saveChannels');
const saveChannelStatistics = require('../bash/saveChannelStatistics');
const saveChannelPageInfos = require('../bash/saveChannelPageInfos');
const config = require('../config.js');

const getChannelsHourly = new cron.CronJob({
  cronTime: config.getChannelsHourlyCronjob,
  onTick: function() {
    console.log('get Channels');
    saveChannels();
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

const getAllVideos = new cron.CronJob({
  cronTime: config.getAllVideosCronjob,
  onTick: async function() {
    console.log('get new Videos');
    await saveAllVideos(false, true, 'date');
    console.log('get popular Videos');
    await saveAllVideos(false, false, 'viewCount');
    console.log('Finish getting videos');
    return;
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

const saveChannelStatisticsDaily = new cron.CronJob({
  cronTime: config.saveChannelStatisticsDailyCronjob,
  onTick: function() {
    console.log('save Channel Statistics daily');
    saveChannelStatistics('Asia/Taipei');
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

const saveChannelPageInfosDaily = new cron.CronJob({
  cronTime: config.saveChannelPageInfosDailyCronjob,
  onTick: function() {
    console.log('save Channel Page Infos daily');
    saveChannelPageInfos('Asia/Taipei');
  },
  start: false,
  timeZone: 'Asia/Taipei'
});


getChannelsHourly.start();
getAllVideos.start();
saveChannelStatisticsDaily.start();
saveChannelPageInfosDaily.start();