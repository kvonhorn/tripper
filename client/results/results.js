
Template.results.helpers({
  items: function() {
    var lastResults = Session.get("lastResults");
    return (undefined !== lastResults) ? lastResults.items : null;
  },
  lastResultsDebug: function() {
    var lastResults = Session.get("lastResults");
    return JSON.stringify(lastResults, "", 2);
  },
  nextPageToken: function() {
    var lastResults = Session.get("lastResults");
    return (undefined !== lastResults) ? lastResults.result.nextPageToken : null;
  },
  prevPageToken: function() {
    var lastResults = Session.get("lastResults");
    return (undefined !== lastResults) ? lastResults.result.prevPageToken : null;
  },
  prevAndNextPageTokensExist: function() {
    var lastResults = Session.get("lastResults");
    if(undefined === lastResults) {
      return false;
    }
    var lastResultsResult = lastResults.result;
    return (undefined !== lastResultsResult.prevPageToken && 
            undefined !== lastResultsResult.nextPageToken);
  }
});

Template.results.events({
  'click #loadNextPage': function(event) {
    var nextPageToken = Session.get("lastResults").result.nextPageToken;
    var searchRequest = gapi.client.youtube.search.list({
      part: 'snippet', q: Session.get("searchTerm"),
        maxResults: Session.get("resultsPerPage"), pageToken: nextPageToken
    });
    searchRequest.execute(onSearchResults);
  },
  'click #loadPrevPage': function(event) {
    var pageToken = Session.get("lastResults").result.prevPageToken;
    var searchRequest = gapi.client.youtube.search.list({
      part: 'snippet', q: Session.get("searchTerm"),
        maxResults: Session.get("resultsPerPage"), pageToken: pageToken
    });
    searchRequest.execute(onSearchResults);
  } 
});

onSearchResults = function(results) {
  Session.set("lastResults", results);
}
