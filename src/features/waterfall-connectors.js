(function() {
  'use strict';
  /*!
   * global d3: false
   * global d4: false
   */

/*
Waterfall connectors are orthogonal series connectors which visually join
column series together by spanning the top or bottom of adjacent columns.

When using this feature in charts other than waterfall, be aware that the
mixin expects an accessor property for `orientation`, which it uses to render
the direction of the lines.

##### Accessors

`x` - Used in placement of the connector lines.
`y` - Used in placement of the connector lines.
`span` - calculates the length of the connector line
`classes` - applies the class to the connector lines.

*/
  d4.features.waterfallConnectors = function(name) {
    return {
      accessors: {
        x: function(d) {
          if(this.orientation() === 'horizontal'){
            var width = 0;
            var xVal = (d.y0 + d.y) - Math.max(0, d.y);
            if(d.y > 0){
              width = Math.abs(this.x(d.y0) - this.x(d.y0 + d.y));
            }
            return this.x(xVal) + width;
          } else {
            return this.x(d[this.xKey]);
          }
        },

        y: function(d) {
          if(this.orientation() === 'horizontal'){
            return this.y(d[this.yKey]);
          } else {
            return this.y(d.y0 + d.y);
          }
        },

        span: function(){
          if(this.orientation() === 'horizontal'){
            return this.y.rangeBand();
          } else {
            return this.x.rangeBand();
          }
        },

        classes : function(d, i){
          return 'series' +i;
        }
      },

      render: function(scope, data) {
        this.featuresGroup.append('g').attr('class', name);
        var lines = this.svg.select('.' + name).selectAll('.' + name).data(function(d) {
          return d.map(function(o) {
            return o.values[0];
          });
        }.bind(this));
        lines.enter().append('line');
        lines.exit().remove();
        lines
        .attr('class', scope.accessors.classes.bind(this))
        .attr('x1', function(d, i) {
          if(i === 0){
            return 0;
          }
          return scope.accessors.x.bind(this)(data[i - 1].values[0]);
        }.bind(this))

        .attr('y1', function(d, i) {
          if(i === 0){
            return 0;
          }
          return scope.accessors.y.bind(this)(data[i - 1].values[0]);
        }.bind(this))

        .attr('x2', function(d, i) {
          if(i === 0){
            return 0;
          }
          if(this.orientation() === 'vertical') {
            return scope.accessors.x.bind(this)(d) + scope.accessors.span.bind(this)();
          } else {
            return scope.accessors.x.bind(this)(data[i - 1].values[0]);
          }
        }.bind(this))

        .attr('y2', function(d, i) {
          if(i === 0){
            return 0;
          }
          if(this.orientation() === 'vertical') {
            return scope.accessors.y.bind(this)(data[i - 1].values[0]);
          }else {
            return scope.accessors.y.bind(this)(d) + scope.accessors.span.bind(this)(d);
          }
        }.bind(this));

        return lines;
      }
    };
  };
}).call(this);
