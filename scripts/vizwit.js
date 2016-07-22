/*eslint no-new:0*/
var _ = require('underscore')
var Backbone = require('backbone')

var Providers = require('./config/providers')
var GeoJSON = require('./collections/geojson')

var Bar = require('./views/bar')
var d3bar = require('./views/d3bar')
var Table = require('./views/table')
var DateTime = require('./views/datetime')
var Choropleth = require('./views/choropleth')
var Pie = require('./views/pie')
var Callout = require('./views/callout')
var Map = require('./views/map')
var Clustered = require('./views/clustered')

exports.init = function (container, config, opts) {
  // If globals weren't passed, create them within this scope
  opts = opts || {}
  opts.vent = opts.vent || _.clone(Backbone.Events)
  opts.fieldsCache = opts.fieldsCache || {}

  // Get provider
  if (!config.provider) config.provider = 'socrata' // set default for backwards compatibility
  var Provider = Providers[config.provider.toLowerCase()]
  if (!Provider) console.error('Unrecognized provider %s', config.provider)

  // Initialize collection
  var collection = new Provider(null, {
    config: config,
    fieldsCache: opts.fieldsCache
  })

   var noCollection = new Provider(null, {
	  config: config,
	  fieldsCache: opts.feildsCache
  }) 
  var filteredCollection = new Provider(null, {
    config: config,
    fieldsCache: opts.fieldsCache
  })

  // Initialize view
  switch (config.chartType) {
    case 'bar':
      new Bar({
        config: config,
        el: container,
        collection: collection,
        filteredCollection: filteredCollection,
        vent: opts.vent
      })
      break
    case 'd3bar':
      new d3bar({
        config: config,
        el: container,
        collection: collection,
        filteredCollection: filteredCollection,
        vent: opts.vent
      })
      break
	case 'clustered':
	  new Clustered({
		config: config,
		el: container,
		collection: collection,
		noCollection: noCollection,
		filteredCollection: filteredCollection,
		vent: opts.vent
	  })
	  break
	case 'map':
	  new Map({
		  config: config,
		  el: container,
		  collection: collection,
		  filteredCollection: filteredCollection,
		  vent: opts.vent
	  })
	  break
    case 'datetime':
      new DateTime({
        config: config,
        el: container,
        collection: collection,
		noCollection: noCollection,
        filteredCollection: filteredCollection,
        vent: opts.vent
      })
      break
    case 'pie':
      collection.setDontFilterSelf(true)
      filteredCollection.setDontFilterSelf(true)
      new Pie({
        config: config,
        el: container,
        collection: collection,
        filteredCollection: filteredCollection,
        vent: opts.vent
      })
      break
    case 'table':
      new Table({
        config: config,
        el: container,
        collection: collection,
        vent: opts.vent
      })
      break
    case 'choropleth':
      new Choropleth({
        config: config,
        el: container,
        collection: collection,
        boundaries: new GeoJSON(null, config),
        filteredCollection: filteredCollection,
        vent: opts.vent
      })
      break
    case 'callout':
      new Callout({
        config: config,
        el: container,
        collection: collection,
        filteredCollection: filteredCollection,
        vent: opts.vent
      })
      break
  }
}
