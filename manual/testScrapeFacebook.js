const cron = require('cron');
const scrapeFacebook = require('../bash/scrapeFacebook');

const job1 = new cron.CronJob({
  cronTime: '0,10,20,30,40,50 * * * * *',
  onTick: function() {
    scrapeFacebook();
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

job1.start();