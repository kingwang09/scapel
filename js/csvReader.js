
const fs = require("fs");
const csv = require("fast-csv");
const _ = require("underscore");

module.exports.csvReader = csvReader;

function csvReader(path, fileName, options, doneCallback){
  var stream = fs.createReadStream(path+"/"+fileName);
  var headers = [];
  var values = [];
  var isHeader = true;
  var csvStream = csv
      .parse(options)
      .on("data", function(data){
          if(options.headers && isHeader){
            headers = _.keys(data);
            //headers = data;
            isHeader = false;
          }
          values.push(data);
      })
      .on("end", function(){
          var result = {headers : headers, values : values};
          result.categories = headers.slice()[0];
          result.series = headers.slice().splice(1);
          result.fileName = fileName;
          doneCallback(result);
      });

  stream.pipe(csvStream);
}
