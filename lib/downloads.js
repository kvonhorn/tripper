// Methods to allow client to request downloads, and server to queue them.

Meteor.methods({
  requestAudioDownload: function(videoId, videoName) {
    if(Meteor.isClient) {
      console.log("Requesting audio from video " + videoId);
    }
    if(Meteor.isServer) {
      console.log("Queueing job to get audio from video: " + videoId);
      downloadAudio(videoId, "youtube", videoName);
    }
  }
});
