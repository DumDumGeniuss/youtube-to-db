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
    saveAllVideos(false, true, 'date');
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

const getVideosDaily = new cron.CronJob({
  cronTime: config.getVideosDailyCronjob,
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
getVideosHourly.start();
getVideosDaily.start();
saveChannelStatisticsDaily.start();