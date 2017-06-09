const cron = require('node-cron');
const saveAllVideos = require('../bash/saveAllVideos');

cron.schedule('0 * * * *', function(){
  console.log('Saving Videos Hourly');
  saveAllVideos(false, true);
});