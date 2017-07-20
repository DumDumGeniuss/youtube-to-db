const saveAllVideos = require('../bash/saveAllVideos');
const argv = require('yargs').argv;

saveAllVideos(argv.channelId, argv.onlyThisMonth, argv.sort);
