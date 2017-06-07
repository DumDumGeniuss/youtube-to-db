const config = require('../config');
const mongoose = require('mongoose');
const ChannelModel = require('../models/Channel');
const VideoModel = require('../models/Video');

mongoose.Promise = global.Promise;

exports.getConnection = function () {
  return new Promise ((resolve, reject) => {
    const db = mongoose.connect(config.mongodb_url).connection;
    db.on('connected', async function() {
      resolve(db);
    });
  });
};

exports.getChannelIds = async function () {
  const channels = await ChannelModel.find({});
  const channelIds = [];
  console.log(channels);
  channels.forEach((channel) => {
    channelIds.push(channel._id);
  });
  return channelIds;
};

exports.saveChannel = async function (channel) {
  /* Update if exsist, create if not exist */
  await ChannelModel.update({_id: channel._id}, channel, {upsert: true});
  return 'ok';
};

exports.saveVideo = async function (video) {
  /* Update if exsist, create if not exist */
  await VideoModel.update({_id: video._id}, video, {upsert: true});
  return 'ok';
};
