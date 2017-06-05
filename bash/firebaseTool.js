const firebase = require('firebase');
const config = require('../config.js');

/* Init Firebase Config */
const firebaseConfig = {
  apiKey: config.firebase_app_key,
  authDomain: "youtuber-spy.firebaseapp.com",
  databaseURL: "https://youtuber-spy.firebaseio.com",
  storageBucket: "youtuber-spy.appspot.com",
};
firebase.initializeApp(firebaseConfig);

const getDatabaseConnection = () => {
	return firebase.database();
};

async function getAllYoutubers(database) {
	const youtubers = [];
	const youtuberList = await database.ref('/youtubers').once('value');
	youtuberList.forEach(function (item) {
		youtubers.push(item.val().id);
	});
  return youtubers;
}

function savingAllChannels(database, channels) {
  channels.forEach((channel) => {
    database.ref('channels').child(channel.id).set(channel);
  });
}

function closeConnectionAfterSecs(database, secs) {
  setTimeout(function () {
    database.goOffline();
  }, secs * 1000);
};

module.exports = {
	getDatabaseConnection: getDatabaseConnection,
  getAllYoutubers: getAllYoutubers,
  savingAllChannels: savingAllChannels,
  closeConnectionAfterSecs: closeConnectionAfterSecs,
};