const cron = require('node-cron');
const saveAllVideos = require('../bash/saveAllVideos');

cron.schedule('30 * * * * *', function(){
  console.log('Saving Videos Daily');
  saveAllVideos(false, false);
});