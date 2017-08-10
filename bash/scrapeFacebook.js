require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');

const config = require('../config.js');

const apiUrl = 'https://graph.facebook.com/v2.9/';


async function scrapeFacebook() {
  try {
    const data = {
      id: 'https://www.youtuberspy.com/campaigns/pickYoutuber',
      scrape: true,
      access_token: config.facebook_app_token,
    };
    const result = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data),
    });
  
    const response = await result.json();
    if (result.status !== 200) {
      throw {
        status: result.status,
        message: response.error,
      };
    }
  } catch (e) {
    throw e;
  }

}

module.exports = scrapeFacebook;