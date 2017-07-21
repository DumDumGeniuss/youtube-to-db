require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const config = require('../config.js');
const cheerio = require('cheerio');

const youtubeApi = 'https://www.googleapis.com/youtube/v3/';

const youtubeChannelAboutUrl = 'https://www.youtube.com/channel/$1/about';

const apiKey = config.youtube_app_key;

exports.getInfoFromChannelAboutPage = (channelId) => {
  let $;
  let url = youtubeChannelAboutUrl.replace('$1', channelId);

  return fetch(url, {
    method: 'GET',
  })
  .then((result) => {
    return result.text();
  })
  .then((result) => {
    $ = cheerio.load(result);
    const countrySpan = $('span[class="country-inline"]')[0];
    const country = countrySpan ? countrySpan.children[0].data.replace(/[\n\s]/g, '') : null;
    const socialLinkLis = $('li[class="channel-links-item"]');
    const socialLinkLisSize = socialLinkLis.length;
    const socialInfos = [];

    for (let i = 0; i < socialLinkLisSize; i++) {
      const aTag = socialLinkLis[i].children[1];
      const imgTag = aTag ? aTag.children[1] : null;
      const socialInfo = {
        title: aTag ? aTag.attribs.title : null,
        href: aTag ? aTag.attribs.href : null,
        img: imgTag ? 'https:' + imgTag.attribs.src : null,
      };
      socialInfos.push(socialInfo);
    }
    return {
      country,
      socialInfos,
    };
  })
  .catch((err) => {
    console.log(err);
    return null;
  });
};

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

  // console.log('call videos Api, quota 7');
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
exports.getChannelVideos = (channelId, pageToken, date, sort) => {
  let queryString;
  let querySort = sort || 'date';
  let queryDate = date || '1970-01-01T00:00:00Z';
  queryString = `?part=snippet&type=video&channelId=${channelId}&key=${apiKey}&maxResults=50&order=${querySort}&pageToken=${pageToken}&publishedAfter=${queryDate}`;

  // console.log('call search Api, quota 100');
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
