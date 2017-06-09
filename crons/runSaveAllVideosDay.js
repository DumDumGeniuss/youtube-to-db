const cron = require('node-cron');
const saveAllVideos = require('../bash/saveAllVideos');

cron.schedule('00 00 00 * * *', function(){
  console.log('Saving Videos Daily');
  saveAllVideos(false, false);
});