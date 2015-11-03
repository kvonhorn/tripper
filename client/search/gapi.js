// Handle Google API load

gapiLoaded = function() {
  gapi.client.load("youtube", "v3", onYoutubeApiLoaded);
}

onYoutubeApiLoaded = function() {
  response = gapi.client.setApiKey(youtubeApiKey);
}
