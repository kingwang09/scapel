function makeChart(id, chartType, response, fileName){
  var settingObject = getSettingObject(fileName);
  console.log("settingObject : ",settingObject);
  var categories = response.categories;
  var series = response.series;
  var xAxisType = "category";
  /*if(settingObject && settingObject.hasOwnProperty("xAxis")){
    categories = [settingObject.xAxis];
  }

  if(settingObject && settingObject.hasOwnProperty("series")){
    series = settingObject.series;
  }

  if(settingObject && settingObject.hasOwnProperty("xAxisType")){
    xAxisType = settingObject.xAxisType;
  }*/
  bb.generate({
    bindto: id,
    data: {
        type : chartType,
        labels:true,
        json: response.values,
        keys: {
          x: categories,//"교통사고", // it's possible to specify 'x' when category axis
          value: series
        }
    },
    axis:{
      x:{
        type : xAxisType,//"category",//timeseries,indexed
        tick : {
          count : 5
        }
      }
    }
  });
}
