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
    viewCount: parseInt(item.statistics.viewCount, 10),
    commentCount: parseInt(item.statistics.commentCount, 10),
    subscriberCount: parseInt(item.statistics.subscriberCount, 10),
    videoCount: parseInt(item.statistics.videoCount, 10),
  }
};

exports.encryptVideoInfo = function (video) {
	return {
    	etag: video.etag,
		_id: video.id,
		publishedAt: video.snippet.publishedAt,
		channelId: video.snippet.channelId,
		title: video.snippet.title,
		description: video.snippet.description,
    	defaultThumbnails: video.snippet.thumbnails.default.url,
    	mediumThumbnails: video.snippet.thumbnails.medium.url,
    	highThumbnails: video.snippet.thumbnails.high.url,
    	standard: video.snippet.thumbnails.high.standard,
    	duration: video.contentDetails.duration,
    	viewCount: video.statistics.viewCount,
    	likeCount: video.statistics.likeCount,
    	dislikeCount: video.statistics.dislikeCount,
    	commentCount: video.statistics.commentCount,
	};
}