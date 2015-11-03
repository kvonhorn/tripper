Template.result.helpers({
});

Template.result.events({
  'click #downloadAudioButton': function(event) {
    Meteor.call("requestAudioDownload", event.target.value, event.target.name);
  }
});
