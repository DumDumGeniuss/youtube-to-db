const cron = require('node-cron');
const saveChannels = require('../bash/saveChannels');

cron.schedule('30 * * * *', function(){
  console.log('Saving Channels Hourly');
  saveChannels();
});