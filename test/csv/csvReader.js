var fs = require("fs");
var csv = require("fast-csv");

var stream = fs.createReadStream(__dirname+"/sampleData.csv");
var csvStream = csv
    .parse({
      headers:true,
      objectMode:true
    })
    .on("data", function(data){
         console.log(data);
    })
    .on("end", function(){
         console.log("done");
    });

stream.pipe(csvStream);
