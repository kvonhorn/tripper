// Server methods to perform downloads and save audio and video.


// Configuration. TODO: Kick this out to external file.
var workingDir = "/tmp/tripper"
var outputDir = "/tmp";
var audioDir = outputDir + "/audio";
var videoDir = outputDir + "/video";

var youtubedlCmd = "/usr/local/bin/youtube-dl --max-downloads 1 https://www.youtube.com/watch?v={videoId} -o {outputFilename}";
var ffmpegCmd = "ffmpeg -i {inputFilename} -vn -acodec copy {outputFilename}";

var audioExtractCmd = ffmpegCmd;
// /Configuration


var Process = Npm.require('child_process');
var util = Npm.require('util');
var fs = Npm.require('fs');


var mkdirCb = function(err) {
  if(undefined !== err && err.code !== 'EEXIST') {
    console.log("Error creating directory: " + err);
  }
}
fs.mkdir(workingDir, mkdirCb);
fs.mkdir(videoDir, mkdirCb);
fs.mkdir(audioDir, mkdirCb);


// Objects to manage processes for downloading videos and extracting audio from downloaded videos
var downloads = {};
var audioExtractions = {};
var removeProcess = function(processToRemove) {
  var pid = processToRemove.pid;
  console.log("Removing process " + pid);
  this[pid] = null;
}
var addProcess = function(processToAdd) {
  var pid = processToAdd.pid;
  this[pid] = processToAdd;
  console.log("Added pid " + pid);

  processToAdd.stdout.on('data', function(data) {
    console.log('pid ' + processToAdd.pid + ": " + data);
  });

  processToAdd.stderr.on('data', function(data) {
    console.log('pid ' + processToAdd.pid + " ERROR: " + data);
  });

  processToAdd.on('close', function(code) {
    console.log('pid ' + this.pid + ' exited with error code ' + code);
    downloads.removeProcess(processToAdd);
  });
}

downloads.removeProcess = removeProcess;
downloads.addProcess = addProcess;
audioExtractions.removeProcess = removeProcess;
audioExtractions.addProcess = addProcess;


// Called to extract audio from downloaded video once the video is downloaded
extractAudioFromVideo = function(videoName, videoPath) {
  var extractionPath = audioDir + "/" + videoName.replace(/\s+/g, "_") + ".aac";
  console.log("Extracting audio from " + videoPath + " to " + extractionPath);
  
  var extractionProcessToSpawn = audioExtractCmd;
  extractionProcessToSpawn = extractionProcessToSpawn.replace("{inputFilename}", videoPath);
  extractionProcessToSpawn = extractionProcessToSpawn.replace("{outputFilename}", extractionPath);

  console.log("Extracting audio with command " + extractionProcessToSpawn);
  extractionProcessToSpawn = extractionProcessToSpawn.split(" ");
  var extractionProcess = Process.spawn(extractionProcessToSpawn[0], extractionProcessToSpawn.slice(1));

  audioExtractions.addProcess(extractionProcess);
  // TODO: Move the video rename into downloadAudio()
  extractionProcess.on("close", function(code) {  // Move video file to video dir
    extractionProcessReturnCode = code;
    fs.rename(videoPath, videoPath.replace(workingDir, videoDir), function(err) {
      if(err) throw err;
      console.log("Video successfully moved");
    });
  });
};

// Called when "Download audio" button is pressed
downloadAudio = function(videoId, site, videoName) {
  var cleanVideoName = videoName.replace(/\s+/g, "_");
  var downloadPath = workingDir + "/" + cleanVideoName;
  var processToSpawn = youtubedlCmd;
  processToSpawn = processToSpawn.replace("{videoId}", videoId);
  processToSpawn = processToSpawn.replace("{outputFilename}", downloadPath);
  console.log("Downloading video from " + site + " with command `" + processToSpawn + "`");

  processToSpawn = processToSpawn.split(" ");
  var process = Process.spawn(processToSpawn[0], processToSpawn.slice(1));

  downloads.addProcess(process);
  process.on("close", function(code) {  // Queue up an audio extraction process when DL completes
    console.log("Download completed with exit code " + code);
    if(0 !== code) {
      console.log("Download exited with non-zero exit code. Not extracting audio.")
    } else {
      var videoFiles = fs.readdirSync(workingDir);
      console.log("videoFiles: " + videoFiles);
      // Get the name of the downloaded file
      var matchingVideoFiles = videoFiles.filter(function(element, index, array) {
        return element.indexOf(cleanVideoName) > -1;
      });
      var videoToExtractAudioFrom = workingDir + "/" + matchingVideoFiles[0];
      console.log("Extracting audio from video " + videoToExtractAudioFrom);
      extractAudioFromVideo(videoName, videoToExtractAudioFrom);
    }
  });
}

