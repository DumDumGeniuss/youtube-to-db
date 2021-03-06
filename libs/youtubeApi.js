require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const config = require('../config.js');
const cheerio = require('cheerio');
const tinyHelper = require('../libs/tinyHelper');

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
    /* Get country */
    const countrySpan = $('span[class="country-inline"]')[0];
    const country = countrySpan ? countrySpan.children[0].data.replace(/[\n\s]/g, '') : null;

    /* Get social links, and there might be duplicated ones */
    const socialLinkLis = $('li[class="channel-links-item"]');
    const socialLinkLisSize = socialLinkLis.length;
    const socialInfos = [];
    const socialInfoRepeatCheck = {};

    for (let i = 0; i < socialLinkLisSize; i++) {
      const aTag = socialLinkLis[i].children[1];
      const imgTag = aTag ? aTag.children[1] : null;
      const title = aTag ? aTag.attribs.title : null;
      const href = aTag ? aTag.attribs.href : null;
      const img = imgTag ? 'https:' + imgTag.attribs.src : null;
      /* If no previous socialInfo with same href, add it to the array */
      if (!socialInfoRepeatCheck[href]) {
        const socialInfo = {
          title,
          href,
          img,
        };
        socialInfos.push(socialInfo);
        socialInfoRepeatCheck[href] = true;
      }
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

exports.getChannels = async function (ids) {
  let idParam = '';
  let queryString;
  idParam = encodeURIComponent(ids.toString());
  queryString = '?part=statistics,snippet,brandingSettings&id=' + idParam + '&key=' + apiKey;

  const res = await fetch(youtubeApi + 'channels' + queryString, {
    method: 'GET',
  });
  const finalRes = await res.json();
  if (finalRes.error) {
      throw finalRes.error;
  }
  return finalRes.items;
};

/* Get all targeted videos*/
const getVideos = async function (ids) {
  let idParam = '';
  let queryString;
  idParam = encodeURIComponent(ids.toString());
  queryString = `?part=statistics,snippet,contentDetails&id=${idParam}&key=${apiKey}`;

  const res = await fetch(youtubeApi + 'videos' + queryString, {
    method: 'GET',
  });
  const finalRes = await res.json();
  if (finalRes.error) {
      throw finalRes.error;
  }
  return finalRes.items;
};
exports.getVideos = getVideos;

/* Enter an array of video ids, and get all of then from youtube  */
const getAllVideos = async function (videoIds) {
  const manyVideoIds = tinyHelper.splitArray(videoIds, 50);
  let resVideos = [];
  let getVideosPromises = [];
  manyVideoIds.forEach((ids) => {
    getVideosPromises.push(getVideos(ids));
  });
  let resFromGetVideosPromises = await Promise.all(getVideosPromises);
  resFromGetVideosPromises.forEach((videos) => {
    resVideos = resVideos.concat(videos);
  });

  return resVideos;
};
exports.getAllVideos = getAllVideos;


/* Get all targeted videoCategories*/
const getVideoCategories = () => {
  let idParam = '';
  let queryString;
  let ids = [];
  for (let i = 1; i <= 50; i++) {
    ids.push(i);
  }
  idParam = encodeURIComponent(ids.toString());
  queryString = `?part=snippet&id=${idParam}&key=${apiKey}`;

  // console.log('call videos Api, quota 7');
  return fetch(youtubeApi + 'videoCategories' + queryString, {
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
exports.getVideoCategories = getVideoCategories;


/* Get all videos from one channel */
const getChannelVideos = async function (channelId, pageToken, date, sort) {
  let queryString;
  let querySort = sort || 'date';
  let queryDate = date || '1970-01-01T00:00:00Z';
  queryString = `?part=snippet&type=video&channelId=${channelId}&key=${apiKey}&maxResults=50&order=${querySort}&pageToken=${pageToken}&publishedAfter=${queryDate}`;

  // console.log('call search Api, quota 100');
  const res = await fetch(youtubeApi + 'search' + queryString, {
    method: 'GET',
  });
  const finalRes = await res.json();
  if (finalRes.error) {
      throw finalRes.error;
  }
  return finalRes;
};
exports.getChannelVideos = getChannelVideos;

/* get all videos from a channel, but it may contains lots of videos, so we may query lots of times */
const getAllChannelVideos = async function (channelId, date, sort) {
  let videos = [];
  let nextToken;
  const result = await getChannelVideos(channelId, '', date, sort);
  nextToken = result.nextPageToken;
  videos = videos.concat(result.items);
  /* We just get the firt 50 results */
  // while (nextToken) {
  //  let nextResult = await youtubeApi.getChannelVideos(channelId, nextToken, date, sort);
  //  nextToken = nextResult.nextPageToken;
  //  videos = videos.concat(nextResult.items);
  // }
  return videos;
};
exports.getAllChannelVideos = getAllChannelVideos;
