var $ = require('jquery')
var _ = require('underscore')
var BaseChart = require('./basechart')
var numberFormatter = require('../util/number-formatter')

module.exports = BaseChart.extend({
  settings: {
    graphs: [
      {
        type: 'column',
        title: 'Data',
        valueField: 'value',
        fillAlphas: 0.6,
		bullet: "yError",
		bulletAxis: "yAxis",
		bulletSize: 10,
		errorField: "error",
        clustered: false,
        lineColor: '#97bbcd',
		bulletColor: '#000000',
		bulletBorderThickness: 1,
		bulletAlpha: 0.6,
        balloonText: '<b>Overall<br>[[value]]%</b><br>CI([[ci_low]] - [[ci_high]]), n = [[sample_size]]'
      }
    ],
    chart: {
      type: 'serial',
      theme: 'light',
	  columnWidth: 0.5,
      responsive: {
        enabled: true,
        rules: [
          {
            maxWidth: 600,
            overrides: {
              maxSelectedSeries: 5
            }
          },
          {
            maxWidth: 450,
            overrides: {
              maxSelectedSeries: 3,
              chartCursor: {
                enabled: false
              }
            }
          }
        ]
      },

      addClassNames: true,
      categoryField: 'label',
	  autoMargins: false,
      marginLeft: 50,
      marginRight: 0,
      marginTop: 0,
	  marginBottom: 40,
      valueAxes: [{
		id: "yAxis",
		autoGridCount: false,
		gridCount: 20,
        labelFunction: numberFormatter,
        position: 'left',
		minimum: 0,
        axisThickness: 0,
        axisAlpha: 0,
        tickLength: 0,
		title: "Percent (%)",
        includeAllValues: true,
        ignoreAxisWidth: true,
        gridAlpha: 0.2
      }],
/*       chartCursor: {
        fullWidth: true,
        cursorAlpha: 0.2,
        zoomable: false,
        oneBalloonOnly: true,
		graphBulletSize: 1,
        categoryBalloonEnabled: false
      }, */
      maxSelectedSeries: 10,
      // startDuration: 0.5,
      // startEffect: 'easeOutSine',
      zoomOutText: '',
      creditsPosition: 'bottom-right',
      categoryAxis: {
        autoWrap: true,
        gridAlpha: 0,
        labelFunction: function (label) {
          return label && label.length > 12 ? label.substr(0, 12) + '…' : label
        },
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
      }
    }
  },
  initialize: function (options) {
    BaseChart.prototype.initialize.apply(this, arguments)

    _.bindAll(this, 'onClickCursor', 'onClickBar', 'onClickLabel', 'onHover', 'onClickScroll', 'zoomToBeginning')
  },
  events: {
    'click .scroll a': 'onClickScroll'
  },
  render: function () {
    BaseChart.prototype.render.apply(this, arguments)

    // If there are greater than 10 bars, zoom to the first bar (ideally this would be done by configuration)
    this.chart.addListener('drawn', this.zoomToBeginning)
    //this.zoomToBeginning() // since rendered isn't called the first time

    // Listen to cursor hover changes
   // this.chart.chartCursor.addListener('changed', this.onHover)

    // Listen to label clicks
    //this.chart.categoryAxis.addListener('clickItem', this.onClickLabel)

    // If chart cursor is enabled (on larger screens) listen to clicks on it
/*     if (this.chart.chartCursor.enabled) {
      this.delegateEvents(_.extend({'click .card-content': 'onClickCursor'}, this.events))
    // Otherwise listen to clicks on the bars
    } else {
      this.chart.addListener('clickGraphItem', this.onClickBar)
    } */

    // If there are more records than the default, show scroll bars
	if (this.collection) {
    if (this.chart.endIndex - this.chart.startIndex < this.collection.length) {
      this.$('.scroll').removeClass('hidden')
    }
	}
  },
  zoomToBeginning: function () {
    if (this.collection.length > this.chart.maxSelectedSeries) {
      this.chart.zoomToIndexes(0, this.chart.maxSelectedSeries)
    }
  },
  onClickScroll: function (e) {
    var modification = $(e.currentTarget).data('dir') === 'decrease' ? -1 : 1
    var displayCount = this.chart.maxSelectedSeries
    var start = Math.min(this.collection.length - 1 - displayCount, Math.max(0, this.chart.startIndex + modification))
    var end = Math.max(displayCount, Math.min(this.collection.length - 1, this.chart.endIndex + modification))

    if (start !== this.chart.startIndex || end !== this.chart.endIndex) {
      this.chart.zoomToIndexes(start, end)
    }
    e.preventDefault()
  },
  // Keep track of which column the cursor is hovered over
  onHover: function (e) {
    if (e.index == null) {
      this.hovering = null
    } else {
      this.hovering = this.chart.categoryAxis.data[e.index]
    }
  },
  // When the user clicks on a bar in this chart
  onClickCursor: function (e) {
    if (this.hovering !== null) {
      this.onSelect(this.hovering.category)
    }
  },
  onClickBar: function (e) {
    this.onSelect(e.item.category)
  },
  onClickLabel: function (e) {
    this.onSelect(e.serialDataItem.category)
  },
  onSelect: function (category) {
    // If already selected, clear the filter
    var filter = this.filteredCollection.getFilters(this.filteredCollection.getTriggerField())
    if (filter && filter.expression.value === category) {
      this.vent.trigger(this.collection.getDataset() + '.filter', {
        field: this.filteredCollection.getTriggerField()
      })
    // Otherwise, add the filter
    } else {
      // Trigger the global event handler with this filter
      this.vent.trigger(this.collection.getDataset() + '.filter', {
        field: this.collection.getTriggerField(),
        expression: {
          type: '=',
          value: category
        }
      })
    }
  }
})
