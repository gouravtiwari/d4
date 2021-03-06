(function() {
  /*!
   * global d3: false
   * global d4: false
   */
  'use strict';

  var lineChartBuilder = function() {
    var extractValues = function(data, key) {
      var values = data.map(function(obj){
        return obj.values.map(function(i){
          return i[key];
        }.bind(this));
      }.bind(this));
      return d3.merge(values);
    };

    var configureX = function(chart, data) {
      if (!chart.x) {
        var xData = extractValues(data, chart.xKey);
        chart.xRoundBands = chart.xRoundBands || 0.3;
        chart.x = d3.scale.ordinal()
          .domain(xData)
          .rangeRoundBands([0, chart.width - chart.margin.left - chart.margin.right], chart.xRoundBands);
      }
    };

    var configureY = function(chart, data) {
      if (!chart.y) {
        var yData = extractValues(data, chart.yKey);
        var ext = d3.extent(yData);
        chart.y = d3.scale.linear().domain(ext);
      }
      chart.y.range([chart.height - chart.margin.top - chart.margin.bottom, 0])
        .clamp(true)
        .nice();
    };

    var configureScales = function(chart, data) {
      configureX.bind(this)(chart, data);
      configureY.bind(this)(chart, data);
    };

    var builder = {
      configure: function(chart, data) {
        configureScales.bind(this)(chart, data);
      }
    };
    return builder;
  };

  /*
  The line series chart is used to compare a series of data elements grouped
  along the xAxis.

   * **lineSeries** - series lines
   * **lineSeriesLabels** - data labels beside the lines
   * **xAxis** - the axis for the x dimension
   * **yAxis** - the axis for the y dimension

##### Example Usage

    var data = [
      { year: '2010', unitsSold:-100, salesman : 'Bob' },
      { year: '2011', unitsSold:200, salesman : 'Bob' },
      { year: '2012', unitsSold:300, salesman : 'Bob' },
      { year: '2013', unitsSold:400, salesman : 'Bob' },
      { year: '2014', unitsSold:500, salesman : 'Bob' },
      { year: '2010', unitsSold:100, salesman : 'Gina' },
      { year: '2011', unitsSold:100, salesman : 'Gina' },
      { year: '2012', unitsSold:-100, salesman : 'Gina' },
      { year: '2013', unitsSold:500, salesman : 'Gina' },
      { year: '2014', unitsSold:600, salesman : 'Gina' },
      { year: '2010', unitsSold:400, salesman : 'Average' },
      { year: '2011', unitsSold:0, salesman : 'Average' },
      { year: '2012', unitsSold:400, salesman : 'Average' },
      { year: '2013', unitsSold:400, salesman : 'Average' },
      { year: '2014', unitsSold:400, salesman : 'Average' }
    ];
    var parsedData = d4.parsers.nestedGroup()
      .x(function(){
        return 'year';
      })
      .nestKey(function(){
        return 'salesman';
      })
      .y(function(){
        return 'unitsSold';
      })
      .value(function(){
        return 'unitsSold';
      })(data);

    var chart = d4.lineChart()
    .width($('#example').width())
    .xKey('year')
    .yKey('unitsSold');

    d3.select('#example')
    .datum(parsedData.data)
    .call(chart);

  */
  d4.lineChart = function lineChart() {
    var chart = d4.baseChart({}, lineChartBuilder);
    [{
      'linesSeries': d4.features.lineSeries
    },{
      'linesSeriesLabels': d4.features.lineSeriesLabels
    }, {
      'xAxis': d4.features.xAxis
    }, {
      'yAxis': d4.features.yAxis
    }].forEach(function(feature) {
      chart.mixin(feature);
    });
    return chart;
  };
}).call(this);