require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const config = require('../config.js');

const youtubeApi = 'https://www.googleapis.com/youtube/v3/';
const apiKey = config.youtube_app_key;

exports.getChannels = (ids) => {
  let idParam = '';
  let queryString;
  idParam = encodeURIComponent(ids.toString());
  queryString = '?part=statistics,snippet,brandingSettings&id=' + idParam + '&key=' + apiKey;

  return fetch(youtubeApi + 'channels' + queryString, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    if (res.error) {
      console.log(res.error);
    }
    return res.items;
  })
  .catch((err) => {
    console.log(err);
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
    if (res.error) {
      console.log(res.error);
    }
    return res.items;
  })
  .catch((err) => {
    console.log(err);
  });
};

/* Get all videos from on channel */
exports.getChannelVideos = (channelId, pageToken, date) => {
  let queryString;
  let queryDate = date || '1970-01-01T00:00:00Z';
  queryString = `?part=snippet&type=video&channelId=${channelId}&key=${apiKey}&maxResults=50&order=date&pageToken=${pageToken}&publishedAfter=${queryDate}`;

  return fetch(youtubeApi + 'search' + queryString, {
    method: 'GET',
  })
  .then((res) => {
    if (res.error) {
      console.log(res.error);
    }
    return res.json();
  })
  .catch((err) => {
    console.log(err);
  });
};
