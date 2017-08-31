function Scapel(fileName, isFirst, index){
  var that = this;
  this.id = new Date().getTime();
  this.id = index ? this.id + '-' + index : this.id;
  this.fileName = fileName;
  this.isFirst = isFirst || false;
  this.tableData;
  this.chartData;

  this.setTableData(true);
  this.setChartData(false);
  this.makeMainContainer();
}

Scapel.prototype.setTableData = function(isRender) {
  var that = this;
  if(typeof this.chartData === 'undefined') {
      $.ajax({
          url: '/file-read/'+this.fileName,
          success:function(response) {
            that.tableData = response;
            that.tableData.id = that.id;
            if(isRender) {
              that.makeViewContainer();
            }
          }
      });
  }
};

Scapel.prototype.setChartData = function(isRender) {
  var that = this;
  if(typeof this.chartData === 'undefined') {
      $.ajax({
        url : '/view-chart/'+this.fileName,
        success : function(response){
            that.chartData = response;
            that.chartData.id = that.id;
            if(isRender) {
              that.makeViewContainer('chartTemplate');
            }
        }
      });
  }
};

Scapel.prototype.makeMainContainer = function() {
  var that = this;
  var panelId = '#panel-'+this.id;
  var btnClassName = '.btn-mode';
  var viewContainerId = 'viewContainer-'+this.id;
  var mainTemplate = Handlebars.compile($("#mainContainerTemplate").html());
  var render = mainTemplate({id: this.id, fileName : this.fileName.substring(0, this.fileName.lastIndexOf('.'))});
  this.isFirst ? $("#mainContainer").html(render) : $("#mainContainer").append(render);
  //$("#mainContainer").append(mainTemplate({id: this.id}));
  //renderMethod(mainTemplate({id: this.id}));

  //Table Mode
  $("#panel-"+this.id).on("click", "button.btn-table-mode", function(){
    var tableTemplate;
    scapel.utils.btnHighlight(panelId, btnClassName, $(this));
    tableTemplate = Handlebars.compile($("#tableTemplate").html());
    $('#'+viewContainerId).html(tableTemplate(that.tableData));
  });

  //Chart Mode
  $("#panel-"+this.id).on("click", "button.btn-chart-mode", function(){
    var $chartBtn = $(this);
    var chartId = '#chart-'+that.id;
    var chartType = $chartBtn.attr("chartType");
    var chartTemplate;
    scapel.utils.btnHighlight(panelId, btnClassName, $chartBtn);
    //make char
    chartTemplate = Handlebars.compile($("#chartTemplate").html());
    $('#'+viewContainerId).html(chartTemplate(that.chartData));
    scapel.utils.makeChart(chartId, chartType, that.chartData, that.fileName);
  });

  $("#close-"+this.id).on("click", function() {
    var removeIndex = -1;
    if( that.isFirst ){
        alert("메인 카드는 지울 수 없습니다.");
    } else {
        $("#panel-"+that.id).remove();
        scapel.selected.findIndex(function(o, i) {
          if(that.id === o.id){
            scapel.selected.splice(removeIndex, 1);
          }
        });

    }
  });
};

Scapel.prototype.makeViewContainer = function(viewContainerId) {
  viewContainerId = viewContainerId || 'tableTemplate';
  var viewTemplate = Handlebars.compile($('#'+viewContainerId).html());
  $('#viewContainer-'+this.id).html(viewTemplate(viewContainerId === 'tableTemplate' ? this.tableData : this.chartData));
};

Scapel.prototype.remove = function() {
  $.ajax({
    url : '/file-delete/'+this.fileName,
    success:function(response){
      if(response.result){
        scapel.selected.remove(this);
        location.href="/";
      }
    }
  });
};

Scapel.prototype.toString = function() {
  return 'Scapel[ id = '+this.id+', fileName = '+this.fileName+']';
};
