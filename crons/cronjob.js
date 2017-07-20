const cron = require('cron');
const saveAllVideos = require('../bash/saveAllVideos');
const saveChannels = require('../bash/saveChannels');
const saveChannelStatistics = require('../bash/saveChannelStatistics');
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

const getNewVideos = new cron.CronJob({
  cronTime: config.getNewVideosCronjob,
  onTick: function() {
    console.log('get Videos hourly');
    saveAllVideos(false, true, 'date');
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

const getPopularVideos = new cron.CronJob({
  cronTime: config.getPopularVideosCronjob,
  onTick: function() {
    console.log('get Videos monthly');
    saveAllVideos(false, false, 'viewCount');
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


getChannelsHourly.start();
getNewVideos.start();
getPopularVideos.start();
saveChannelStatisticsDaily.start();