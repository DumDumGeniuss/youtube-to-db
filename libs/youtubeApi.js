require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const config = require('../config.js');

const youtubeApi = 'https://www.googleapis.com/youtube/v3/';
const apiKey = config.youtube_app_key;

exports.getChannels = (ids) => {
  let idParam = '';
  let queryString;
  idParam = encodeURIComponent(ids.toString());
  queryString = '?part=statistics,snippet&id=' + idParam + '&key=' + apiKey;

  return fetch(youtubeApi + 'channels' + queryString, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    return res.items;
  });
};

/* Get all targeted videos*/
exports.getVideos = (ids) => {
  let idParam = '';
  let queryString;
  idParam = encodeURIComponent(ids.toString());
  queryString = `?part=statistics,snippet,contentDetails&id=${idParam}&key=${apiKey}`;

  return fetch(youtubeApi + 'videos' + queryString, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    return res.items;
  });
};

/* Get all videos from on channel */
exports.getChannelVideos = (channelId, pageToken) => {
  let queryString;
  queryString = `?part=snippet&type=video&channelId=${channelId}&key=${apiKey}&maxResults=50&order=date&pageToken=${pageToken}`;

  return fetch(youtubeApi + 'search' + queryString, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  });
};
