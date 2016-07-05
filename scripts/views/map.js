var $ = require('jquery')
var _ = require('underscore')
var BaseChart = require('./basechart')
var numberFormatter = require('../util/number-formatter')

module.exports = BaseChart.extend({
  settings: {
    chart: {
		type: "map",
		theme: "none",

		colorSteps: 100,
		zoomOnDoubleClick: false,
		dragMap: false,

		areasSettings: {
			autoZoom: false,
			balloonText: "<b>[[title]]</b><br>[[description]]",
			color: "#A9C7D6",
			colorSolid: "#538EAC",
			rollOverOutlineColor: "#000000",
			selectedColor: "#ddd64b",
			descriptionWindowTop: 200,
			descriptionWindowRight: -50,
			descriptionWindowWidth: 0
		},

		valueLegend: {
			right: 10,
			minValue: "Low",
			maxValue: "High",
			showAsGradient: true
		},
		

	}
}
  /*initialize: function (options) {
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
    this.zoomToBeginning() // since rendered isn't called the first time

    // Listen to cursor hover changes
    this.chart.chartCursor.addListener('changed', this.onHover)

    // Listen to label clicks
    this.chart.categoryAxis.addListener('clickItem', this.onClickLabel)

    // If chart cursor is enabled (on larger screens) listen to clicks on it
    if (this.chart.chartCursor.enabled) {
      this.delegateEvents(_.extend({'click .card-content': 'onClickCursor'}, this.events))
    // Otherwise listen to clicks on the bars
    } else {
      this.chart.addListener('clickGraphItem', this.onClickBar)
    }

    // If there are more records than the default, show scroll bars
    if (this.chart.endIndex - this.chart.startIndex < this.collection.length) {
      this.$('.scroll').removeClass('hidden')
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
  } */
})
