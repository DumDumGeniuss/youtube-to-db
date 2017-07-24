const cron = require('cron');
require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');

const apiUrl = 'https://graph.facebook.com/v2.9/';


async function scrapeFacebook() {
  const data = {
    id: 'https://www.youtuberspy.com/campaigns/pickYoutuber',
    scrape: true,
    access_token: 'EAACEdEose0cBAFWIX5BTZCVHQGJ90ugaGyJPc7zb7CpgiVebvZArIt2qhAXZCV3NTzwFOtZCD0kdDhieIIdUY2mSqjqOMj8XicvpCEZCWLtFtjM7fAkvEvRZBVVrZAwZAAZAHcAWwzxHVOL2F47KzpKp6IYIrjvLn8ZBUlWWIIreKHeWnEDuf5Kx3JU908EpsrYW0ZD',
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

  console.log('done');
}

const job1 = new cron.CronJob({
  cronTime: '0,10,20,30,40,50 * * * * *',
  onTick: function() {
    scrapeFacebook();
  },
  start: false,
  timeZone: 'Asia/Taipei'
});

job1.start();