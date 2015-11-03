# tripper
Front end for youtube-dl and FFmpeg to allow user to search for videos, download the
videos, and extract the audio from the video.


## Requirements
tripper is a Meteor app. You'll need to install it as well as youtube-dl and FFmpeg.

### YouTube API key
You need a YouTube API key to run this program. You can register one at [the Google
Developers Console](https://console.developers.google.com/). You need an API Key, NOT
an OAuth 2.0 key.

Once you have an API key, enter the top-level tripper directory and run
```cp client/search/youtubeApiKey_example.js client/search/youtubeApiKey.js```.

Edit the client/search/youtubeApiKey.js file. Uncomment the line beginning with //youtubeApiKey,
and replace the text between the quotes with your YouTube API key.

CAUTION: Don't go deploying this app where just anyone can use it. Your API key will
get copied and your quota will get used up.

### Meteor
Download Meteor from [www.meteor.com](http://www.meteor.com/). The code was developed with
Meteor 1.2.1.

### youtube-dl
Download youtube-dl from [the youtube-dl downloads page](https://rg3.github.io/youtube-dl/download.html),
or install it with pip: ```sudo pip install --upgrade youtube_dl```.

### FFmpeg
Download from [the FFmpeg site](https://www.ffmpeg.org/).


## Running

+ Clone the repo
+ Edit server/download.js
  + Update path in youtubedlCmd to the path to youtube-dl on your local machine
+ Change into the tripper directory and execute ```meteor```
+ Open your browser to [http://localhost:3000/](http://localhost:3000/).
