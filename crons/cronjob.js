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

const getVideosHourly = new cron.CronJob({
  cronTime: config.getVideosHourlyCronjob,
  onTick: function() {
    console.log('get Videos hourly');
    saveAllVideos(false, true);
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

const getVideosDaily = new cron.CronJob({
  cronTime: config.getVideosDailyCronjob,
  onTick: function() {
    console.log('get Videos daily');
    saveAllVideos(false, false);
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

const saveChannelStatisticsDaily = new cron.CronJob({
  cronTime: config.saveChannelStatisticsDailyCronjob,
  onTick: function() {
    console.log('save Channel Statistics daily');
    saveChannelStatistics();
  },
  start: false,
  timeZone: 'Asia/Taipei'
});


getChannelsHourly.start();
getVideosHourly.start();
getVideosDaily.start();
saveChannelStatisticsDaily.start();