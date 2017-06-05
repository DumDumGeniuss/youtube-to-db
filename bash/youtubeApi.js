require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const config = require('../config.js');

const youtubeApi = 'https://www.googleapis.com/youtube/v3/';
const apiKey = config.youtube_app_key;

const getChannels = (parts, ids) => {
  let idParam = '';
  let partParam = '';
  let queryString;
  idParam = encodeURIComponent(ids.toString());
  partParam = encodeURIComponent(parts.toString());
  queryString = '?part=' + partParam + '&id=' + idParam + '&key=' + apiKey;

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

module.exports = {
	getChannels: getChannels,
};
