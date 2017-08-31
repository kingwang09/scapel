const express = require("express");
const handlebars = require("express-handlebars").create({
    defaultLayout:'main',
    helpers : {
      section : function(name, options){
        if(!this._sections){
          this._sections = {};
        }
        this._sections[name] = options.fn(this);
        return null;
      }
    }
});
const portNumber = 3000;
const bodyParser = require("body-parser");
const formidable = require("formidable");
const fs = require("fs");
const csv = require("./js/csvReader.js");
const UPLOAD_FOLDER = "/uploads";
const UPLOAD_FULL_PATH = __dirname + UPLOAD_FOLDER;

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set("view engine", "handlebars");

app.get("/",function(req,res){
  fs.readdir(UPLOAD_FULL_PATH,function(err,files){
    res.render("index",{uploadFiles:files});
  });
});

app.post("/file-upload", function(req,res){
  var form = new formidable.IncomingForm();
  form.uploadDir=UPLOAD_FULL_PATH;
  form.parse(req,function(err, fields, files){
      if(err){
        console.log(err);
        res.send("error");
      }
      fs.renameSync(files.file.path, UPLOAD_FULL_PATH+"/"+files.file.name);
      res.json({result : true});
  });
});

app.get("/file-delete/:fileName",function(req,res){
  fs.unlink(UPLOAD_FULL_PATH+'/'+req.params.fileName,function(){
      res.json({result:true});
  });
});

app.get("/file-read/:fileName",function(req,res){
  csv.csvReader(UPLOAD_FULL_PATH, req.params.fileName, {headers:true}, function(result){
    res.json(result);
  });
});

//view chart
app.get("/view-chart/:fileName",function(req,res){
  var fileName = req.params.fileName;
  csv.csvReader(UPLOAD_FULL_PATH, fileName, {headers:true, objectMode:true}, function(result){
    res.json(result);
  });
});

app.get("/setting-form/:fileName",function(req,res){
  var fileName = req.params.fileName;
  csv.csvReader(UPLOAD_FULL_PATH, fileName, {headers:true, objectMode:true}, function(result){
    res.json(result);
  });
});

app.get("/file-list",function(req,res){
  fs.readdir(UPLOAD_FULL_PATH,function(err,files){
    res.json({files : files});
  });
});

app.listen(portNumber, function(){
  console.log("listen : ",portNumber);
});
