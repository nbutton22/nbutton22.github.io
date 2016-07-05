var _ = require('underscore')
var BaseChart = require('./basechart')
var numberFormatter = require('../util/number-formatter')
;require('amcharts3')
var AmCharts = window.AmCharts
AmCharts.path = './'

var trimLastCharacter = function (str) {
  return str.substr(0, str.length - 1)
}

module.exports = BaseChart.extend({
  settings: {
    collectionOrder: 'label',
    graphs: [
      {
        title: 'Yes',
        valueField: 'yes',
		bullet: 'round',
        fillAlphas: 0,
        lineThickness: 3,
        clustered: false,
        lineColor: '#97bbcd',
        balloonText: '<b>[[category]]<br>Overall<br>Yes: [[yes]]%</b><br>CI([[ci_low]] - [[ci_high]]), n = [[sample_size]]'
      },
	  {
		  title: 'No',
		  valueField: 'no',
		  bullet: 'square',
		  fillAlphas: 0,
		  lineThickness: 3,
		  clustered: false,
		  lineColor: '#b398cd',
		  balloonText: '<b>[[category]]<br>Overall<br>No: [[no]]%</b><br>CI([[ci_low]] - [[ci_high]]), n = [[sample_size]]'
	  },
      {
        title: 'Filtered Data',
        valueField: 'filteredValue',
        fillAlphas: 0.4,
        lineThickness: 4,
        clustered: false,
        lineColor: '#97bbcd',
        dateFormat: 'MMM YYYY',
        balloonFunction: function (item, graph) {
          return '<b>' + AmCharts.formatDate(item.category, graph.dateFormat) + '</b><br>' +
						'Total: ' + (+item.dataContext.value).toLocaleString() + '<br>' +
						'Filtered Amount: ' + (+item.dataContext.filteredValue).toLocaleString()
        }
      }
    ],
    chart: {
      type: 'serial',
      theme: 'light',
      responsive: {
        enabled: true
      },
      addClassNames: true,
      categoryField: 'label',
      marginLeft: 50,
      marginRight: 0,
      marginTop: 0,
	  legend: {
		  enabled: true,
		  position: 'right'
	  },
      valueAxes: [{
        labelFunction: numberFormatter,
        position: 'left',
		title: "Percent (%)",
        axisThickness: 0,
        axisAlpha: 0,
        tickLength: 0,
        minimum: 0,
		autoGridCount: false,
		gridCount: 20,
        gridAlpha: 0.2
      }],
      categoryAxis: {
        autoWrap: true,
        parseDates: false,
        //minPeriod: 'YYYY',
        gridAlpha: 0,
        guides: [{
          lineThickness: 2,
          lineColor: '#ddd64b',
          fillColor: '#ddd64b',
          fillAlpha: 0.4,
          // label: 'Filtered',
          // inside: true,
          // color: '#000',
          balloonText: 'Currently filtered',
          expand: true,
          above: true
        }]
      },
      //dataDateFormat: 'YYYY-MM-DDT00:00:00.000', // "2015-04-07T16:21:00.000"
      creditsPosition: 'bottom-right',
      chartCursor: {
        categoryBalloonDateFormat: 'YYYY',
        cursorPosition: 'mouse',
        selectWithoutZooming: true,
        oneBalloonOnly: true,
		graphBulletSize: 1,
        categoryBalloonEnabled: false
      }
    }
  },
  initialize: function () {
    BaseChart.prototype.initialize.apply(this, arguments)

    _.bindAll(this, 'onClick')
  },
  render: function () {
    BaseChart.prototype.render.apply(this, arguments)

    // Listen to when the user selects a range
    this.chart.chartCursor.addListener('selected', this.onClick)
  },
  // When the user clicks on a bar in this chart
  onClick: function (e) {
    // console.log('Filtered by', (new Date(e.start)).toISOString(), (new Date(e.end)).toISOString())
    var field = this.collection.getTriggerField()

    var start = new Date(e.start)
    var startIso = trimLastCharacter(start.toISOString())
    var startFriendly = start.toLocaleDateString()

    var end = new Date(e.end)
    var endIso = trimLastCharacter(end.toISOString())
    var endFriendly = end.toLocaleDateString()

    // Trigger the global event handler with this filter
    this.vent.trigger(this.collection.getDataset() + '.filter', {
      field: field,
      expression: {
        type: 'and',
        value: [
          {
            type: '>=',
            value: startIso,
            label: startFriendly
          },
          {
            type: '<=',
            value: endIso,
            label: endFriendly
          }
        ]
      }
    })
  }
})
