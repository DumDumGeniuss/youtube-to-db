const cron = require('cron');
const saveAllVideos = require('../bash/saveAllVideos');
const saveChannels = require('../bash/saveChannels');

const job1 = new cron.CronJob({
  cronTime: '30 * * * *',
  onTick: function() {
    console.log('get Channels');
    saveChannels();
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

const job2 = new cron.CronJob({
  cronTime: '00 * * * *',
  onTick: function() {
    console.log('get Videos hourly');
    saveAllVideos(false, true);
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

const job3 = new cron.CronJob({
  cronTime: '00 00 * * *',
  onTick: function() {
    console.log('get Videos daily');
    saveAllVideos(false, false);
  },
  start: false,
  timeZone: 'Asia/Taipei'
});


job1.start();
job2.start();
job3.start();