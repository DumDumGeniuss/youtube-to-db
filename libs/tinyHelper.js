/* Split big array to lots of arrays */
exports.splitArray = function (array, count) {
  const final = [];
  const arraySize = array.length;
  let newArray = [];
  for (let i = 0; i < arraySize; i++) {
    if (i % count === 0 && i !== 0) {
      final.push(newArray);
      newArray = [];
    }
    newArray.push(array[i]);
  }
  final.push(newArray);
  return final;
};

exports.encryptChannelInfo = function (item) {
  return {
    etag: item.etag,
    _id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    defaultThumbnails: item.snippet.thumbnails.default.url,
    mediumThumbnails: item.snippet.thumbnails.medium.url,
    highThumbnails: item.snippet.thumbnails.high.url,
    bannerTvImageUrl: item.brandingSettings.image.bannerTvImageUrl,
    viewCount: parseInt(item.statistics.viewCount || 0, 10),
    commentCount: parseInt(item.statistics.commentCount || 0, 10),
    subscriberCount: parseInt(item.statistics.subscriberCount || 0, 10),
    videoCount: parseInt(item.statistics.videoCount || 0, 10),
    randomNumber: parseInt(Math.random() * 100000, 10),
  }
};

exports.encryptVideoInfo = function (video) {
	return {
    	etag: video.etag,
		  _id: video.id,
		  publishedAt: video.snippet.publishedAt,
		  channelTitle: video.snippet.channelTitle,
		  channelId: video.snippet.channelId,
		  title: video.snippet.title,
		  description: video.snippet.description,
    	defaultThumbnails: video.snippet.thumbnails.default.url,
    	mediumThumbnails: video.snippet.thumbnails.medium.url,
    	highThumbnails: video.snippet.thumbnails.high.url,
    	standard: video.snippet.thumbnails.high.standard,
    	duration: video.contentDetails.duration,
    	viewCount: parseInt(video.statistics.viewCount || 0, 10),
    	likeCount: parseInt(video.statistics.likeCount || 0, 10),
    	dislikeCount: parseInt(video.statistics.dislikeCount || 0, 10),
    	commentCount: parseInt(video.statistics.commentCount || 0, 10),
      randomNumber: parseInt(Math.random() * 100000, 10),
	};
}