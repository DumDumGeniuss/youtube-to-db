const config = require('../config');
const mongoose = require('mongoose');
const ChannelModel = require('../models/Channel');
const VideoModel = require('../models/Video');
const ChannelStatisticModel = require('../models/ChannelStatistic');

mongoose.Promise = global.Promise;

exports.getConnection = function () {
  return new Promise ((resolve, reject) => {
    const db = mongoose.connect(config.mongodb_url).connection;
    db.on('connected', async function() {
      resolve(db);
    });
  });
};

exports.getChannelIds = async function (count) {
  const channels = await ChannelModel.find({}).limit(count || 99999);
  const channelIds = [];
  channels.forEach((channel) => {
    channelIds.push(channel._id);
  });
  return channelIds;
};

exports.getChannelStatistics = async function () {
  const channels = await ChannelModel.find({}, 'viewCount commentCount subscriberCount videoCount');

  return channels;
};

exports.saveChannel = async function (channel) {
  /* Update if exsist, create if not exist */
  await ChannelModel.update({_id: channel._id}, channel, {upsert: true});
  return 'ok';
};

exports.saveChannelStatistic = async function (channelStatistic) {
  /* Update if exsist, create if not exist */
  await ChannelStatisticModel.update({
      channelId: channelStatistic.channelId,
      date: channelStatistic.date
    }, channelStatistic, {upsert: true});
  return 'ok';
};

exports.saveVideo = async function (video) {
  /* Update if exsist, create if not exist */
  await VideoModel.update({_id: video._id}, video, {upsert: true});
  return 'ok';
};
