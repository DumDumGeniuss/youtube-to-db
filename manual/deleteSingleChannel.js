const deleteSIngleChannel = require('../bash/deleteSIngleChannel');
const argv = require('yargs').argv;

deleteSIngleChannel(argv.channelId);
