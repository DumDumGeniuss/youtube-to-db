const config = require('../config');
const mongoose = require('mongoose');
const ChannelModel = require('../models/Channel');
const VideoModel = require('../models/Video');
const ChannelStatisticModel = require('../models/ChannelStatistic');
const CategoryModel = require('../models/Category');
const CandidateChannelModel = require('../models/CandidateChannel');

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

exports.getVideos = async function (channelId, sort, count, order) {
  const videos = await VideoModel.find({channelId: channelId}).sort({ [sort]: order || 'desc' }).limit(count || 50);
  return videos;
};

exports.deleteChannel = async function (channelId) {
  await ChannelModel.deleteOne({ _id: channelId});
  return 'ok';
};

exports.getVideoCategories = async function () {
  const videoCategories = await VideoModel.find({}).distinct('category');
  return videoCategories;
};

exports.deleteChannelVideos = async function (channelId) {
  await VideoModel.remove({ channelId: channelId });
  return 'ok';
};

exports.getChannelCategories = async function () {
  const channelCategories = await ChannelModel.find({}).distinct('category');
  return channelCategories;
};

exports.getChannelCountries = async function () {
  const channelCountries = await ChannelModel.find({}).distinct('country');
  return channelCountries;
};

exports.saveCategories = async function (category) {
  /* Update if exsist, create if not exist */
  await CategoryModel.update({_id: category._id}, category, {upsert: true});
  return 'ok';
};

exports.getStatisticsFromChannel = async function (count) {
  const channels = await ChannelModel.find({}, 'viewCount commentCount subscriberCount videoCount').limit(count || 99999);

  return channels;
};

exports.saveChannel = async function (channel) {
  /* Update if exsist, create if not exist */
  await ChannelModel.update({_id: channel._id}, channel, {upsert: true});
  return 'ok';
};

exports.getChannelStatistics = async function (channelId, date) {
  const query = {};
  if (channelId) {
    query.channelId = channelId;
  }
  if (date) {
    query.date = date;
  }
  const statistics = await ChannelStatisticModel.find(query);
  return statistics;
}

exports.saveChannelStatistic = async function (channelStatistic) {
  /* Update if exsist, create if not exist */
  await ChannelStatisticModel.update({
      channelId: channelStatistic.channelId,
      date: channelStatistic.date
    }, channelStatistic, {upsert: true});
  return 'ok';
};

exports.deleteChannelStatistics = async function (channelId) {
  await ChannelStatisticModel.remove({ channelId: channelId });
  return 'ok';
};

exports.saveVideo = async function (video) {
  /* Update if exsist, create if not exist */
  await VideoModel.update({_id: video._id}, video, {upsert: true});
  return 'ok';
};

exports.deleteCandidateChannel = async function (channelId) {
  await CandidateChannelModel.deleteOne({ _id: channelId });
  return 'ok';
};
