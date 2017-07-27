require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const config = require('../config.js');
const cheerio = require('cheerio');
const tinyHelper = require('../libs/tinyHelper');

const socialBladeChannelUrl = 'https://socialblade.com/youtube/channel/$1';

const countryMap = {
  'TW': 'Taiwan',
  'MY': 'Malaysia',
  'CA': 'Canada',
  'HK': 'HongKong',
  'JP': 'Japan',
  'US': 'UnitedStates',
  'MO': 'Macao',
  'CN': 'China',
};

exports.getCountryFromSocialBlade = async function (channelId) {
  let $;
  let url = socialBladeChannelUrl.replace('$1', channelId);

  const result = await fetch(url, {
      method: 'GET',
    });
  const html = await result.text();

  $ = cheerio.load(html);

  const countrySpan = $('#youtube-stats-header-country')[0];
  const country = countrySpan.children[0].data;
  return countryMap[country] || null;
};
