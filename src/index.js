const fs = require('fs');
const fileExtension = require('file-extension');
const request = require('request');

const options = {
  source: "./source",
  output: "./output"
}

/**--------------------------------
 *    Functions
 *---------------------------------
*/

function readerFloder(folder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) {
        return reject(err);
      }
      return resolve(files);
    });
  });
}

function sendFile(filepath) {
  return new Promise(resolve => {
    const option = {
      url: "upload-file",
      method: 'POST'
    }
    const r = request(option, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return resolve({ "success": true, message: err });
      }
      return resolve({ "success": true, message: body, statusCode: httpResponse.statusCode, statusMessage: httpResponse.statusMessage });
    });
    const form = r.form();
    form.append('file', fs.createReadStream(options.source + '/' + filepath), filepath);


  });
}


async function runSendFile() {
  const files = await readerFloder(options.source);
  console.log("start ----------->>");
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    var ext = fileExtension(file);
    if (ext == "xlsx") {
      console.log("file : "+index);
      const resp = await sendFile(file);
      console.log("httpResponse" ,resp);
    }
  }
  console.log("End ----------->>");
}

runSendFile();
