var scapel = window.scapel || {};
scapel.utils = scapel.utils || {};

scapel.utils.makeChart = function(id, chartType, response, fileName) {
  var categories = response.categories;
  var series = response.series;
  var xAxisType = "category";
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
        type : xAxisType,//,//"category",//timeseries,indexed
        tick : {
          count : 12
        }
      }
    }
  });
};
scapel.utils.highlight = function(targetClass, toggleClass, $active) {
  $(targetClass).removeClass(toggleClass);
  $active.addClass(toggleClass);
};

scapel.utils.btnHighlight = function(target, targetClass, $btn) {
  var $target = $(target).find(targetClass);
  $target.removeClass("btn-primary");
  $target.addClass("btn-secondary");
  $btn.removeClass("btn-secondary");
  $btn.addClass("btn-primary");
};
