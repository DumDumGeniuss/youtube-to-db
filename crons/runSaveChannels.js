const cron = require('node-cron');
const saveChannels = require('../bash/saveChannels');

cron.schedule('00 30 * * * *', function(){
  console.log('Saving Channels Hourly');
  saveChannels();
});