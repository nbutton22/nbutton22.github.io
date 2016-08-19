





/**
 *  Abstract function to make a simple bar chart with any data
 *  
 *  dataProvider -- JSON array of data to graph
 *		fields:
 *			value -- the numerical value
 *			label -- label (this will go on x axis)
 *
 *			--Fields above should be required for any bar chart--
 *			--Fields below are specific to my application with the CDC BRFSS Data--can be commented out if they are not part of data set--
 *
 *			sample_size -- the sample size of the data
 *			ci_high -- the upper end of the confidence interval for the data
 *			ci_low -- the lower end of the confidence interval for the data
 *
 *
 *	container -- pass in the div to write the graph in
 *			- the graph will be sized to fit the div, so set the width and height of your div beforehand
 *
 *
 *	config -- optional configuration object -- all color string accept hex color, rgb/rgba color value, or simple name
 *		fields: (can use as many or as few as you want to define)
 *			margin -- object containing margins
 *				top -- top margin -- default 0 -- add more for title
 *				bottom -- bottom margin -- default 40 for x-axis label room
 * 				left -- left margin -- default 50 for y-axis label room
 *				right -- right margin -- default 0 -- add more for legend
 *			widthRatio -- fraction representing how wide the bar is relative to the space it could take (value of 1 means the bars are all touching) -- default 0.5
 *			yAxisLabel -- text label for y Axis -- default ""
 *			title -- text label for graph title -- default ""
 *			bar -- object containing bar style
 *				fill -- color of bar as string -- default 'rgba(151, 187, 205, 0.6)'
 *				opacity -- opacity of the bars -- default 0.6
 *				border -- color of bar border as string -- default '#97bbcd'
 *				borderWidth -- width of border in px -- default 1
 *			tooltipsEnabled -- boolean value whether tooltips are enabled -- default true
 *			tooltipColor -- color of border of tooltip as string -- defaults to color of bar border
 *			tooltipBackground -- color of background of tooltip as string -- defaults to '#FFF'
 *			errorBar -- object containing error bar styling (if applicable to data set)
 *				color -- color of error bar as string -- default '#000'
 *				width -- width of error bar -- default 1
 *				opacity -- opacity of error bar -- default 0.6
 *
 *
 * 	Link this script in an html doc and call the function with the required params
 * 	Style for d3 elements in html doc
 */
function makeBarChart(dataProvider, container, config) {
		
		
		////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//Set all default config values if undefined
		
		if (config == null) {
			var config = {}
		}
		if (config.margin == null) {
			config.margin = {
				top: 0,
				bottom: 40,
				left: 50,
				right: 0,
			}
		} else {
			//individually define margins if only some are set
			if (config.margin.top == null) {
				config.margin.top = 0
			}
			if (config.margin.bottom == null) {
				config.margin.bottom = 40
			}
			if (config.margin.left == null) {
				config.margin.left = 50
			}
			if (config.margin.right == null) {
				config.margin.right = 0
			}
		}
		
		if (config.widthRatio == null) {
			config.widthRatio = 0.5
		}
		
		if (config.yAxisLabel == null) {
			config.yAxisLabel = ""
		}
		
		if (config.title == null) {
			config.title = ""
		}
		
		if (config.bar == null) {
			config.bar = {
				fill: 'rgba(151, 187, 205, 0.6)',
				opacity: 0.6,
				border: '#97bbcd',
				borderWidth: 1
			}
		} else {
			//set values if only some are set
			if (config.bar.fill == null) {
				config.bar.fill = 'rgba(151, 187, 205, 0.6)'
			}
			if (config.bar.opacity == null) {
				config.bar.opacity = 0.6
			}
			if (config.bar.border == null) {
				config.bar.border = '#97bbcd'
			}
			if (config.bar.borderWidth == null) {
				config.bar.borderWidth = 1
			}
		}
		
		if (config.tooltipsEnabled == null) {
			config.tooltipsEnabled = true
		}
		
		if (config.errorBar == null) {
			config.errorBar = {
				color: '#000',
				width: 1,
				opacity: 0.6
			}
		}
		
		if (config.tooltipBackground == null) {
			config.tooltipBackground = '#FFF'
		}
		
		if (config.tooltipColor == null) {
			config.tooltipColor = config.bar.border
		}
		
		//done setting defaults
		////////////////////////////////////////////////////////////////////////////////////////////
		
		
		
		//get height and width of graph by extracting container size and subtracting margins
		var style = window.getComputedStyle(container)
		var divwidth = style.getPropertyValue('width')
		divwidth = Number(divwidth.slice(0, divwidth.length - 2))
		var divheight = style.getPropertyValue('height')
		divheight = Number(divheight.slice(0, divheight.length - 2))
		var height = divheight - config.margin.top - config.margin.bottom;
		var width = divwidth - config.margin.left - config.margin.right;
		//get coordinates of container
		var containerInfo = document.getElementById(config.cardId).getBoundingClientRect()
		var containerTop = containerInfo.top
		var containerLeft = containerInfo.left
		
		//create a vertical scale for the bars
		var yScale = d3.scaleLinear()
			//multiply by 1.1 to leave a little room at the top of the graph
			.domain([0, 1.1 * d3.max(dataProvider, function(data) { return data.value })])
			.range([0, height])
		
		//scale for y axis
		var yAxisScale = d3.scaleLinear()
			.domain([0, 1.1 * d3.max(dataProvider, function(data) { return data.value })])
			.range([height, 0])
		
		//ordinal scale for x axis categories
		var xScale = d3.scaleBand()
			.domain(dataProvider.map(function(d) {return d.label}))
			.range([0, width])
		
		//create axes
		//create x axis using xScale defined above
		var xAxis = d3.axisBottom(xScale)
			.tickSizeOuter(0)

		//create y axis using yAxisScale defined above
		var yAxis = d3.axisLeft(yAxisScale)
			.tickSize(0)
		
		//grid is simply a y axis with long (length of width of the graph) ticks going in the opposite direction (-width)
		var yGrid = d3.axisLeft(yAxisScale)
			.tickSizeInner(-width)
			.tickSizeOuter(0)
		
		
		//sets horizontal bar offset to fulfill widthRatio description
		var barOffset = xScale.bandwidth() * config.widthRatio / 2
		
		
		//make the graph
		var svg = d3.select(container).append('svg') //svg object will hold all parts of the graph
		svg.attr('width', width + config.margin.left + config.margin.right) //svg size the original size of the container
		svg.attr('height', height + config.margin.top + config.margin.bottom)
		svg.append('g') //object to contain y axis
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')')
			.call(yAxis)
		svg.append('g') //object to contain the horizontal grid lines
			.attr('class', 'grid')
			.attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')')
			.call(yGrid)
		svg.append('text') //object to contain y axis label
			.attr('class', 'yTitle')
			//rotate object so it is vertical and shift to position on y axis
			.attr('transform', 'rotate(-90)')
			.attr('x', -1 * width / 2)
			.attr('y', config.margin.left / 3)
			.style('font-weight', 'bold')
			.text(config.yAxisLabel)
		svg.append('text') //object to contain graph title
			.attr('class', 'title')
			//shift to center of graph
			.attr('x', width / 2)
			.attr('y', config.margin.top / 2)
			.style('font-weight', 'bold')
			.text(config.title)
		svg.append('g') // object to contain x axis
			.attr('class', 'x axis')
			.attr('transform', 'translate(' + config.margin.left + ',' + (config.margin.top + height) + ')')
			.call(xAxis)
		var div = d3.select(container).append('div') // initialize tooltip, simply a div that we will make appear and disappear
			.attr('id', 'tooltip')
			.attr('class', 'tooltip')
			.style('opacity', 0) // initially invisible
			.style('border-color', config.tooltipColor)
			.style('background', config.tooltipBackground)
		var arrow = d3.select(container).append('div') // arrow for the tooltip
			.style('opacity', 0)
		var chart = svg.append('g') //object to contain the actual graph
		chart.attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')')
		chart.selectAll('rect').data(dataProvider) //data join to join rectangles (bars) to dataProvider object
			.enter().append('rect') //essentially loops through all of the data and creates a rectangle at each index
				//all subsequent inner functions have optional data and index parameter
				.attr('id', function(d, i) { return config.cardId + 'rect' + i}) //set unique id for access later based on index
				//set width and style aspects of bar
				.attr('width', xScale.bandwidth() * config.widthRatio)
				.attr('fill', config.bar.fill)
				.attr('opacity', config.bar.opacity)
				.attr('stroke', config.bar.border)
				.attr('strokeWidth', config.bar.borderWidth)
				.attr('height', function(d) {return yScale(d.value)}) //yScale gives a height interpolated based on the current data value and the max data value in the set
				.attr('x', function(d) {
							return xScale(d.label) + barOffset; //use ordinal xScale with the label to get the x coordinate of the bar, use bar offset to center bar based on width
						})
				.attr('y', function(d) {return height - yScale(d.value)}) //the origin is at the top of the graph, shift the y coordinate by the difference between the total height and bar height
				.on('mouseover', function(d, i) { //listens for mouse to enter the bar object
					if (config.tooltipsEnabled) { //only do all of this if the tooltips are enabled
						if (d.sample_size == null || d.ci_low == null || d.ci_high == null) {
							//generic tooltip just showing the value
							div.html('Overall<br>' + d.value + "%")
						} else {
							//the text for my purposes with the confidence interval and sample size
							div.html('<b>Overall<br>' + d.value + '%</b><br>CI(' + d.ci_low + ' - ' + d.ci_high + '), n = ' + d.sample_size)
						}
						
						//get the dimensions of the tooltip div
						var style = window.getComputedStyle(document.getElementById('tooltip'))
						var mywidth = style.getPropertyValue('width')
						mywidth = Number(mywidth.slice(0, mywidth.length - 2))
						var myheight = style.getPropertyValue('height')
						myheight = Number(myheight.slice(0, myheight.length - 2))
						
						//get the coordinates of the bar relative to the container
						var offsets = document.getElementById(config.cardId + 'rect' + i).getBoundingClientRect();
						var top = offsets.top + window.scrollY;
						var left = offsets.left;
						
						//check whether the tooltip should be above the bar with the arrow pointing down or below with the arrow pointing up
						//based on how tall the bar is relative to the chart space
						if ((yScale(d.value) + myheight) < (0.92 * height)) {
							arrow.attr('class', 'arrow-down')
							arrow.style('border-top', '5px solid' + config.tooltipColor)
							arrow.style('border-bottom', '5px solid transparent')
							//boxshift and arrowshift to move the tooltip above the bar
							var boxshift = -1 * myheight - 10
							var arrowshift = -5
						} else {
							arrow.attr('class', 'arrow-up')
							arrow.style('border-bottom', '5px solid' + config.tooltipColor)
							arrow.style('border-top', '5px solid transparent')
							var boxshift = 0
							var arrowshift = -5
						}
					
						//bring the tooltip div and arrow into view
						arrow.transition()
							.duration(100)
							.style('opacity', 0.8)
						//set the coordinates of the arrow and div centered over the bar based on the offset of the bar and the position of the
						//chart on the page
						arrow.style('left', (-4 - containerLeft + left + (mywidth / 2) - (mywidth - (xScale.bandwidth() * config.widthRatio)) / 2) + 'px')
						div.transition()
							.duration(100)
							.style('opacity', 0.8)
						
						div.style('left', (-4 - containerLeft + left - (mywidth - (xScale.bandwidth() * config.widthRatio)) / 2 + 'px'))
							.style('top', (top + 5 - containerTop + boxshift) + 'px')
						arrow.style('top', (top - containerTop + arrowshift) + 'px')
					}
				})
				.on('mouseout', function(d) {
					//when cursor leaves the bar make the tooltip disappear again
					div.transition()
						.duration(100)
						.style('opacity', 0);
					arrow.transition()
						.duration(100)
						.style('opacity', 0);
				})
		//add error bars if the data set has a confidence interval
		if (dataProvider[0].ci_low != null && dataProvider[0].ci_high != null) {
			chart.selectAll('path').data(dataProvider) //link data to path object
				.enter().append('path') //iterate through data and add a path object for each index in the data
				.attr('class', 'errbar')
				.attr('stroke', config.errorBar.color)
				.style('opacity', config.errorBar.opacity)
				.attr('strokeWidth', config.errorBar.width)
				.attr('d', function(d) { //this function to draw the path
					//get value for the center of the bar and the top and bottom of the error bar (based on the confidence interval)
					var xcenter = xScale(d.label) + barOffset + ((xScale.bandwidth() * config.widthRatio) / 2)
					var ylow = height - yScale(d.ci_low)
					var yhigh = height - yScale(d.ci_high)
					//these are the instructions to make a svg path object, it is a little weird and looking it up is a
					//good way to figure out how the path object works
					//basic idea: you are controlling a pointer and it will draw wherever you move it
					//
					//M move the pointer to an absolute x and y location i.e. M50,50 -- this is the starting point
					//H/h moves the pointer horizontally a given amount i.e. H10 -- you can chain several together,
					//	like H10 10 -5 is move 10 right, move 10 right, move 5 left
					//V/v moves the pointer vertically and has same syntax as H/h
					//
					//The difference between the uppercase and lowercase variations is that the uppercase gives an absolute position and
					//lowercase moves the pointer relative to where it already is
					
					var instructions = 'M' + xcenter + ',' + ylow //Move the pointer to the bottom center of the error bar
					instructions += ' h10 -20 10' //move right 10, left 20, then right 10 to draw the lower horizontal bar and return pointer to middle
					instructions += ' V' + yhigh //move up to the top of the error bar
					instructions += ' h10 -20 10' //make the horizontal bar at the top the same way
					return instructions
				})
		}
}

