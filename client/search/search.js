Meteor.startup(function() {
  Session.setDefault("resultsPerPage", 3);
});

Template.search.helpers({
  resultsPerPage3: function() {
    var resultsPerPage = Session.get("resultsPerPage");
    return Session.get("resultsPerPage") == 3;
  },
  resultsPerPage7: function() {
    return Session.get("resultsPerPage") == 7;
  },
  resultsPerPage17: function() {
    return Session.get("resultsPerPage") == 17;
  }
});

Template.search.events({
  "submit .search": function(event) {
    event.preventDefault();
    var searchTerm = event.target.searchText.value;
    Session.set("searchTerm", searchTerm);
    // TODO: Perform the search, setting the method that actually displays results.
    var searchRequest = gapi.client.youtube.search.list({
      part: 'snippet', q: searchTerm, maxResults: Session.get("resultsPerPage")
    });
    searchRequest.execute(onSearchResults);
  },
  "change #resultsPerPage": function(event) {
    event.preventDefault();
    var resultsPerPage = event.target.value;
    Session.set("resultsPerPage", resultsPerPage);
  }
});
