



function makeBarChart(dataProvider, container, config) {
		
		var margin = {
			top: 0,
			bottom: 40,
			left: 50,
			right: 0
		}
		

		
		
		
		var style = window.getComputedStyle(container)
		var divwidth = style.getPropertyValue('width')
		divwidth = Number(divwidth.slice(0, divwidth.length - 2))
		var divheight = style.getPropertyValue('height')
		divheight = Number(divheight.slice(0, divheight.length - 2))
		var height = divheight - margin.top - margin.bottom;
		var width = divwidth - margin.left - margin.right;
		
		var containerInfo = document.getElementById(config.cardId).getBoundingClientRect()
		var containerTop = containerInfo.top
		var containerLeft = containerInfo.left
		
		
		
		var yScale = d3.scaleLinear()
			.domain([0, 1.1 * d3.max(dataProvider, function(data) { return data.value })])
			.range([0, height])
		
		var yAxisScale = d3.scaleLinear()
			.domain([0, 1.1 * d3.max(dataProvider, function(data) { return data.value })])
			.range([height, 0])
			
		var xScale = d3.scaleBand()
			.domain(dataProvider.map(function(d) {return d.label}))
			.range([0, width])
			
		var xAxis = d3.axisBottom(xScale)
			.tickSizeOuter(0)

		var yAxis = d3.axisLeft(yAxisScale)
			.tickSize(0)
		
		var yGrid = d3.axisLeft(yAxisScale)
			.tickSizeInner(-width)
			.tickSizeOuter(0)
		
		var widthRatio = 0.5
		
		var barOffset = xScale.bandwidth() * widthRatio / 2
		
		var svg = d3.select(container).append('svg')
		//svg.attr('max-width', width + margin.left + margin.right)
		svg.attr('width', '100%')
		svg.attr('height', height + margin.top + margin.bottom)
		svg.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
			.call(yAxis)
		svg.append('g')
			.attr('class', 'grid')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
			.call(yGrid)
		svg.append('text')
			.attr('class', 'yTitle')
			.attr('transform', 'rotate(-90)')
			.attr('x', -1 * width / 2)
			.attr('y', margin.left / 3)
			.style('font-weight', 'bold')
			.text('Percent (%)')
		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(' + margin.left + ',' + (margin.top + height) + ')')
			.call(xAxis)
		var div = d3.select(container).append('div')
			.attr('id', 'mytooltip')
			.attr('class', 'mytooltip')
			.style('opacity', 0)
			.style('top', '0px')
			.style('left', '0px')
		var arrow = d3.select(container).append('div')
			.style('opacity', 0)
			.style('top', '0px')
			.style('left', '0px')
		var chart = svg.append('g')
		chart.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		chart.selectAll('rect').data(dataProvider)
			.enter().append('rect')
				.attr('id', function(d, i) { return 'rect' + i})
				.attr('width', xScale.bandwidth() * widthRatio)
				.attr('fill', 'rgba(151, 187, 205, 0.6)')
				.attr('opacity', 0.6)
				.attr('stroke', '#97bbcd')
				.attr('strokeWidth', 1)
				.attr('height', function(d) {return yScale(d.value) })
				.attr('x', function(d) {
							return xScale(d.label) + barOffset;
						})
				.attr('y', function(d) {return height - yScale(d.value)})
				.on('mouseover', function(d, i) {
					div.html('<b>Overall<br>' + d.value + '%</b><br>CI(' + d.ci_low + ' - ' + d.ci_high + '), n = ' + d.sample_size)
					
					var style = window.getComputedStyle(document.getElementById('mytooltip'))
					var mywidth = style.getPropertyValue('width')
					mywidth = mywidth.slice(0, mywidth.length - 2)
					var myheight = style.getPropertyValue('height')
					myheight = myheight.slice(0, myheight.length - 2)
					
					var offsets = document.getElementById('rect' + i).getBoundingClientRect();
					var offset = document.getElementById('rect' + i)
					var offsetStyle = window.getComputedStyle(offset)
					console.log(offsetStyle)
					console.log('Top: ' + offsetStyle.getPropertyValue('top') + ', Left: ' + offsetStyle.getPropertyValue('left'))
					var top = offsets.top + window.scrollY;
					var left = offsets.left;
					
					if (yScale(d.value) + myheight < 0.9 * (height - margin.top - margin.bottom)) {
						arrow.attr('class', 'arrow-down')
						var boxshift = -1 * myheight - 18
						var arrowshift = -5
					} else {
						arrow.attr('class', 'arrow-up')
						var boxshift = 0
						var arrowshift = 0
					}
					
					arrow.transition()
						.duration(100)
						.style('opacity', 0.8)
					arrow.style('left', (-4 - containerLeft + left + (mywidth / 2) - (mywidth - (xScale.bandwidth() * widthRatio)) / 2) + 'px')
					div.transition()
						.duration(100)
						.style('opacity', 0.8)
						
					div.style('left', (left - containerLeft - (mywidth - (xScale.bandwidth() * widthRatio)) / 2 + 'px'))
						.style('top', (top + 5 + boxshift - containerTop) + 'px')
					arrow.style('top', (top + arrowshift - containerTop) + 'px')

				})
				.on('mouseout', function(d) {
					div.transition()
						.duration(100)
						.style('opacity', 0)
					arrow.transition()
						.duration(100)
						.style('opacity', 0)
				})
		chart.selectAll('path').data(dataProvider)
			.enter().append('path')
			.attr('class', 'errbar')
			.attr('stroke', '#000')
			.attr('strokeWidth', 1)
			.attr('d', function(d) {
				var xcenter = xScale(d.label) + barOffset + ((xScale.bandwidth() * widthRatio) / 2)
				var ylow = height - yScale(d.ci_low)
				var yhigh = height - yScale(d.ci_high)
				var instructions = 'M' + xcenter + ',' + ylow
				instructions += ' h10 -20 10'
				instructions += ' V' + yhigh
				instructions += ' h10 -20 10'
				return instructions
			})
}
